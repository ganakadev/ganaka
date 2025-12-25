import type { QuoteData } from "@ganaka/db";
import { Table } from "@mantine/core";
import { isQuoteData } from "../../utils/buyerControl";

export function QuoteDataTables({
  quoteData,
}: {
  quoteData: QuoteData | null | undefined;
  selectedDate: Date | null;
}) {
  // Validate and extract quote data
  if (!quoteData || !isQuoteData(quoteData)) {
    return (
      <div className="border rounded-md p-4">
        <p className="text-sm text-gray-500">No quote data available</p>
      </div>
    );
  }

  if (quoteData.status !== "SUCCESS") {
    return (
      <div className="border rounded-md p-4">
        <p className="text-sm text-gray-500">
          Quote data status: {quoteData.status}
        </p>
      </div>
    );
  }

  // VARIABLES
  const payload = quoteData.payload;
  const {
    ohlc,
    depth,
    volume,
    day_change,
    day_change_perc,
    total_buy_quantity,
    total_sell_quantity,
  } = payload;

  // DRAW
  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* OHLC Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">OHLC</h3>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          tabularNums
          style={{ tableLayout: "fixed" }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[25%]">Open</Table.Th>
              <Table.Th className="w-[25%]">High</Table.Th>
              <Table.Th className="w-[25%]">Low</Table.Th>
              <Table.Th className="w-[25%]">Close</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <span className="font-medium">
                  ₹
                  {ohlc.open.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
              <Table.Td>
                <span className="font-medium">
                  ₹
                  {ohlc.high.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
              <Table.Td>
                <span className="font-medium">
                  ₹
                  {ohlc.low.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
              <Table.Td>
                <span className="font-medium">
                  ₹
                  {ohlc.close.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      {/* Summary Metrics Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Summary</h3>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          tabularNums
          style={{ tableLayout: "fixed" }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[20%]">Volume</Table.Th>
              <Table.Th className="w-[20%]">Day Change</Table.Th>
              <Table.Th className="w-[20%]">Day Change %</Table.Th>
              <Table.Th className="w-[20%]">Total Buy Quantity</Table.Th>
              <Table.Th className="w-[20%]">Total Sell Quantity</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <span className="text-sm">
                  {volume.toLocaleString("en-IN")}
                </span>
              </Table.Td>
              <Table.Td>
                <span
                  className={`text-sm font-medium ${
                    day_change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹
                  {day_change.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </Table.Td>
              <Table.Td>
                <span
                  className={`text-sm font-medium ${
                    day_change_perc >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {day_change_perc.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </span>
              </Table.Td>
              <Table.Td>
                <span className="text-sm">
                  {total_buy_quantity.toLocaleString("en-IN")}
                </span>
              </Table.Td>
              <Table.Td>
                <span className="text-sm">
                  {total_sell_quantity.toLocaleString("en-IN")}
                </span>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      {/* Depth Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Buy Orders Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Buy Orders</h3>
          {depth?.buy && depth.buy.length > 0 ? (
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              tabularNums
              style={{ tableLayout: "fixed" }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-[50%]">Price</Table.Th>
                  <Table.Th className="w-[50%]">Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {depth.buy.map((order, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <span className="text-sm">
                        ₹
                        {order.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <span className="text-sm">
                        {order.quantity.toLocaleString("en-IN")}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">No buy orders available</p>
            </div>
          )}
        </div>

        {/* Sell Orders Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sell Orders</h3>
          {depth?.sell && depth.sell.length > 0 ? (
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              tabularNums
              style={{ tableLayout: "fixed" }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-[50%]">Price</Table.Th>
                  <Table.Th className="w-[50%]">Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {depth.sell.map((order, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <span className="text-sm">
                        ₹
                        {order.price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <span className="text-sm">
                        {order.quantity.toLocaleString("en-IN")}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">No sell orders available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
