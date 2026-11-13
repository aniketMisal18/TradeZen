import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useState } from "react";
import { useEffect } from "react";

const Orders = () => {

  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await axios
        .get(
          "http://localhost:3010/order/getOrder",
          {
            withCredentials: true
          }
        );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);


  return (
    <div className="orders">
      <div className="no-orders">
        <h3 className="title">Positions </h3>

        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg Price</th>
                <th>Status</th>
                <th>Order Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => {
                return (
                  <tr>
                    <td>{order.symbol}</td>
                    <td>{order.qty}</td>
                    <td>{order.avgPrice}</td>
                    <td className="complete"><span>{order.status}</span></td>
                    <td>{order.orderType}</td>
                    <td>{order.action}</td>
                  </tr>
                   );
                    })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Orders;
