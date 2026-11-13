// import { createContext, useContext, useEffect, useRef } from "react";
// import { usePrices } from "../context/LivePricesContext";

// const WebSocketContext = createContext();

// export function WebSocketProvider({ children }) {

//     const socketRef = useRef(null);
//     const { setLivePrices } = usePrices();


//     useEffect(() => {

//         const socket = new WebSocket("ws://localhost:3010");

//         socketRef.current = socket;

//         socket.onopen = () => {
//             console.log("WebSocket Connected");


//         };

//         socket.onmessage = (event) => {
//             const res = JSON.parse(event.data);

//             if (res.type === "price") {
//                 const stock = res.data;

//                 setLivePrices(prev => ({
//                     ...prev,
//                     [stock.symbol]: {
//                         ltp: stock.ltp,
//                         ohlc: stock.ohlc
//                     }
//                 }));
//             }



//         };

//         socket.onclose = () => {
//             console.log("WebSocket Closed");
//         };

//         socket.onerror = (err) => {
//             console.log(err);
//         };

//         return () => {
//             socket.close();
//         };

//     }, [setLivePrices]);

//     return (
//         <WebSocketContext.Provider value={socketRef}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// }




// export function useWebSocket() {
//     return useContext(WebSocketContext);
// }









import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import { usePrices } from "../context/LivePricesContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {

    const socketRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);

    const { setLivePrices } = usePrices();

    useEffect(() => {

        const socket = new WebSocket("ws://localhost:3010");

        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
        };

        
socket.onmessage = (event) => {
    try {
        const res = JSON.parse(event.data);

        if (res.type === "price") {
            const stock = res.data;

           

            setLivePrices(prev => ({
                ...prev,
                [stock.symbol]: {
                    ltp: stock.ltp,
                    ohlc: stock.ohlc
                }
            }));
        }
    } catch (error) {
        console.error("WebSocket message error:", error);
    }
};


        socket.onclose = () => {
            console.log("WebSocket Closed");
            setIsConnected(false);
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        return () => {

            setIsConnected(false);

            socket.close();

            if (socketRef.current === socket) {
                socketRef.current = null;
            }

        };

    }, [setLivePrices]);

    return (
        <WebSocketContext.Provider
            value={{
                socketRef,
                isConnected
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );

}

export function useWebSocket() {
    return useContext(WebSocketContext);
}
