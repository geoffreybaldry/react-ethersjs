import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert'
import DealerPanel from "./DealerPanel";
import PlayerPanel from "./PlayerPanel";
import BlockChainMonitor from "./BlockChainMonitor";

const SharedStatePanels = ( {contract, dealerAddress, currentAccount} ) => {

    const GameState = {
        0: 'Ended',
        1: 'Running',
        2: 'Canceled'
    };

    const [gameState, setGameState] = useState(null);
    const [playerCount, setPlayerCount] = useState(null);
    const [tableValue, setTableValue] = useState(null);
    const [playerData, setPlayerData] = useState([]);

    const [errorMessage, setErrorMessage] = useState(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [toastMessage, setToastMessage] = useState(null);

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

    const getPlayers = async () => {
        var playerBetData = [];
        for (let i=0; i<playerCount; i++) {
            const playerAddress = await contract.callStatic.players(i);
            
            // Get the player's bet data
            const playerBet = ethers.utils.formatEther(await contract.callStatic.playerBets(playerAddress));
            console.log('PlayerBets.js - Player with address : ' + playerAddress + ' found with bet amount ' + playerBet + 'ETH');

            // Push this player's entry onto our array
            playerBetData.push({
                playerAddress: playerAddress,
                playerBet: playerBet
            });
            
        }
        // Set the playerBetData into our component's state
        setPlayerData(playerBetData);
    }

    // If the playerCount changes, re-check the players so that we can update the playerBets table
    useEffect(() => {
        getPlayers();
    }, [playerCount]);

    useEffect(() => {
        getGameState();
        contract.on("GameStateChanged", (newGameState) => {
            getGameState();
            getPlayerCount(); // because playercount resets to 0 after cancel or win
            getTableValue(); // likewise
            setToastMessage('GameState changed to ' + newGameState);
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
            setToastMessage('Bet of ' + ethers.utils.formatEther(amount) + ' ETH placed by player with address: ' + address);
        })
    }, []);

    // A function to pass down to children so that the children can pass error data back to parent
    const errorsToParent = (childErrorMessage) => {
        setErrorMessage(childErrorMessage);
        setShowErrorMessage(true);
    }

    const errorAlert = showErrorMessage ? (
        <Alert variant='danger' onClose={() => setShowErrorMessage(false)} dismissible>
            <Alert.Heading>Oh Snap - an error occurred</Alert.Heading>
            <hr/>
            <p>
                {errorMessage}
            </p>
        </Alert>
    ) : <div></div>

    // Detect if the user is the dealer or a player based on their account addresses
    if (dealerAddress && currentAccount) {
        var dealerPanel = dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase() ? (
            <DealerPanel contract={contract} gameState={gameState} playerCount={playerCount} tableValue={tableValue} errorsToParent={errorsToParent}/>
        ) : <div></div>

        var playerPanel = dealerAddress.toString().toLowerCase() !== currentAccount.toString().toLowerCase() ? (
            <PlayerPanel contract={contract} playerData={playerData} currentAccount={currentAccount} errorsToParent={errorsToParent}/>
        ) : <div></div>
    }

    const playerBets = (
        <Container>
            <p>Current Bets:</p>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th scope="col">Player Address</th>
                        <th scope="col">Bet Amount</th>
                    </tr>
                </thead>
                <tbody>
            
                {playerData.map((player, index) => (
                    <tr key={player.playerAddress}>
                        <td>{player.playerAddress}</td>
                        <td>{player.playerBet}</td>
                    </tr> 
                ))}

                </tbody>
            </Table>
        </Container>
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
            <BlockChainMonitor toastMessage={toastMessage} />
            
            <div className="fixed-bottom">
                <Container>
                    {errorAlert}
                </Container>   
            </div>
                
            
        </>
        
    )
}

export default SharedStatePanels