import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

const DealerPanel = ( { dealerAddress, currentAccount, provider, contract }) => {

    const [gameState, setGameState] = useState(0);
    const [buttonText, setButtonText] = useState('Start Game');

    const getGameState = async () => {
        const state = await contract.callStatic.gameState();
        setGameState(state);
        console.log("DealerPanel.js - GameState updated to " + state);
    }

    useEffect(() => {
        getGameState();
        contract.on("GameStateChanged", (newGameState) => {
            getGameState();
        })
    }, []);

    useEffect(() => {
        if (gameState == 3) {
            setButtonText('Start Game')
        } else {
            setButtonText('Cancel Game')
        }
    }, [gameState]);

    const startGameButtonClickHandler = () => {
        if (gameState == 3) {
            contract.startGame()
            .then(setButtonText('Starting...'))
            .then(console.log("Starting the game"))      
        } else {
            contract.cancelGame()
            .then(setButtonText('Canceling...'))
            .then(console.log("Canceling the game"))  
        }
    }

    const startGameButton = (
        <button onClick={startGameButtonClickHandler}>{buttonText}</button>
    )

    if (dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase()) {
        return (
            <Container>
                <Row>
                    <Col>
                        {startGameButton}
                    </Col>
                </Row>
            </Container>
        )
    } else {
        return (
            <div>NotDealer</div>
        )
    }
}

export default DealerPanel