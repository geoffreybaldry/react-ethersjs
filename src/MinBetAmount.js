import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const MinBetAmount = ( { contract } ) => {

    const [minBetAmount, setMinBetAmount] = useState(null);

    const getMinBetAmount = async () => {
        const amount = ethers.utils.formatEther(await contract.callStatic.minBetAmount());
        setMinBetAmount(amount);
        console.log('MinBetAmount updated to ' + amount);
    }

    useEffect(() => {
        getMinBetAmount();
        //To Do - how to poll for this change without an event in the contract
    }, []);

    return (
        minBetAmount
    )
}

export default MinBetAmount