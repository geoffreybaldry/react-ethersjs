import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const MaxBetAmount = ( { contract } ) => {

    const [maxBetAmount, setMaxBetAmount] = useState(0);

    const getMaxBetAmount = async () => {
        const amount = ethers.utils.formatEther(await contract.callStatic.maxBetAmount());
        setMaxBetAmount(amount);
        console.log('MaxBetAmount updated to ' + amount);
    }

    useEffect(() => {
        getMaxBetAmount();
        //To Do - how to poll for this change without an event in the contract
    }, []);

    return (
        maxBetAmount
    )
}

export default MaxBetAmount