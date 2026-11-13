// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useUser } from "../context/UserContext";
// import { useWebSocket } from "../context/WebSocketContext";

// function RefreshHandler({ setisAuth }) {

//     const location = useLocation();
//     const navigate = useNavigate();
//     const { setUser } = useUser();
//     const socketRef = useWebSocket();

//     useEffect(() => {

//         const checkAuth = async () => {

//             try {
//                 const response = await fetch(
//                     "http://localhost:3010/auth/me",
//                     {
//                         credentials: "include"
//                     }
//                 );
//                 if (response.ok) {

//                     const { userInfo, subscriptionStocks } = await response.json();
                    
//                     setUser(userInfo);
//                     setisAuth(true);
                    
//                     if(subscriptionStocks){
//                         socketRef.current.send(JSON.stringify({
//                         type: "subscribeMany",
//                         symbol: subscriptionStocks
//                     }));
//                     }

                    

//                     if (
//                         location.pathname === "/" ||
//                         location.pathname === "/login" ||
//                         location.pathname === "/signup"
//                     ) {

//                         navigate("/console", { replace: true });
//                     }



//                 } else {

//                     setisAuth(false);

//                     if (location.pathname.startsWith("/console")) {
//                         navigate("/login", { replace: true });
//                     }

//                 }

//             } catch (err) {

//                 setisAuth(false);

//                 if (location.pathname.startsWith("/console")) {
//                     navigate("/login", { replace: true });
//                 }

//             }

//         };

//         checkAuth();

//     }, [location.pathname, navigate, setisAuth, setUser, socketRef]);

//     return null;
// }

// export default RefreshHandler;




import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import { useWebSocket } from "../context/WebSocketContext";

function RefreshHandler({ setisAuth }) {

    const location = useLocation();
    const navigate = useNavigate();

    const { setUser } = useUser();

    const { socketRef, isConnected } = useWebSocket();

    const lastSubscriptionRef = useRef(null);

    useEffect(() => {

        let isMounted = true;

        const checkAuth = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3010/auth/me",
                    {
                        credentials: "include"
                    }
                );

                if (!isMounted) return;

                if (response.ok) {

                    const {
                        userInfo,
                        subscriptionStocks
                    } = await response.json();

                    if (!isMounted) return;

                    setUser(userInfo);
                    setisAuth(true);

                    const socket = socketRef.current;

                    if (
                        isConnected &&
                        socket &&
                        socket.readyState === WebSocket.OPEN &&
                        subscriptionStocks?.length
                    ) {

                        const subscriptionKey =
                            JSON.stringify(subscriptionStocks);

                        const alreadySubscribed =
                            lastSubscriptionRef.current?.socket === socket &&
                            lastSubscriptionRef.current?.key === subscriptionKey;

                        if (!alreadySubscribed) {

                            socket.send(JSON.stringify({
                                type: "subscribeMany",
                                symbol: subscriptionStocks
                            }));

                            lastSubscriptionRef.current = {
                                socket,
                                key: subscriptionKey
                            };

                            console.log(
                                "Subscribed stocks:",
                                subscriptionStocks
                            );

                        }

                    }

                    if (
                        location.pathname === "/" ||
                        location.pathname === "/login" ||
                        location.pathname === "/signup"
                    ) {

                        navigate("/console", {
                            replace: true
                        });

                    }

                } else {

                    setisAuth(false);

                    if (location.pathname.startsWith("/console")) {

                        navigate("/login", {
                            replace: true
                        });

                    }

                }

            } catch (error) {

                if (!isMounted) return;

                console.error("Authentication error:", error);

                setisAuth(false);

                if (location.pathname.startsWith("/console")) {

                    navigate("/login", {
                        replace: true
                    });

                }

            }

        };

        checkAuth();

        return () => {
            isMounted = false;
        };

    }, [
        location.pathname,
        navigate,
        setisAuth,
        setUser,
        socketRef,
        isConnected
    ]);

    return null;

}

export default RefreshHandler;
