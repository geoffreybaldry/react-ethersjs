import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const AccountBalance = ( { provider, currentAccount }) => {

    const [accountBalance, setAccountBalance] = useState(null);

    const getAccountBalance = async () => {
        const balance = await provider.getBalance(currentAccount);
        const balanceInEther = ethers.utils.formatEther(balance);

        setAccountBalance(balanceInEther);
    }

    useEffect(() => {
        getAccountBalance();

        function handleBlockUpdate(blockNumber) {
            getAccountBalance();
        }

        provider.on("block", handleBlockUpdate);

        // Unsubscribe in cleanup so we don't end up with multiple 
        return function cleanup() {
            provider.off("block", handleBlockUpdate);
        }
    });

    return (
        <>
            {accountBalance}
        </>
    )

}

export default AccountBalance