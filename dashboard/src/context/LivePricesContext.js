import { createContext, useContext, useState } from "react";

const LivePricesContext = createContext();

export const LivePricesProvider = ({ children }) => {

  const [livePrices , setLivePrices]= useState({});
  
 
    return (
        <LivePricesContext.Provider value={{livePrices , setLivePrices}}>
            {children}
        </LivePricesContext.Provider>
    );
};

export const usePrices = () => useContext(LivePricesContext);