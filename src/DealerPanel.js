import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"

const DealerPanel = ( { contract, gameState, playerCount, tableValue, errorsToParent }) => {


    const [startButtonText, setStartButtonText] = useState('Start Game');
    const [showPickWinnerButton, setShowPickWinnerButton] = useState(false);

    useEffect(() => {
        if (playerCount > 0) {
            setShowPickWinnerButton(true);
        } else {
            setShowPickWinnerButton(false);
        }
    }, [playerCount])

    //gameState --> 0 = Ended, 1 = Running, 2 = Canceled
    useEffect(() => {
        if (gameState === 0 || gameState === 2) {
            setStartButtonText('Start Game')
        } else {
            setStartButtonText('Cancel Game')
        }
    }, [gameState]);

    const startGameButtonClickHandler = () => {
        if (gameState === 0 || gameState === 2) { 
            contract.startGame()
            .then(setStartButtonText('Starting...'))
            .then(console.log("Starting the game"))      
        } else {
            contract.cancelGame()
            .then(setStartButtonText('Canceling...'))
            .then(console.log("Canceling the game"))
        }
    }

    const pickWinnerButtonClickHandler = () => {
        if (gameState === 1 && playerCount > 0) {
            console.log('DealerPanel.js - Picking Winner!');
            const options = {value: ethers.utils.parseEther(tableValue)};
            contract.pickWinner(options)
            .then((result) => {}, (error) => {
                console.log(error.reason);
                errorsToParent(error.reason)
            });
        }
    }

    const startGameButton = (
        <button onClick={startGameButtonClickHandler}>{startButtonText}</button>
    )

    const pickWinnerButton = (
        <button onClick={pickWinnerButtonClickHandler}>Pick Winner</button>
    )

    
    return (
        <Container>
            <Row>
                <Col>
                    {startGameButton}
                </Col>
                <Col>
                    {pickWinnerButton}
                </Col>
            </Row>
        </Container>
    )
    
}

export default DealerPanel