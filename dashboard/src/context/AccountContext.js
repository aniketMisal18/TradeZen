import { createContext, useContext, useEffect, useState } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {

    const [account, setAccount] = useState(null);
    const [accountLoading, setAccountLoading] = useState(true);

    const getAccount = async () => {

        try {

            setAccountLoading(true);

            const response = await fetch(
                "http://localhost:3010/account",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (data.success) {
                setAccount(data.account);
            }

        } catch (error) {

            console.log(
                "Account fetch error:",
                error
            );

        } finally {

            setAccountLoading(false);

        }
    };


    useEffect(() => {
        getAccount();
    }, []);


    return (
        <AccountContext.Provider
            value={{
                account,
                setAccount,
                getAccount,
                accountLoading
            }}
        >
            {children}
        </AccountContext.Provider>
    );
};


export const useAccount = () => {
    return useContext(AccountContext);
};