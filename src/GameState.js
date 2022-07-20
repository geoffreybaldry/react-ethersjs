import React, { useState, useEffect } from "react"

const GameState = ( { contract } ) => {

    const [gameState, setGameState] = useState(null);

    const getGameState = async () => {
        const state = await contract.callStatic.gameState();
        setGameState(state);
        console.log("GameState updated to " + state);
    }

    useEffect(() => {
        getGameState();
        contract.on("GameStateChanged", (newGameState) => {
            getGameState();
        })
    }, []);

    return (
        <div>{gameState}</div>
    )
}

export default GameState