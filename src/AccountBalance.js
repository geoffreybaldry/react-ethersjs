import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const AccountBalance = ( { provider, currentAccount }) => {

    const [accountBalance, setAccountBalance] = useState(null);

    const getAccountBalance = async () => {
        const balance = await provider.getBalance(currentAccount);
        const balanceInEther = ethers.utils.formatEther(balance);

        setAccountBalance(balanceInEther);
    }

    provider.on("block", (blockNumber) => {
        getAccountBalance();
    })

    useEffect(() => {
        getAccountBalance();
    }, []);

    return (
        <div>
            {accountBalance} ETH
        </div>
    )

}

export default AccountBalance