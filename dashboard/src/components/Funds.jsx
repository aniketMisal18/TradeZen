import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Funds = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const getAccount = async () => {
      try {
        const response = await fetch("http://localhost:3010/account", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          setAccount(data.account);
        }
      } catch (error) {
        console.log("Account fetch error:", error);
      }
    };

    getAccount();
  }, []);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!account) {
    return <div className="funds">Loading funds...</div>;
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>

        <Link className="btn btn-green" to="#">
          Add funds
        </Link>

        <Link className="btn btn-blue" to="#">
          Withdraw
        </Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">

            {/* Available Margin */}
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">
                ₹{formatMoney(account.availableBalance)}
              </p>
            </div>

            {/* Used Margin */}
            <div className="data">
              <p>Used margin</p>
              <p className="imp">
                ₹{formatMoney(account.usedMargin)}
              </p>
            </div>

            {/* Available Cash */}
            <div className="data">
              <p>Available cash</p>
              <p className="imp">
                ₹{formatMoney(account.availableBalance)}
              </p>
            </div>

            <hr />

            {/* Opening Balance */}
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{formatMoney(account.initialBalance)}</p>
            </div>

            {/* Initial Balance */}
            <div className="data">
              <p>Initial Balance</p>
              <p>₹{formatMoney(account.initialBalance)}</p>
            </div>

            {/* Payin */}
            <div className="data">
              <p>Payin</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>

            <hr />

            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Collateral (Equity)</p>
              <p>₹0.00</p>
            </div>

            <div className="data">
              <p>Total Collateral</p>
              <p>₹0.00</p>
            </div>

            <hr />

            {/* Realized P&L */}
            <div className="data">
              <p>Realized P&L</p>
              <p
                className={
                  account.realizedPnL >= 0
                    ? "imp colored"
                    : "imp loss"
                }
              >
                ₹{formatMoney(account.realizedPnL)}
              </p>
            </div>

          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>

            <Link className="btn btn-blue" to="#">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
