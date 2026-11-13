import { useEffect, useState } from "react";
import "../css/TradingPanel.css";

import { useGloble } from "../context/GlobleContext";
import { usePrices } from "../context/LivePricesContext";
import { useAccount } from "../context/AccountContext";

import axios from "axios";

const TradingPanel = ({ Stock }) => {

    const [orderType, setOrderType] = useState("DELIVERY");
    const [livePrice, setLivePrice] = useState(100);
    const [loading, setLoading] = useState(false);
    const { getAccount } = useAccount();

    const { livePrices } = usePrices();
    const { IsPanelOpen, setIsPanelOpen } = useGloble();

   

    const [form, setForm] = useState({
        qty: 1,
        price: livePrice,
        action: IsPanelOpen.Theme ? "BUY" : "SELL",
        Stock: IsPanelOpen.Symbol,
        orderType: "DELIVERY"
    });


   

    const handleCancle = () => {

        if (IsPanelOpen.isOpen === true) {

            setIsPanelOpen({
                isOpen: false
            });

        }
    };


   

    useEffect(() => {

        const currentPrice =
            livePrices[IsPanelOpen.Symbol]?.ltp;

        setForm(prev => ({
            ...prev,

            price: currentPrice || prev.price,

            action:
                IsPanelOpen.Theme
                    ? "BUY"
                    : "SELL",

            Stock:
                IsPanelOpen.Symbol,

            orderType:
                orderType
        }));

    }, [
        livePrices,
        orderType,
        IsPanelOpen.Theme,
        IsPanelOpen.Symbol
    ]);


 

    const handleChange = (e) => {

        setForm(prev => ({
            ...prev,

            [e.target.name]:
                e.target.value
        }));

    };


  

    const handleSubmit = async () => {

        const qty = Number(form.qty);
        const price = Number(form.price);

   

        if (!qty || qty <= 0) {

            alert("Please enter a valid quantity");

            return;
        }

        if (!price || price <= 0) {

            alert("Price is not available");

            return;
        }


     
        if (
            form.action === "SELL" &&
            IsPanelOpen.max != null &&
            qty > Number(IsPanelOpen.max)
        ) {

            alert(
                `You can sell maximum ${IsPanelOpen.max} quantity`
            );

            return;
        }


        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:3010/order/addOrder",
                {
                    order: {
                        Stock: form.Stock,
                        qty: qty,
                        price: price,
                        action: form.action,
                        orderType: form.orderType
                    }
                },
                {
                    withCredentials: true
                }
            );

            const data = response.data;

            if (data.success) {

                console.log("Order successful:", data);

              
                await getAccount();

                if (form.action === "SELL") {

                    alert(
                        `SELL successful\n\n` +
                        `Profit/Loss: ₹${data.profit}`
                    );

                } else {

                    alert("BUY order successful");

                }

                handleCancle();

            } else {

                alert(
                    data.message ||
                    "Order failed"
                );
            }

        } catch (error) {

            console.log("Order error:", error);

            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Order failed"
                );

            } else {

                alert(
                    "Unable to connect to server"
                );
            }

        } finally {

            setLoading(false);
        }

    };


    
   

    const totalValue =
        Number(form.qty || 0) *
        Number(form.price || 0);


  

    return (

        <div className="trade-window">

           

            <div
                className={
                    IsPanelOpen.Theme
                        ? "buy trade-header"
                        : "sell trade-header"
                }
            >

                <div>

                    <h3>
                        {IsPanelOpen.Symbol}
                        {" × "}
                        {form.qty}
                        {" Qty @ ₹"}
                        {totalValue.toFixed(2)}
                    </h3>

                    <p>
                        ₹{Number(form.price || 0).toFixed(2)}
                        {" "}on NSE
                    </p>

                </div>

            </div>


            {/* =================================================
                BODY
            ================================================= */}

            <div className="trade-body">



                <div className="radio-group">

                    <label>

                        <input
                            type="radio"
                            checked={
                                orderType === "DELIVERY"
                            }
                            onChange={() =>
                                setOrderType("DELIVERY")
                            }
                        />

                        DELIVERY

                    </label>


                    <label>

                        <input
                            type="radio"
                            checked={
                                orderType === "POSITION"
                            }
                            onChange={() =>
                                setOrderType("POSITION")
                            }
                        />

                        POSITION

                    </label>

                </div>



                <div className="input-row">


                   

                    <div>

                        <label>
                            Qty.
                        </label>

                        <input
                            type="number"
                            name="qty"
                            value={form.qty}
                            onChange={handleChange}
                            min={1}
                            max={
                                IsPanelOpen.Theme
                                    ? undefined
                                    : IsPanelOpen.max
                            }
                        />

                    </div>


                    {/* Price */}

                    <div>

                        <label>
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={form.price || ""}
                            readOnly
                        />

                    </div>

                </div>


                

                <div className="trade-footer">

                    <span className="more-options">
                        You are ordering
                    </span>


                    <div className="buttons">


                        {/* BUY / SELL */}

                        <button
                            className={
                                IsPanelOpen.Theme
                                    ? "buy-btn"
                                    : "sell-btn"
                            }
                            onClick={handleSubmit}
                            disabled={loading}
                        >

                            {loading
                                ? "Processing..."
                                : IsPanelOpen.Theme
                                    ? "BUY"
                                    : "SELL"
                            }

                        </button>


                        {/* CANCEL */}

                        <button
                            className="cancel-btn"
                            onClick={handleCancle}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TradingPanel;