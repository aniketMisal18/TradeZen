
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";

import { useUser } from "../context/UserContext";
import { useWebSocket } from "../context/WebSocketContext";

import axios from "axios";

const Search = ({ stock }) => {

    const { user, setUser } = useUser();

    const { socketRef, isConnected } = useWebSocket();

    const watchlistStocks = user?.watchlist || [];

    const isSaved = watchlistStocks.some(
        item => item.symbol === stock.symbol
    );


   

    const subscribe = (symbol) => {

        const socket = socketRef.current;

        if (
            socket &&
            isConnected &&
            socket.readyState === WebSocket.OPEN
        ) {

            socket.send(JSON.stringify({
                type: "subscribeOne",
                symbol
            }));

            console.log("Subscribed to:", symbol);

        } else {

            console.log("WebSocket not connected. Subscription skipped:", symbol);

        }

    };



    const UpdateWatchlist = async () => {

        try {

            const job = isSaved ? "REMOVE" : "ADD";

            const response = await axios.put(
                "http://localhost:3010/user/updateWatchlist",
                {
                    job,
                    stockId: stock._id
                },
                {
                    withCredentials: true
                }
            );

            console.log("Watchlist API response:", response.data);


            

            setUser(prev => {

                if (!prev) return prev;

                const currentWatchlist = prev.watchlist || [];

                if (job === "ADD") {

                    const alreadyExists = currentWatchlist.some(
                        item => item._id === stock._id
                    );

                    if (alreadyExists) return prev;

                    return {
                        ...prev,
                        watchlist: [...currentWatchlist, stock]
                    };

                }

                return {
                    ...prev,
                    watchlist: currentWatchlist.filter(
                        item => item._id !== stock._id
                    )
                };

            });


            

            if (job === "ADD") {
                subscribe(stock.symbol);
            }

        } catch (error) {

            console.error(
                "Watchlist update failed:",
                error.response?.data || error.message
            );

        }

    };


    return (

        <ul
            className="searchList"
            onMouseDown={(e) => e.preventDefault()}
        >

            <div>
                <p className="stockName">
                    {stock.name}
                </p>

                <p className="stockSymbol">
                    NSE · {stock.symbol}
                </p>
            </div>


            <FontAwesomeIcon
                className="addIconD"
                icon={isSaved ? solidBookmark : regularBookmark}
                onClick={UpdateWatchlist}
                style={{ cursor: "pointer" }}
            />

        </ul>

    );

};

export default Search;
