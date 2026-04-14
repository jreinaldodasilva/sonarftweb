import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cchatgpt.css"; // Assuming you have this CSS file

const CChatGPT = () => {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First, get the top 20 coins
                const topCoinsResponse = await axios.get(
                    "https://api.coingecko.com/api/v3/coins/markets",
                    {
                        params: {
                            vs_currency: "usd",
                            order: "market_cap_desc",
                            per_page: 1,
                            page: 1,
                        },
                    }
                );

                const coinIds = topCoinsResponse.data
                    .map((coin) => coin.id)
                    .join(",");

                // Then get the price for each one
                const response = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
                );
                setCryptoData(Object.entries(response.data));
            } catch (error) {
                console.error("Could not fetch crypto data", error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 180000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <section className="cchatgpt-container">
            <div>
                {cryptoData.map((data, index) => (
                    <div key={index} className="cchatgpt-item">
                        <span>{data[0].toUpperCase()}:</span>
                        <span>{` $${data[1].usd}`}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CChatGPT;
