import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import DealerPanel from "./DealerPanel";
import PlayerPanel from "./PlayerPanel";
import PlayerBets from "./PlayerBets";

const SharedStatePanels = ( {contract, dealerAddress, currentAccount} ) => {

    const GameState = {
        0: 'Ended',
        1: 'Running',
        2: 'Canceled'
    };


    const [gameState, setGameState] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);
    const [tableValue, setTableValue] = useState(null);

    const getGameState = async () => {
        const state = await contract.callStatic.gameState();
        setGameState(state);
        console.log("GameState updated to " + state);
    }

    const getPlayerCount = async () => {
        const count = ethers.BigNumber.from(await contract.callStatic.getPlayerCount()).toNumber();
        setPlayerCount(count);
        console.log('PlayerCount updated to ' + count);
    }

    const getTableValue = async () => {
        const value = ethers.utils.formatEther(await contract.callStatic.getTableValue());
        setTableValue(value);
        console.log("TableValue updated to " + value);
    }

    useEffect(() => {
        getGameState();
        contract.on("GameStateChanged", (newGameState) => {
            getGameState();
            getPlayerCount(); // because playercount resets to 0 after cancel or win
        })
    }, []);

    useEffect(() => {
        getPlayerCount();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
            getPlayerCount();
        })
    }, []);

    useEffect(() => {
        getTableValue();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
            getTableValue();
        })
    }, []);

    // A function to pass down to children so that the children can pass error data back to parent
    const errorsToParent = (childErrorMessage) => {
        //setErrorMessage(childErrorMessage);
        //setShowErrorMessage(true);
    }

    // Detect if the user is the dealer or a player based on their account addresses
    if (dealerAddress && currentAccount) {
        var dealerPanel = dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase() ? (
            <DealerPanel contract={contract} gameState={gameState} playerCount={playerCount} tableValue={tableValue} errorsToParent={errorsToParent}/>
        ) : <div></div>

        var playerPanel = dealerAddress.toString().toLowerCase() !== currentAccount.toString().toLowerCase() ? (
            <PlayerPanel contract={contract} gameState={gameState} playerCount={playerCount} tableValue={tableValue} errorsToParent={errorsToParent}/>
        ) : <div></div>
    }

    const playerBets = (
        <PlayerBets contract={contract} gameState={gameState} playerCount={playerCount}/>
    )

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        Gamestate: {GameState[gameState]}
                    </Col>
                    <Col>
                        PlayerCount: {playerCount}
                    </Col>
                    <Col>
                        TableValue: {tableValue} ETH
                    </Col>
                    <Col>
                        MaxBetAmount: 5 ETH
                    </Col>
                    <Col>
                        MinBetAmount: 1 ETH
                    </Col>
                </Row>
            </Container>
            <hr/>
            {dealerPanel}
            {playerPanel}
            <hr/>
            {playerBets}
        </>
        
    )
}

export default SharedStatePanels