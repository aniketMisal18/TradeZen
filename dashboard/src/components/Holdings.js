import React from "react";

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


import { useUser } from "../context/UserContext";
import { usePrices } from "../context/LivePricesContext";
import { useGloble } from "../context/GlobleContext";


import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";



const Holdings = () => {

  const [holdings, setHoldings] = useState([]);
  const [Refresh, setRefresh] = useState(false);
  const { user } = useUser();
  const { livePrices } = usePrices();
  const { IsPanelOpen, setIsPanelOpen } = useGloble();



  let totalInvestment = 0;
  let totalCurrentValue = 0;


  holdings.forEach((stock) => {
    const avgPrice = Number(stock.avgPrice) || 0;
    const qty = Number(stock.qty) || 0;

    const livePrice = Number(livePrices[stock.symbol]?.ltp) || avgPrice;

    totalCurrentValue += livePrice * qty;
    totalInvestment += avgPrice * qty;
  });

  const handleSell = (stock) => {
    if (IsPanelOpen.isOpen === false) {
      setIsPanelOpen({
        isOpen: true,
        Theme: false,
        Symbol: stock.symbol,
        max: stock.qty
      });
    }
  }



  const getHoldings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3010/holding/getHolding",
        {
          withCredentials: true
        }
      );

      setHoldings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHoldings();
  }, [Refresh]);






  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>

            <th></th>
          </tr>

          {holdings.map((stock, index) => {
            const avgPrice = Number(stock.avgPrice) || 0;
            const qty = Number(stock.qty) || 0;

            const livePrice =
              Number(livePrices[stock.symbol]?.ltp) || avgPrice;

            const currValue = livePrice * qty;

            const pnl = currValue - avgPrice * qty;

            const isprofit = pnl >= 0;
            const profClass = isprofit ? "profit" : "loss";

            const netChange =
              avgPrice !== 0
                ? ((livePrice - avgPrice) / avgPrice) * 100
                : 0;

            return (
              <tr key={index} >
                <td>{stock.symbol}</td>
                <td>{qty}</td>
                <td>{avgPrice.toFixed(2)}</td>
                <td>{livePrice.toFixed(2)}</td>
                <td>{currValue.toFixed(2)}</td>
                <td className={profClass}>{pnl.toFixed(2)}</td>
                <td className={profClass}>{netChange.toFixed(2)}%</td>
                {/* <td className={dayClass}>{stock.day}</td> */}

                <td> <Tooltip
                  title="Sell (S)"
                  placement="top"
                  arrow
                  TransitionComponent={Grow}
                >
                  <button className="sell-btn-curr" onClick={() => handleSell(stock)}>Sell</button>
                </Tooltip></td>

              </tr>
            )

          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ₹{totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ₹{totalCurrentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>
        <div  className={
          totalCurrentValue >= totalInvestment
            ? "profit col"
            : "loss col"
        }>
          <h4 className={
          totalCurrentValue >= totalInvestment
            ? "hprofit col hol4"
            : "hloss col hol4"
        } >
            {(totalCurrentValue - totalInvestment).toFixed(2)}{" "}
            {totalInvestment !== 0
              ? (((totalCurrentValue - totalInvestment) / totalInvestment) * 100).toFixed(2)
              : "0.00"}
            %
          </h4>
          <p>P&L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
