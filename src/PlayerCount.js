import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const PlayerCount = ( { contract } ) => {

    const [playerCount, setPlayerCount] = useState(null);

    const getPlayerCount = async () => {
        const count = ethers.BigNumber.from(await contract.callStatic.getPlayerCount()).toNumber();
        setPlayerCount(count);
        console.log('PlayerCount updated to ' + count);
    }

    useEffect(() => {
        getPlayerCount();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
            getPlayerCount();
        })
    }, []);

    return (
        <div>{playerCount}</div>
    )
}

export default PlayerCount