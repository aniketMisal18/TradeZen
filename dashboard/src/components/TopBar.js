
// import React from "react";
// import Menu from "./Menu";
// import { usePrices } from "../context/LivePricesContext";

// const TopBar = () => {
//     const { livePrices } = usePrices();

//     const niftyPrice = livePrices["NIFTY 50"]?.ltp;
//     const sensexPrice = livePrices["SENSEX"]?.ltp;



//     const getPercentage = (data) => {
//         const ltp = Number(data?.ltp);
//         const open = Number(data?.ohlc?.open);

//         if (!ltp || !open) return null;

//         return ((ltp - open) / open) * 100;
//     };

//     const renderIndex = (name, data) => {
//         const ltp = Number(data?.ltp);
//         const percentage = getPercentage(data);
//         const isDown = percentage !== null && percentage < 0;

//         return (
//             <div className="sensex">
//                 <p className="index hov">{name}</p>

//                 <p className={`index-points ${isDown ? "down" : "up"
//                     }`}>
//                     {ltp > 0 ? ltp.toFixed(2) : "--"}
//                 </p>

//                 <p className={`percent ${isDown ? "down" : "up"
//                     }`}>
//                     {percentage !== null
//                         ? `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`
//                         : "--"}
//                 </p>
//             </div>
//         );
//     };

//     return (
//         <div className="topbar-container">
//             <div className="indices-container">
                
//                 <div class="sensex">
//                     <p class="index hov">NIFTY 50</p>
//                     <p class="index-points up">--</p>
//                     <p class="percent up">--</p>
//                 </div>

//                 <div class="sensex">
//                     <p class="index hov">SENSEX</p>
//                     <p class="index-points up">--</p>
//                     <p class="percent up">--</p>
//                 </div>
//             </div>

//             <Menu />
//         </div>
//     );
// };

// export default TopBar;





import React from "react";
import Menu from "./Menu";
import { usePrices } from "../context/LivePricesContext";

const TopBar = () => {
    const { livePrices } = usePrices();

    const getPercentage = (data) => {
        const ltp = Number(data?.ltp);
        const open = Number(data?.ohlc?.open);

        if (!ltp || !open) return null;

        return ((ltp - open) / open) * 100;
    };

    const renderIndex = (name, data) => {
        const ltp = Number(data?.ltp);
        const percentage = getPercentage(data);
        const isDown = percentage !== null && percentage < 0;

        return (
            <div className="sensex" key={name}>
                <p className="index hov">{name}</p>

                <p className={`index-points ${
                    isDown ? "down" : "up"
                }`}>
                    {ltp > 0 ? ltp.toFixed(2) : "--"}
                </p>

                <p className={`percent ${
                    isDown ? "down" : "up"
                }`}>
                    {percentage !== null
                        ? `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`
                        : "--"}
                </p>
            </div>
        );
    };

    return (
        <div className="topbar-container">
            <div className="indices-container">

                {renderIndex("NIFTY 50", livePrices["NIFTY 50"])}

                {renderIndex("SENSEX", livePrices["SENSEX"])}

            </div>

            <Menu />
        </div>
    );
};

export default TopBar;
