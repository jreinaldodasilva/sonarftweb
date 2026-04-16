import React from "react";
import PropTypes from "prop-types";

const TradeHistoryTable = ({ rows }) => (
    <div className="tables-container">
        <table className="tradehistory-table">
            <thead>
                <tr>
                    <th>Index</th>
                    <th>Time</th>
                    <th>Position</th>
                    <th>Symbol</th>
                    <th>Amount</th>
                    <th>Buy Exchange</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th>Sell Exchange</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th>Profit</th>
                    <th>Profit Perc</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(rows) && rows.map((row, index) => (
                    <tr key={`${row.timestamp}-${row.buy_exchange}-${index}`}>
                        <td>{index}</td>
                        <td>{row.timestamp}</td>
                        <td>{row.position}</td>
                        <td>{row.base}/{row.quote}</td>
                        <td>{row.buy_trade_amount}</td>
                        <td>{row.buy_exchange}</td>
                        <td>{row.buy_price}</td>
                        <td>{row.buy_value}</td>
                        <td>{row.sell_exchange}</td>
                        <td>{row.sell_price}</td>
                        <td>{row.sell_value}</td>
                        <td>{row.profit}</td>
                        <td>{row.profit_percentage}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

TradeHistoryTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.string,
        position: PropTypes.string,
        base: PropTypes.string,
        quote: PropTypes.string,
        buy_trade_amount: PropTypes.number,
        buy_exchange: PropTypes.string,
        buy_price: PropTypes.number,
        buy_value: PropTypes.number,
        sell_exchange: PropTypes.string,
        sell_price: PropTypes.number,
        sell_value: PropTypes.number,
        profit: PropTypes.number,
        profit_percentage: PropTypes.number,
    })),
};

TradeHistoryTable.defaultProps = {
    rows: [],
};

export default TradeHistoryTable;
