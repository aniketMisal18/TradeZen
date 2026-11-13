import React from "react";
import axios from "axios";

import { useState } from "react";
import { useEffect } from "react";
import { usePrices } from "../context/LivePricesContext";
import { useGloble } from "../context/GlobleContext";



import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";



const Positions = () => {

  const [positions, setPositions] = useState([]);
  const { livePrices } = usePrices();
  const { IsPanelOpen, setIsPanelOpen } = useGloble();

  const handleSell = (stock) => {
    if (IsPanelOpen.isOpen === false) {
      setIsPanelOpen({
        isOpen: true,
        Theme: false,
        Symbol: stock.Instrument,
        max: stock.qty
      });

    }
  }

  const getPositions = async () => {
    try {
      const res = await axios
        .get(
          "http://localhost:3010/position/getPosition",
          {
            withCredentials: true
          }
        );

      setPositions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPositions();
  }, []);

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock, index) => {

              const avgPrice = Number(stock.AvgPrice) || 0;
              const qty = Number(stock.qty) || 0;
              const livePrice =
                Number(livePrices[stock.Instrument]?.ltp) ||
                Number(stock.price) ||
                avgPrice;

              const currValue = livePrice * qty;

              const pnl = currValue - avgPrice * qty;

              const isprofit = pnl >= 0;
              const profClass = isprofit ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>CNC</td>
                  <td>{stock.Instrument}</td>
                  <td>{qty}</td>
                  <td>{avgPrice.toFixed(2)}</td>
                  <td>{livePrice.toFixed(2)}</td>
                  <td className={profClass}>
                    {pnl.toFixed(2)}
                  </td>

                  <td> <Tooltip
                    title="Sell (S)"
                    placement="top"
                    arrow
                    TransitionComponent={Grow}
                  >
                    <button className="sell-btn-curr" onClick={() => handleSell(stock)}>Sell</button>
                  </Tooltip></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
