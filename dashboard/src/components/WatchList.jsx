
import React, { useState } from "react";
import axios from "axios";

import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { BarChartOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import Search from "./search";

import { useGloble } from "../context/GlobleContext";
import { useUser } from "../context/UserContext";
import { usePrices } from "../context/LivePricesContext";

const WatchList = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [search, setSearch] = useState("");

    const { user } = useUser();
    const { allStocks } = useGloble();

    const filteredStocks = (allStocks || []).filter((stock) => {
        const searchValue = search.toLowerCase().trim();

        return (
            stock.name?.toLowerCase().includes(searchValue) ||
            stock.symbol?.toLowerCase().includes(searchValue)
        );
    });

    return (
        <div className="watchlist-container">
            <div className="search-container">
                <input
                    type="text"
                    name="search"
                    id="search"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search eg: INFY, TCS, HDFC"
                    className="search-input"
                />

                <span className="counts">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
            </div>

            <ul className="list">
                {isFocused ? (
                    filteredStocks.map((stock) => (
                        <Search stock={stock} key={stock._id} />
                    ))
                ) : (
                    (user?.watchlist || []).map((stock) => (
                        <WatchListItem
                            stock={stock}
                            key={stock._id}
                        />
                    ))
                )}
            </ul>
        </div>
    );
};

export default WatchList;

const WatchListItem = ({ stock }) => {

    const [showWatchlistAction, setShowWatchlistAction] = useState(false);

    const { setUser } = useUser();
    const { livePrices } = usePrices();

    const priceData = livePrices[stock.symbol];

    const livePrice = Number(priceData?.ltp) || 0;
    const openingPrice = Number(priceData?.ohlc?.open) || 0;

    const percentageDiff = openingPrice > 0 && livePrice > 0
        ? ((livePrice - openingPrice) / openingPrice) * 100
        : 0;

    const isDown = percentageDiff < 0;

    const handleMouseEntry = () => {
        setShowWatchlistAction(true);
    };

    const handleMouseExit = () => {
        setShowWatchlistAction(false);
    };

    const UpdateWatchlist = async (job, stock) => {
        try {
            await axios.put(
                "http://localhost:3010/user/updateWatchlist",
                {
                    job,
                    stockId: stock._id
                },
                {
                    withCredentials: true
                }
            );

            setUser(prev => ({
                ...prev,
                watchlist: (prev?.watchlist || []).filter(
                    item => item._id !== stock._id
                )
            }));

        } catch (error) {
            console.error(
                "Remove watchlist error:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <li
            onMouseEnter={handleMouseEntry}
            onMouseLeave={handleMouseExit}
        >
            <div className="item">
                <p className={isDown ? "down Wsize" : "up Wsize"}>
                    {stock.symbol}
                </p>

                <div className="item-info">
                    <span>
                        {isDown ? (
                            <KeyboardArrowDownIcon className="down" />
                        ) : (
                            <KeyboardArrowUpIcon className="up" />
                        )}
                    </span>

                    <span className={isDown ? "loss percent" : "profit percent"}>
                        {livePrice > 0 && openingPrice > 0
                            ? `${percentageDiff >= 0 ? "+" : ""}${percentageDiff.toFixed(2)}%`
                            : "--"}
                    </span>

                    <span className={isDown ? "down Wsize" : "up Wsize"}>
                        {livePrice > 0 ? livePrice.toFixed(2) : "--"}
                    </span>
                </div>
            </div>

            {showWatchlistAction && (
                <WatchListIActions
                    stock={stock}
                    UpdateWatchlist={UpdateWatchlist}
                />
            )}
        </li>
    );
};

const WatchListIActions = ({ stock, UpdateWatchlist }) => {

    const { IsPanelOpen, setIsPanelOpen } = useGloble();

    const handleBuy = () => {
        if (!IsPanelOpen.isOpen) {
            setIsPanelOpen({
                isOpen: true,
                Theme: true,
                Symbol: stock.symbol
            });
        }
    };

    return (
        <span className="actions">
            <Tooltip
                title="Buy (B)"
                placement="top"
                arrow
                TransitionComponent={Grow}
            >
                <button className="buy" onClick={handleBuy}>
                    Buy
                </button>
            </Tooltip>

            <Tooltip
                title="Analytics (A)"
                placement="top"
                arrow
                TransitionComponent={Grow}
            >
                <Link
                    style={{ textDecoration: "none" }}
                    to={`/console/chart/${stock.symbol}`}
                >
                    <button className="action">
                        <BarChartOutlined className="icon" />
                    </button>
                </Link>
            </Tooltip>

            <Tooltip
                title="Remove"
                placement="top"
                arrow
                TransitionComponent={Grow}
            >
                <button
                    className="action"
                    onClick={() => UpdateWatchlist("REMOVE", stock)}
                >
                    <DeleteIcon className="icon" />
                </button>
            </Tooltip>
        </span>
    );
};
