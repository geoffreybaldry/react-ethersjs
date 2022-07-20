import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

const DealerPanel = ( { dealerAddress, currentAccount, provider, contract }) => {

    const [gameState, setGameState] = useState(0);

    const getGameState = async () => {
        setGameState(await contract.gameState());
    }

    const startGameButtonClickHandler = async () => {
        await contract.startGame();
    }

    const startGameButton = (
        <button onClick={startGameButtonClickHandler}>Start Game</button>
    )

    if (dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase()) {
        return (
            <div>
                {startGameButton}
            </div>
        )
    } else {
        return (
            <div>NotDealer</div>
        )
    }
}

export default DealerPanel