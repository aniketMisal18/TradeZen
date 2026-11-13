
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useAccount } from "../context/AccountContext";
import "../css/userProfile.css";

const UserProfile = () => {
    const { user } = useUser();
    const {account,accountLoading,  setAccount,} = useAccount();

   
    const [showAddFunds, setShowAddFunds] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

   

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };


    // ================= USER CHECK =================

    if (!user) {
        return (
            <div className="Profile-cont">
                <div className="head">
                    Profile
                </div>

                <div className="sectionTwo">
                    <div className="profile-details">
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }


    // ================= INITIALS =================

    const initials = user.fullName
        ? user.fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";


    // ================= ADD FUNDS =================

    const handleAddFunds = async () => {
        const addAmount = Number(amount);

        if (!addAmount || addAmount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3010/account/add-funds",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: addAmount,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setAccount(data.account);
                setAmount("");
                setShowAddFunds(false);
            } else {
                alert(data.message || "Failed to add funds");
            }

        } catch (error) {
            console.log("Add funds error:", error);
        } finally {
            setLoading(false);
        }
    };


    // ================= WITHDRAW FUNDS =================

    const handleWithdraw = async () => {
        const withdrawAmount = Number(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        if (withdrawAmount > account.availableBalance) {
            alert("Insufficient available balance");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3010/account/withdraw-funds",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: withdrawAmount,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setAccount(data.account);
                setAmount("");
                setShowWithdraw(false);
            } else {
                alert(data.message || "Withdrawal failed");
            }

        } catch (error) {
            console.log("Withdraw error:", error);
        } finally {
            setLoading(false);
        }
    };


    // ================= ACCOUNT VALUE =================

    const accountValue = account
        ? Number(account.availableBalance || 0) +
        Number(account.usedMargin || 0)
        : 0;


    const capitalUtilization =
        account && Number(account.initialBalance) > 0
            ? (
                (Number(account.usedMargin || 0) /
                    Number(account.initialBalance)) *
                100
            ).toFixed(2)
            : "0.00";


    return (
        <div className="Profile-cont">

            {/* ================= PROFILE ================= */}

            <div className="head">
                Profile
            </div>


            <div className="sectionOne">

                <div className="left">
                    <div className="ProfileLogo">
                        {initials}
                    </div>
                </div>

                <div className="right">
                    <h2>{user.fullName}</h2>
                </div>

            </div>


            <div className="sectionTwo">

                <div className="profile-details">

                    <div className="profile-row">
                        <span>E-mail</span>
                        <span>{user.email}</span>
                    </div>


                    <div className="profile-row">
                        <span>PAN</span>
                        <span>
                            {user.pan || "Not provided"}
                        </span>
                    </div>


                    <div className="profile-row">
                        <span>Phone</span>
                        <span>
                            {user.phone || "Not provided"}
                        </span>
                    </div>


                    <div className="profile-row">
                        <span>Segments</span>

                        <p className="seg">
                            NSE, BSE
                        </p>
                    </div>

                </div>

            </div>


            {/* ================= TRADING ACCOUNT ================= */}

            <div className="head fund-head">
                Trading Account
            </div>


            <div className="sectionTwo">

                <div className="profile-details">

                    {account ? (
                        <>

                            {/* ACTION BUTTONS */}

                            <div className="fund-actions">

                                <button
                                    className="btn btn-green"
                                    onClick={() => {
                                        setAmount("");
                                        setShowAddFunds(true);
                                    }}
                                >
                                    Add Funds
                                </button>


                                <button
                                    className="btn btn-blue"
                                    onClick={() => {
                                        setAmount("");
                                        setShowWithdraw(true);
                                    }}
                                >
                                    Withdraw
                                </button>

                            </div>


                            {/* INITIAL CAPITAL */}

                            <div className="profile-row">
                                <span>Initial Capital</span>

                                <span>
                                    ₹
                                    {formatMoney(
                                        account.initialBalance
                                    )}
                                </span>
                            </div>


                            {/* TOTAL DEPOSITED */}

                            <div className="profile-row">
                                <span>Total Deposited</span>

                                <span className="fund-green">
                                    ₹
                                    {formatMoney(
                                        account.totalDeposited
                                    )}
                                </span>
                            </div>


                            {/* TOTAL WITHDRAWN */}

                            <div className="profile-row">
                                <span>Total Withdrawn</span>

                                <span className="fund-red">
                                    ₹
                                    {formatMoney(
                                        account.totalWithdrawn
                                    )}
                                </span>
                            </div>


                            <hr />


                            {/* AVAILABLE BALANCE */}

                            <div className="profile-row">
                                <span>Available Balance</span>

                                <span className="fund-green">
                                    ₹
                                    {formatMoney(
                                        account.availableBalance
                                    )}
                                </span>
                            </div>


                            {/* USED MARGIN */}

                            <div className="profile-row">
                                <span>Used Margin</span>

                                <span>
                                    ₹
                                    {formatMoney(
                                        account.usedMargin
                                    )}
                                </span>
                            </div>


                            {/* ACCOUNT VALUE */}

                            <div className="profile-row">
                                <span>Account Value</span>

                                <span className="fund-bold">
                                    ₹
                                    {formatMoney(accountValue)}
                                </span>
                            </div>


                            <hr />


                            {/* REALIZED P&L */}

                            <div className="profile-row">
                                <span>Realized P&L</span>

                                <span
                                    className={
                                        Number(account.realizedPnL || 0) >= 0
                                            ? "fund-green"
                                            : "fund-red"
                                    }
                                >
                                    {Number(account.realizedPnL || 0) >= 0
                                        ? "+"
                                        : "-"}
                                    ₹
                                    {formatMoney(
                                        Math.abs(
                                            Number(
                                                account.realizedPnL || 0
                                            )
                                        )
                                    )}
                                </span>
                            </div>


                            {/* CAPITAL USED */}

                            <div className="profile-row">
                                <span>Capital Used</span>

                                <span>
                                    ₹
                                    {formatMoney(
                                        account.usedMargin
                                    )}
                                </span>
                            </div>


                            {/* CAPITAL UTILIZATION */}

                            <div className="profile-row">
                                <span>Capital Utilization</span>

                                <span>
                                    {capitalUtilization}%
                                </span>
                            </div>


                            <hr />


                            {/* ACCOUNT STATUS */}

                            <div className="profile-row">
                                <span>Trading Account</span>

                                <span className="fund-green">
                                    Active
                                </span>
                            </div>

                        </>
                    ) : (
                        <p>Loading account...</p>
                    )}

                </div>

            </div>


            {/* ================= ADD FUNDS MODAL ================= */}

            {showAddFunds && (

                <div className="fund-modal-overlay">

                    <div className="fund-modal">

                        <h3>Add Funds</h3>

                        <p>
                            Available balance: ₹
                            {formatMoney(
                                account?.availableBalance
                            )}
                        </p>


                        <input
                            type="number"
                            min="1"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />


                        <div className="fund-modal-actions">

                            <button
                                className="btn btn-blue"
                                onClick={() => {
                                    setShowAddFunds(false);
                                    setAmount("");
                                }}
                            >
                                Cancel
                            </button>


                            <button
                                className="btn btn-green"
                                onClick={handleAddFunds}
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "Add Funds"}
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* ================= WITHDRAW MODAL ================= */}

            {showWithdraw && (

                <div className="fund-modal-overlay">

                    <div className="fund-modal">

                        <h3>Withdraw Funds</h3>

                        <p>
                            Available balance: ₹
                            {formatMoney(
                                account?.availableBalance
                            )}
                        </p>


                        <input
                            type="number"
                            min="1"
                            max={account?.availableBalance}
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />


                        <div className="fund-modal-actions">

                            <button
                                className="btn btn-blue"
                                onClick={() => {
                                    setShowWithdraw(false);
                                    setAmount("");
                                }}
                            >
                                Cancel
                            </button>


                            <button
                                className="btn btn-green"
                                onClick={handleWithdraw}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Withdraw"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            

        </div>
    );
};

export default UserProfile;

