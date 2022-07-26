import React, { useState, useEffect } from "react"
import { ethers } from "ethers";

const TableValue = ( { contract } ) => {

    const [tableValue, setTableValue] = useState(null);

    const getTableValue = async () => {
        const value = ethers.utils.formatEther(await contract.callStatic.getTableValue());
        setTableValue(value);
        console.log("TableValue updated to " + value);
    }

    useEffect(() => {
        getTableValue();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
            getTableValue();
        })
    }, []);

    return (
        {tableValue}
    )
}

export default TableValue