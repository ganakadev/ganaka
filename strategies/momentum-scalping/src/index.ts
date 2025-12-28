import { ganaka } from "@ganaka/sdk";
import dayjs from "dayjs";
import dotenv from "dotenv";
dotenv.config();

// Configuration constants
const MIN_ORDER_BOOK_SNAPSHOTS = 30; // Minimum 30 minutes of data
const PREDICTION_THRESHOLD = 0.8; // Score > 0.6 indicates >2% upside potential
const TARGET_GAIN_PERCENT = 2.0; // Target 2% gain
const DEFAULT_STOP_LOSS_PERCENT = 1.5; // Default 1.5% stop loss

// Trading window
const tradingWindowStart = dayjs().set("date", 22).set("hour", 10).set("minute", 0);
const tradingWindowEnd = dayjs().set("date", 22).set("hour", 10).set("minute", 10);

// Track stocks that have already had orders placed
const stocksWithOrders = new Set<string>();

/**
 * Calculate buyer control percentage using hybrid method
 * Simplified version for strategy use
 */
function calculateBuyerControl(quoteData: {
  status: string;
  payload: {
    last_price: number;
    depth: {
      buy: { price: number; quantity: number }[];
      sell: { price: number; quantity: number }[];
    };
    total_buy_quantity: number;
    total_sell_quantity: number;
    bid_quantity: number | null;
  };
}): number | null {
  if (quoteData.status !== "SUCCESS" || !quoteData.payload.depth) {
    return null;
  }

  const currentPrice = quoteData.payload.last_price;
  if (!currentPrice || currentPrice <= 0) {
    return null;
  }

  // Price-weighted depth calculation
  const decayFactor = 10;
  let weightedBuy = 0;
  let weightedSell = 0;

  for (const order of quoteData.payload.depth.buy) {
    const distance = Math.abs(order.price - currentPrice) / currentPrice;
    const weight = Math.exp(-distance * decayFactor);
    weightedBuy += order.quantity * weight;
  }

  for (const order of quoteData.payload.depth.sell) {
    const distance = Math.abs(order.price - currentPrice) / currentPrice;
    const weight = Math.exp(-distance * decayFactor);
    weightedSell += order.quantity * weight;
  }

  const priceWeighted =
    weightedBuy + weightedSell > 0 ? (weightedBuy / (weightedBuy + weightedSell)) * 100 : null;

  // Total quantity method
  const totalBuy = quoteData.payload.total_buy_quantity;
  const totalSell = quoteData.payload.total_sell_quantity;
  const totalQuantity = totalBuy + totalSell > 0 ? (totalBuy / (totalBuy + totalSell)) * 100 : null;

  // Hybrid: 40% price-weighted + 30% total quantity + 20% near-price + 10% bid-ask
  if (priceWeighted === null || totalQuantity === null) {
    return null;
  }

  const nearPrice = calculateNearPriceConcentration(quoteData, currentPrice);
  const bidAsk = calculateBidAsk(quoteData);

  let weightedSum = priceWeighted * 0.4 + totalQuantity * 0.3;
  let totalWeight = 0.7;

  if (nearPrice !== null) {
    weightedSum += nearPrice * 0.2;
    totalWeight += 0.2;
  }

  if (bidAsk !== null) {
    weightedSum += bidAsk * 0.1;
    totalWeight += 0.1;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : null;
}

function calculateNearPriceConcentration(
  quoteData: {
    payload: {
      last_price: number;
      depth: {
        buy: { price: number; quantity: number }[];
        sell: { price: number; quantity: number }[];
      };
    };
  },
  currentPrice: number
): number | null {
  const priceRange = 0.005; // ±0.5%
  const minPrice = currentPrice * (1 - priceRange);
  const maxPrice = currentPrice * (1 + priceRange);

  let nearBuy = 0;
  let nearSell = 0;

  for (const order of quoteData.payload.depth.buy) {
    if (order.price >= minPrice && order.price <= maxPrice) {
      nearBuy += order.quantity;
    }
  }

  for (const order of quoteData.payload.depth.sell) {
    if (order.price >= minPrice && order.price <= maxPrice) {
      nearSell += order.quantity;
    }
  }

  const total = nearBuy + nearSell;
  return total > 0 ? (nearBuy / total) * 100 : null;
}

function calculateBidAsk(quoteData: {
  payload: {
    bid_quantity: number | null;
    depth: {
      sell: { price: number; quantity: number }[];
    };
  };
}): number | null {
  const bidQuantity = quoteData.payload.bid_quantity || 0;
  const askQuantity = quoteData.payload.depth.sell[0]?.quantity || 0;
  const total = bidQuantity + askQuantity;
  return total > 0 ? (bidQuantity / total) * 100 : null;
}

/**
 * Analyze order book trend from quote timeline
 */
function analyzeOrderBookTrend(
  quoteTimeline: Array<{
    timestamp: Date;
    quoteData: {
      status: string;
      payload: {
        last_price: number;
        depth: {
          buy: { price: number; quantity: number }[];
          sell: { price: number; quantity: number }[];
        };
        total_buy_quantity: number;
        total_sell_quantity: number;
        bid_quantity: number | null;
      };
    };
  }>
): {
  buyerControlTrend: number; // -1 to 1, positive = increasing
  averageBuyerControl: number;
  isValid: boolean;
} {
  if (quoteTimeline.length < MIN_ORDER_BOOK_SNAPSHOTS) {
    return { buyerControlTrend: 0, averageBuyerControl: 0, isValid: false };
  }

  const buyerControls: number[] = [];
  for (const snapshot of quoteTimeline) {
    const buyerControl = calculateBuyerControl(snapshot.quoteData);
    if (buyerControl !== null) {
      buyerControls.push(buyerControl);
    }
  }

  if (buyerControls.length < MIN_ORDER_BOOK_SNAPSHOTS) {
    return { buyerControlTrend: 0, averageBuyerControl: 0, isValid: false };
  }

  // Calculate trend using linear regression (simple slope)
  const n = buyerControls.length;
  const midPoint = Math.floor(n / 2);
  const firstHalf = buyerControls.slice(0, midPoint);
  const secondHalf = buyerControls.slice(midPoint);

  const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  // Normalize trend to -1 to 1 range
  const trend = (secondHalfAvg - firstHalfAvg) / 100; // Divide by 100 to normalize
  const averageBuyerControl = buyerControls.reduce((a, b) => a + b, 0) / buyerControls.length;

  return {
    buyerControlTrend: Math.max(-1, Math.min(1, trend)),
    averageBuyerControl,
    isValid: true,
  };
}

/**
 * Analyze candle patterns for momentum
 * Candles format: [timestamp, open, high, low, close, volume, turnover]
 */
function analyzeCandleMomentum(candles: number[][]): {
  priceTrend: number; // -1 to 1
  volumeTrend: number; // -1 to 1
  volatility: number; // 0 to 1
} {
  if (candles.length < 10) {
    return { priceTrend: 0, volumeTrend: 0, volatility: 0 };
  }

  // Price trend: compare recent vs earlier prices
  const recentCandles = candles.slice(-10);
  const earlierCandles = candles.slice(0, 10);

  // Access by index: [0]=timestamp, [1]=open, [2]=high, [3]=low, [4]=close, [5]=volume, [6]=turnover
  const recentAvg = recentCandles.reduce((sum, c) => sum + (c[4] || 0), 0) / recentCandles.length; // close price
  const earlierAvg =
    earlierCandles.reduce((sum, c) => sum + (c[4] || 0), 0) / earlierCandles.length;

  const priceChange = earlierAvg > 0 ? (recentAvg - earlierAvg) / earlierAvg : 0;
  const priceTrend = Math.max(-1, Math.min(1, priceChange * 10)); // Scale to -1 to 1

  // Volume trend
  const recentVolume =
    recentCandles.reduce((sum, c) => sum + (c[5] || 0), 0) / recentCandles.length;
  const earlierVolume =
    earlierCandles.reduce((sum, c) => sum + (c[5] || 0), 0) / earlierCandles.length;
  const volumeChange = earlierVolume > 0 ? (recentVolume - earlierVolume) / earlierVolume : 0;
  const volumeTrend = Math.max(-1, Math.min(1, volumeChange));

  // Volatility: average price range
  const ranges = candles
    .filter((c) => c[4] && c[4] > 0) // Filter out invalid candles
    .map((c) => (c[2] - c[3]) / c[4]); // (high - low) / close
  const avgRange = ranges.length > 0 ? ranges.reduce((a, b) => a + b, 0) / ranges.length : 0;
  const volatility = Math.min(1, avgRange * 10); // Normalize to 0-1

  return { priceTrend, volumeTrend, volatility };
}

/**
 * Calculate prediction score
 */
function calculatePredictionScore(
  orderBookTrend: { buyerControlTrend: number; averageBuyerControl: number; isValid: boolean },
  candleMomentum: { priceTrend: number; volumeTrend: number; volatility: number },
  currentPrice: number,
  openPrice: number
): number {
  if (!orderBookTrend.isValid) {
    return 0;
  }

  // Order book buyer control trend (40% weight)
  const orderBookScore = (orderBookTrend.buyerControlTrend + 1) / 2; // Convert -1 to 1 range to 0 to 1
  const orderBookWeight = 0.4;

  // Candle momentum (30% weight)
  const momentumScore = (candleMomentum.priceTrend + 1) / 2;
  const momentumWeight = 0.3;

  // Volume trend (20% weight)
  const volumeScore = (candleMomentum.volumeTrend + 1) / 2;
  const volumeWeight = 0.2;

  // Price action (10% weight) - current price vs open
  const priceChange = openPrice > 0 ? (currentPrice - openPrice) / openPrice : 0;
  const priceActionScore = Math.max(0, Math.min(1, priceChange * 10 + 0.5)); // Normalize
  const priceActionWeight = 0.1;

  const totalScore =
    orderBookScore * orderBookWeight +
    momentumScore * momentumWeight +
    volumeScore * volumeWeight +
    priceActionScore * priceActionWeight;

  return totalScore;
}

/**
 * Calculate stop loss and take profit prices
 */
function calculateStopLossAndTakeProfit(
  entryPrice: number,
  volatility: number
): { stopLossPrice: number; takeProfitPrice: number } {
  // Take profit: target 2% gain
  const takeProfitPrice = entryPrice * (1 + TARGET_GAIN_PERCENT / 100);

  // Stop loss: use volatility-adjusted stop loss
  // Higher volatility = wider stop loss, but cap at 2%
  const stopLossPercent = Math.min(DEFAULT_STOP_LOSS_PERCENT * (1 + volatility), 2.0);
  const stopLossPrice = entryPrice * (1 - stopLossPercent / 100);

  return { stopLossPrice, takeProfitPrice };
}

async function main() {
  await ganaka({
    fn: async ({
      fetchShortlist,
      fetchQuote,
      fetchQuoteTimeline,
      fetchCandles,
      placeOrder,
      currentTimestamp,
    }) => {
      const currentTime = dayjs(currentTimestamp);
      const currentDate = dayjs(currentTimestamp).format("YYYY-MM-DD");

      console.log(`[${currentTime.format("HH:mm:ss")}] Running momentum scalping strategy...`);

      // Fetch shortlists
      const topGainers = await fetchShortlist("top-gainers", currentTimestamp);

      // Combine and deduplicate stocks
      const allStocks = new Set<string>();
      if (topGainers) {
        topGainers.forEach((stock) => allStocks.add(stock.nseSymbol));
      }
      console.log(`Found ${allStocks.size} unique stocks in shortlists`);

      // Process each stock
      for (const symbol of allStocks) {
        try {
          // Fetch quote timeline for today
          const quoteTimeline = await fetchQuoteTimeline(symbol, currentTimestamp);
          console.log(`Fetched ${quoteTimeline.length} quote timeline snapshots for ${symbol}`);

          // Validate minimum data requirement
          if (quoteTimeline.length < MIN_ORDER_BOOK_SNAPSHOTS) {
            console.log(
              `[${symbol}] Insufficient order book data: ${quoteTimeline.length} snapshots (need ${MIN_ORDER_BOOK_SNAPSHOTS})`
            );
            continue;
          }

          // Analyze order book trend
          const orderBookTrend = analyzeOrderBookTrend(quoteTimeline);
          console.log(
            `[${symbol}] Order book trend: ${orderBookTrend.buyerControlTrend.toFixed(3)}`
          );

          if (!orderBookTrend.isValid) {
            console.log(`[${symbol}] Order book analysis invalid`);
            continue;
          }

          // Fetch historical candles (last 5 days + today)
          const endDate = dayjs(currentTimestamp);
          const startDate = endDate.subtract(5, "days");

          console.log(
            `[${symbol}] Fetching candles from ${startDate.format(
              "YYYY-MM-DDTHH:mm:ss"
            )} to ${endDate.format("YYYY-MM-DDTHH:mm:ss")}`
          );

          const candlesData = await fetchCandles({
            symbol,
            interval: "1minute",
            start_time: startDate.format("YYYY-MM-DDTHH:mm:ss"),
            end_time: endDate.format("YYYY-MM-DDTHH:mm:ss"),
          });

          console.log(`[${symbol}] Fetched ${candlesData.payload.candles.length} candles`);

          if (!candlesData || !candlesData.payload || candlesData.payload.candles.length < 10) {
            console.log(`[${symbol}] Insufficient candle data`);
            continue;
          }

          // Analyze candle momentum
          const candleMomentum = analyzeCandleMomentum(candlesData.payload.candles);

          console.log(
            `[${symbol}] Candle momentum: ${candleMomentum.priceTrend.toFixed(
              3
            )}, ${candleMomentum.volumeTrend.toFixed(3)}, ${candleMomentum.volatility.toFixed(3)}`
          );

          // Get current quote for entry price
          const currentQuote = await fetchQuote(symbol, currentTimestamp);

          console.log(`[${symbol}] Current quote: ${currentQuote?.payload.last_price}`);

          if (!currentQuote || currentQuote.status !== "SUCCESS") {
            console.log(`[${symbol}] Failed to fetch current quote`);
            continue;
          }

          const entryPrice = currentQuote.payload.last_price;
          const openPrice = currentQuote.payload.ohlc.open;

          console.log(
            `[${symbol}] Entry price: ${entryPrice.toFixed(2)}, Open price: ${openPrice.toFixed(2)}`
          );

          // Calculate prediction score
          const predictionScore = calculatePredictionScore(
            orderBookTrend,
            candleMomentum,
            entryPrice,
            openPrice
          );

          console.log(
            `[${symbol}] Prediction score: ${predictionScore.toFixed(3)}, ` +
              `Buyer control trend: ${orderBookTrend.buyerControlTrend.toFixed(3)}, ` +
              `Price trend: ${candleMomentum.priceTrend.toFixed(3)}`
          );

          // If prediction score exceeds threshold, place order
          if (predictionScore > PREDICTION_THRESHOLD) {
            // Check if we've already placed an order for this stock
            if (stocksWithOrders.has(symbol)) {
              console.log(`[${symbol}] Order already placed for this stock, skipping`);
              continue;
            }

            const { stopLossPrice, takeProfitPrice } = calculateStopLossAndTakeProfit(
              entryPrice,
              candleMomentum.volatility
            );

            console.log(
              `[${symbol}] Placing order: Entry=${entryPrice.toFixed(2)}, ` +
                `StopLoss=${stopLossPrice.toFixed(2)}, TakeProfit=${takeProfitPrice.toFixed(2)}`
            );

            placeOrder({
              entryPrice,
              nseSymbol: symbol,
              stopLossPrice,
              takeProfitPrice,
              timestamp: currentTimestamp,
            });

            // Track that we've placed an order for this stock
            stocksWithOrders.add(symbol);
          }
        } catch (error) {
          console.error(`[${symbol}] Error processing stock:`, error);
          // Continue with next stock
        }
      }
    },
    intervalMinutes: 5,
    startTime: tradingWindowStart.toDate(),
    endTime: tradingWindowEnd.toDate(),
    deleteRunAfterCompletion: false,
  });
}

main();
