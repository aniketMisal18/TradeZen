// 




import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";

import "react-toastify/ReactToastify.css";

import RefreshHandler from "../utils/RefreshHandler";
import { useGloble } from "../context/GlobleContext";

import axios from "axios";

function App() {

    const [isAuth, setisAuth] = useState(null);

    const { setAllStocks } = useGloble();

    const PrivateRouting = ({ element }) => {

        if (isAuth === null) {
            return null;
        }

        return isAuth
            ? element
            : <Navigate to="/login" replace />;

    };

    useEffect(() => {

        let isMounted = true;

        const Stockfetch = async () => {

            try {

                const res = await axios.get(
                    "http://localhost:3010/stock/getStocks",
                    {
                        withCredentials: true
                    }
                );

                if (isMounted) {
                    setAllStocks(res.data);
                    console.log("Stocks fetched successfully");
                }

            } catch (err) {

                console.log("Stock fetch error:", err);

            }

        };

        Stockfetch();

        return () => {
            isMounted = false;
        };

    }, []);

    return (
        <>
            <RefreshHandler setisAuth={setisAuth} />

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/console/*"
                    element={
                        <PrivateRouting element={<Home />} />
                    }
                />

            </Routes>
        </>
    );
}

export default App;
