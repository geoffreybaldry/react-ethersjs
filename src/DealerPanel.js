import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

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
        /*if (gameState === 0 || gameState === 2) { 
            contract.startGame()
            .then(setStartButtonText('Starting...'))
            .then(console.log("Starting the game"))     */
        if (gameState === 0 || gameState === 2) { 
            contract.startGame()
            .then((result) => {}, (error) => {
                console.log(error.message);
                errorsToParent(error.message);
                setStartButtonText('Start Game');
            })
            .then(setStartButtonText('Starting...'))
            .then(console.log("Starting the game"))
        } else {
            contract.cancelGame()
            .then((result) => {}, (error) => {
                console.log(error.message);
                errorsToParent(error.message);
                setStartButtonText('Cancel Game');
            })
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

    const startGameButtonState = () => {
        if (startButtonText === "Start Game") {
            return <button className="btn btn-success" onClick={startGameButtonClickHandler}>{startButtonText}</button>
        } else if  (startButtonText === "Starting...") {
            return <button className="btn btn-success" onClick={startGameButtonClickHandler} disabled={true}>{startButtonText}
            <FontAwesomeIcon icon={faSpinner} spin />
            </button>
        } else if (startButtonText === "Cancel Game") {
            return <button className="btn btn-danger" onClick={startGameButtonClickHandler}>{startButtonText}</button>
        } else if (startButtonText === "Canceling...") {
            return <button className="btn btn-danger" onClick={startGameButtonClickHandler} disabled={true}>{startButtonText}
            <FontAwesomeIcon icon={faSpinner} spin />
            </button>
        }
    }

    const startGameButton = startGameButtonState();

    const pickWinnerButton = (
        <button className="btn btn-primary" onClick={pickWinnerButtonClickHandler}>Pick Winner</button>
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