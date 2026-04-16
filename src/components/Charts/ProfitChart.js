import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts";
import "./charts.css";

const formatTimestamp = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { label, cumulative, profit } = payload[0].payload;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__time">{label}</p>
            <p className="chart-tooltip__row">
                Trade P&L: <span className={profit >= 0 ? "pos" : "neg"}>
                    {profit >= 0 ? "+" : ""}{profit?.toFixed(4)}
                </span>
            </p>
            <p className="chart-tooltip__row">
                Cumulative: <span className={cumulative >= 0 ? "pos" : "neg"}>
                    {cumulative >= 0 ? "+" : ""}{cumulative?.toFixed(4)}
                </span>
            </p>
        </div>
    );
};

const ProfitChart = ({ trades }) => {
    const data = useMemo(() => {
        if (!Array.isArray(trades) || trades.length === 0) return [];
        let cumulative = 0;
        return trades.map((t) => {
            cumulative += t.profit ?? 0;
            return {
                label: formatTimestamp(t.timestamp),
                profit: t.profit ?? 0,
                cumulative: parseFloat(cumulative.toFixed(6)),
            };
        });
    }, [trades]);

    if (data.length === 0) {
        return (
            <div className="chart-empty">
                No trade data yet — P&L curve will appear after the first trade.
            </div>
        );
    }

    const isPositive = data[data.length - 1].cumulative >= 0;

    return (
        <div className="chart-container">
            <h3 className="chart-title">Cumulative P&L</h3>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isPositive ? "#4a8a4a" : "#a33"} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={isPositive ? "#4a8a4a" : "#a33"} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4a" />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: "#9AA5B1", fontSize: 10 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fill: "#9AA5B1", fontSize: 10 }}
                        tickFormatter={(v) => v.toFixed(2)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#528afc" strokeDasharray="4 2" />
                    <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke={isPositive ? "#88dd88" : "#ff8888"}
                        strokeWidth={2}
                        fill="url(#plGradient)"
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

ProfitChart.propTypes = {
    trades: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.string,
        profit: PropTypes.number,
    })),
};

ProfitChart.defaultProps = {
    trades: [],
};

export default ProfitChart;
