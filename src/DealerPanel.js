import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const DealerPanel = ( { contract, gameState, playerCount, tableValue, errorsToParent }) => {


    const [startButtonText, setStartButtonText] = useState('Start Game');
    const [pickWinnerButtonText, setPickWinnerButtonText] = useState('Pick Winner');

    useEffect(() => {
        if (gameState === 1 && playerCount > 0) {
            setPickWinnerButtonText("Pick Winner");
        } else {
            setPickWinnerButtonText("Can't pick Winner");
        }
    }, [playerCount, gameState])

    //gameState --> 0 = Ended, 1 = Running, 2 = Canceled
    useEffect(() => {
        if (gameState === 0 || gameState === 2) {
            setStartButtonText('Start Game')
            setPickWinnerButtonText('Can\'t pick Winner')
        } else {
            setStartButtonText('Cancel Game')
        }
    }, [gameState]);

    const startGameButtonClickHandler = () => {
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
            
            const options = {value: ethers.utils.parseEther(tableValue)};
            contract.pickWinner(options)
            .then((result) => {}, (error) => {
                console.log(error.message);
                errorsToParent(error.message)
                setPickWinnerButtonText('Pick Winner')
            })
            .then(setPickWinnerButtonText('Picking Winner...'))
            .then(console.log('DealerPanel.js - Picking Winner!'));
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

    const pickWinnerButtonState = () => {
        if (pickWinnerButtonText === "Pick Winner") {
            return <button className="btn btn-primary" onClick={pickWinnerButtonClickHandler}>{pickWinnerButtonText}</button>
        } else if (pickWinnerButtonText === "Picking Winner...") {
            return <button className="btn btn-warning" onClick={pickWinnerButtonClickHandler} disabled={true}>{pickWinnerButtonText}
            <FontAwesomeIcon icon={faSpinner} spin />
            </button>
        } else if (pickWinnerButtonText === "Can't pick Winner") {
            let reason = "";
            if (gameState !== 1) {
                reason += 'The Game is not in Running State.';
            }
            if (playerCount === 0) {
                reason += 'There are no player bets.';
            }
            const popOver = (
                <Popover id="popover-basic">
                    <Popover.Header as="h3">Reason(s)...</Popover.Header>
                        <Popover.Body>
                        {reason}
                        </Popover.Body>
                </Popover>
            )
            return (
                <OverlayTrigger overlay={popOver} placement={'right'}>
                    <span className="d-inline-block">
                        <button className="btn btn-primary" onClick={pickWinnerButtonClickHandler} disabled={true}>
                            {pickWinnerButtonText}
                        </button>
                    </span>
                </OverlayTrigger>
            )
        }
    }

    const pickWinnerButton = pickWinnerButtonState();

    
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