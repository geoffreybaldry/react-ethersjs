import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"

const DealerPanel = ( { contract, errorsToParent }) => {

    const [gameState, setGameState] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);
    const [tableValue, setTableValue] = useState(null);

    const [startButtonText, setStartButtonText] = useState('Start Game');
    const [showPickWinnerButton, setShowPickWinnerButton] = useState(false);

    // These need re-factoring because it's repetition of what is done in the individual components
    // Need to work out a better way to share state between components, and not just child<->parent
    // but also child<->child - maybe redux?
    const getPlayerCount = async () => {
        const count = ethers.BigNumber.from(await contract.callStatic.getPlayerCount()).toNumber();
        setPlayerCount(count);
        console.log('DealerPanel.js - PlayerCount updated to ' + count);
    }

    const getTableValue = async () => {
        const value = ethers.utils.formatEther(await contract.callStatic.getTableValue());
        setTableValue(value);
        console.log("DealerPanel.js - TableValue updated to " + value);
    }

    const getGameState = async () => {
        const state = await contract.callStatic.gameState();
        setGameState(state);
        console.log("DealerPanel.js - GameState updated to " + state);
    }

    // Subscribe to GameStateChanged events from the smart contract
    useEffect(() => {
        getGameState();
        contract.on("GameStateChanged", (newGameState) => {
            getGameState();
        })
    }, []); // [] means only run this useEffect once

    useEffect(() => {
        getPlayerCount();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('DealerPanel.js - Bet of ' + amount + ' placed by player with address: ' + address);
            getPlayerCount();
        })
    }, []);

    useEffect(() => {
        if (playerCount > 0) {
            setShowPickWinnerButton(true);
        } else {
            setShowPickWinnerButton(false);
        }
    }, [playerCount])

    useEffect(() => {
        getTableValue();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
            getTableValue();
        })
    }, []);

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