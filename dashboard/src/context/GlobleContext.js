import { createContext, useContext, useState } from "react";

const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {

    
    const [IsPanelOpen, setIsPanelOpen] = useState({
        isOpen: false,
        Theme: true,
        Symbol:"",
        max:0
        
    });

    const [allStocks, setAllStocks] = useState([]);
    
 
    return (
        <GlobleContext.Provider value={{  IsPanelOpen, setIsPanelOpen , allStocks, setAllStocks}}>
            {children}
        </GlobleContext.Provider>
    );
};

export const useGloble = () => useContext(GlobleContext);