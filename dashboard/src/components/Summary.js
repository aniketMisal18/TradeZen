
import React, { useMemo, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { usePrices } from "../context/LivePricesContext";
import axios from "axios";
import "../css/summary.css"

const Summary = () => {

  const { user } = useUser();
  const { livePrices = {} } = usePrices();

  const [holdings, setHoldings] = useState([]);
  const [Refresh, setRefresh] = useState(false);

  const [account, setAccount] = useState(null);

  // ================= GET HOLDINGS =================

  const getHoldings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:3010/holding/getHolding",
        {
          withCredentials: true
        }
      );

      setHoldings(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log("Error getting holdings:", err);

      setHoldings([]);

    }
  };

  useEffect(() => {
    const getAccount = async () => {
        try {
            const response = await fetch(
                "http://localhost:3010/account",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

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


  useEffect(() => {

    getHoldings();

  }, [Refresh]);


  // ================= CALCULATE SUMMARY =================

  const summary = useMemo(() => {

    let investment = 0;
    let currentValue = 0;


    holdings.forEach((holding) => {

      const qty = Number(holding.qty) || 0;

      const avgPrice =
        Number(holding.avgPrice) || 0;


      // Get live Zerodha price
      const livePrice =
        Number(livePrices?.[holding.symbol]?.ltp) ||
        avgPrice;


      investment += qty * avgPrice;

      currentValue += qty * livePrice;

    });


    // Profit / Loss
    const pnl = currentValue - investment;


    // P&L percentage
    const pnlPercentage =
      investment > 0
        ? (pnl / investment) * 100
        : 0;


    return {
      investment,
      currentValue,
      pnl,
      pnlPercentage
    };

  }, [holdings, livePrices]);


  // ================= FORMAT MONEY =================

  const formatMoney = (value) => {

    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    );

  };


  // ================= PROFIT / LOSS =================

  const isProfit = summary.pnl >= 0;

  const pnlClass = isProfit
    ? "profits"
    : "losses";
 
   

  return (
    <>

      {/* ================= USER ================= */}

      <div className="username">

        <h6>
          Hi, {user?.fullName || "User"}
        </h6>

        <hr className="divider" />

      </div>


      {/* ================= EQUITY ================= */}

      <div className="section">

    <span>
        <p>Equity</p>
    </span>

    <div className="data">

        <div className="first">

            <h3>
                ₹{formatMoney(account?.availableBalance)}
            </h3>

            <p>Margin available</p>

        </div>

        <hr />

        <div className="second">

            <p>
                Margins used
                <span>
                    ₹{formatMoney(account?.usedMargin)}
                </span>
            </p>

            <p>
                Opening balance
                <span>
                    ₹{formatMoney(user?.initialBalance)}
                </span>
            </p>

        </div>

    </div>

    <hr className="divider" />

</div>


      {/* ================= HOLDINGS ================= */}

      <div className="section">

        <span>
          <p>
            Holdings ({holdings.length})
          </p>
        </span>


        <div className="data">


          {/* ================= P&L ================= */}

          <div className="firsts">

            <h3 className={pnlClass}>
              

              {isProfit ? "+" : "-"}
              ₹{formatMoney(Math.abs(summary.pnl))}


              <p>

                {isProfit ? "+" : ""}
                {summary.pnlPercentage.toFixed(2)}%

              </p>

            </h3>


            <p>
              P&L
            </p>

          </div>


          <hr />


          {/* ================= HOLDING VALUES ================= */}

          <div className="second">

            <p>

              Current Value

              <span>
                ₹{formatMoney(summary.currentValue)}
              </span>

            </p>


            <p>

              Investment

              <span>
                ₹{formatMoney(summary.investment)}
              </span>

            </p>

          </div>

        </div>


        <hr className="divider" />

      </div>

    </>
  );
};

export default Summary;

