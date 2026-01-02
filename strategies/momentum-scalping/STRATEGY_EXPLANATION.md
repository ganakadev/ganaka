# Momentum Scalping Strategy - Detailed Explanation

## Overview

This is an **automated trading strategy** that identifies stocks with strong upward momentum and places buy orders with predefined exit points. The strategy runs during a specific trading window (currently 10:00 AM to 10:45 AM IST) and executes every 5 minutes.

**Scalping** = A trading style where you buy and sell stocks quickly (within minutes to hours) to capture small price movements (typically 1-3%).

**Momentum** = The tendency of stock prices to continue moving in the same direction (upward in this case) due to buying pressure.

---

## Key Concepts & Abbreviations

### Trading Terms
- **NSE** = National Stock Exchange (India's main stock exchange)
- **Symbol** = Stock ticker code (e.g., "RELIANCE", "TCS")
- **Quote** = Current market price and order book data for a stock
- **Order Book** = List of all buy and sell orders waiting to be executed
- **Bid** = Price buyers are willing to pay
- **Ask/Offer** = Price sellers are willing to accept
- **Last Price** = Most recent transaction price
- **OHLC** = Open, High, Low, Close prices for a time period
- **Volume** = Number of shares traded
- **Candles/Candlesticks** = Visual representation of price movement (open, high, low, close) over a time period

### Strategy-Specific Terms
- **Buyer Control** = Percentage indicating how much buying pressure exists vs selling pressure (0-100%)
- **Order Book Snapshot** = A record of the order book at a specific moment
- **Quote Timeline** = Series of order book snapshots over time (one per minute)
- **Entry Price** = Price at which you buy the stock
- **Stop Loss** = Price at which you automatically sell to limit losses
- **Take Profit** = Price at which you automatically sell to lock in gains
- **Volatility** = Measure of how much price fluctuates

---

## Strategy Flow

### 1. **Stock Selection**
- Fetches **top gainers** (stocks with highest price increases) from the market
- Only processes stocks from this list (focuses on momentum stocks)

### 2. **Data Collection** (for each stock)
- **Quote Timeline**: Fetches at least 30 minutes of order book snapshots (one per minute)
- **Historical Candles**: Fetches 1-minute price candles from the last 5 days + today
- **Current Quote**: Gets the latest price and order book data

### 3. **Analysis & Scoring**
The strategy calculates a **prediction score** (0 to 1) using four factors:

#### A. **Order Book Buyer Control Trend** (40% weight)
Measures if buying pressure is increasing over time.

**Buyer Control Calculation** (Hybrid Method):
```
1. Price-Weighted Depth (40% of buyer control):
   - For each buy/sell order in the order book:
     distance = |order_price - current_price| / current_price
     weight = e^(-distance × 10)  [exponential decay]
     weighted_buy += order_quantity × weight
     weighted_sell += order_quantity × weight
   
   price_weighted = (weighted_buy / (weighted_buy + weighted_sell)) × 100

2. Total Quantity Method (30% of buyer control):
   total_quantity = (total_buy_quantity / (total_buy + total_sell)) × 100

3. Near-Price Concentration (20% of buyer control):
   - Counts buy/sell orders within ±0.5% of current price
   near_price = (near_buy / (near_buy + near_sell)) × 100

4. Bid-Ask Ratio (10% of buyer control):
   bid_ask = (bid_quantity / (bid_quantity + ask_quantity)) × 100

Final Buyer Control = (price_weighted × 0.4 + total_quantity × 0.3 + 
                       near_price × 0.2 + bid_ask × 0.1) / total_weight
```

**Trend Calculation**:
```
- Split the 30+ snapshots into first half and second half
- Calculate average buyer control for each half
- Trend = (second_half_avg - first_half_avg) / 100
- Normalized to range [-1, 1] where positive = increasing buying pressure
```

**Score Contribution**:
```
order_book_score = (trend + 1) / 2  [converts -1 to 1 range → 0 to 1]
final_contribution = order_book_score × 0.4
```

#### B. **Candle Price Momentum** (30% weight)
Measures if the stock price is trending upward.

**Calculation**:
```
- Compare recent 10 candles vs earlier 10 candles
- recent_avg_price = average(close prices of last 10 candles)
- earlier_avg_price = average(close prices of first 10 candles)
- price_change = (recent_avg - earlier_avg) / earlier_avg
- price_trend = clamp(price_change × 10, -1, 1)  [scaled to -1 to 1]
```

**Score Contribution**:
```
momentum_score = (price_trend + 1) / 2  [converts to 0 to 1]
final_contribution = momentum_score × 0.3
```

#### C. **Volume Trend** (20% weight)
Measures if trading volume is increasing (more activity = stronger momentum).

**Calculation**:
```
- Compare recent 10 candles vs earlier 10 candles
- recent_avg_volume = average(volume of last 10 candles)
- earlier_avg_volume = average(volume of first 10 candles)
- volume_change = (recent_avg - earlier_avg) / earlier_avg
- volume_trend = clamp(volume_change, -1, 1)
```

**Score Contribution**:
```
volume_score = (volume_trend + 1) / 2  [converts to 0 to 1]
final_contribution = volume_score × 0.2
```

#### D. **Price Action** (10% weight)
Measures current price vs today's opening price.

**Calculation**:
```
price_change = (current_price - open_price) / open_price
price_action_score = clamp(price_change × 10 + 0.5, 0, 1)
```

**Score Contribution**:
```
final_contribution = price_action_score × 0.1
```

#### Final Prediction Score
```
prediction_score = (order_book_score × 0.4) + 
                   (momentum_score × 0.3) + 
                   (volume_score × 0.2) + 
                   (price_action_score × 0.1)
```

**Threshold**: Score must be **> 0.8** (80%) to place an order.

---

### 4. **Volatility Calculation**
Used to adjust stop loss levels.

**Calculation**:
```
For each candle:
  price_range = (high - low) / close
Average all ranges:
  avg_range = average(all price_ranges)
volatility = min(avg_range × 10, 1)  [normalized to 0-1]
```

---

### 5. **Order Placement**
If prediction score > 0.8:

**Entry Price** = Current last price

**Take Profit Price**:
```
take_profit_price = entry_price × (1 + 2.0 / 100)
                  = entry_price × 1.02
```
Targets a **2% gain**.

**Stop Loss Price**:
```
stop_loss_percent = min(1.5 × (1 + volatility), 2.0)
stop_loss_price = entry_price × (1 - stop_loss_percent / 100)
```
- Base stop loss: **1.5%**
- Adjusted upward based on volatility (more volatile = wider stop loss)
- Capped at **2% maximum**

**Example**:
- Entry: ₹100
- Take Profit: ₹102 (2% gain)
- Stop Loss (low volatility): ₹98.50 (1.5% loss)
- Stop Loss (high volatility): ₹98.00 (2% loss)

---

## Execution Details

### Trading Window
- **Start**: 10:00 AM IST
- **End**: 10:45 AM IST
- **Interval**: Runs every **5 minutes** (10:00, 10:05, 10:10, ..., 10:45)

### Risk Management
- **One order per stock**: Once an order is placed for a stock, it won't place another (prevents over-trading)
- **Minimum data requirement**: Needs at least 30 order book snapshots (30 minutes of data)
- **Minimum candles**: Needs at least 10 candles for analysis

### Order Lifecycle
1. Order is placed with entry price, stop loss, and take profit
2. Order is tracked in the database
3. External system (broker/exchange) executes:
   - If price reaches **take profit** → Sell automatically (profit locked)
   - If price reaches **stop loss** → Sell automatically (loss limited)
   - Otherwise → Hold until one of the above triggers

---

## Mathematical Summary

### Key Formulas

**Buyer Control** (simplified):
```
BC = 0.4×PW + 0.3×TQ + 0.2×NP + 0.1×BA
where:
  PW = Price-weighted depth percentage
  TQ = Total quantity percentage  
  NP = Near-price concentration percentage
  BA = Bid-ask ratio percentage
```

**Prediction Score**:
```
PS = 0.4×OB + 0.3×PM + 0.2×VT + 0.1×PA
where:
  OB = Order book trend score (0-1)
  PM = Price momentum score (0-1)
  VT = Volume trend score (0-1)
  PA = Price action score (0-1)
```

**Exit Prices**:
```
Take Profit = Entry × 1.02
Stop Loss = Entry × (1 - min(1.5×(1+V), 2.0)/100)
where V = volatility (0-1)
```

---

## Why This Strategy Works

1. **Momentum Continuation**: Stocks showing strong buying pressure tend to continue rising short-term
2. **Multiple Signals**: Combines 4 different indicators to reduce false signals
3. **Quick Exits**: Targets small gains (2%) and cuts losses quickly (1.5-2%)
4. **Risk Management**: Stop loss prevents large losses, take profit locks in gains
5. **Data-Driven**: Uses quantitative analysis rather than emotions

---

## Important Notes

- This is a **scalping strategy** - designed for quick in-and-out trades
- Requires **sufficient liquidity** (stocks with active trading)
- Works best during **high volatility periods** (morning trading hours)
- **Not guaranteed** - markets are unpredictable, losses can occur
- Requires **real-time data** and **automated execution** infrastructure
