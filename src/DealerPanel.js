import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

const DealerPanel = ( { contract }) => {

    const [gameState, setGameState] = useState(null);
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

    //gameState --> 0 = Ended, 1 = Running, 2 = Canceled
    useEffect(() => {
        if (gameState === 0 || gameState === 2) {
            setButtonText('Start Game')
        } else {
            setButtonText('Cancel Game')
        }
    }, [gameState]);

    const startGameButtonClickHandler = () => {
        if (gameState === 0 || gameState === 2) { 
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

    
    return (
        <Container>
            <Row>
                <Col>
                    {startGameButton}
                </Col>
            </Row>
        </Container>
    )
    
}

export default DealerPanel