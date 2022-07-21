import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import Alert from 'react-bootstrap/Alert'

const PlayerPanel = ( { contract }) => {

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [gameState, setGameState] = useState(null);
    const [betAmount, setBetAmount] = useState(0);

    const getGameState = async () => {
      const state = await contract.callStatic.gameState();
      setGameState(state);
      console.log("PlayerPanel.js - GameState updated to " + state);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Player is betting ' + betAmount + " ETH")
        const options = {value: ethers.utils.parseEther(betAmount)};
        
        contract.joinTable(options)
        .then((result) => {}, (error) => {
            console.log(error.reason);
            setErrorMessage(error.reason);
            setShowError(true);
        });
    }

    useEffect(() => {
      getGameState();
      contract.on("GameStateChanged", (newGameState) => {
          getGameState();
      })
    }, []);

    const joinTableForm = (
        <form onSubmit={handleSubmit}>
            <label>Enter Bet Amount in ETH:
                <input
                    type="text"
                    onChange={(e) => setBetAmount(e.target.value)}
                    />
            </label>
            <input type="submit" />
        </form>
    )

    const errorAlert = showError ? (
        <Alert variant='danger' onClose={() => setShowError(false)} dismissible>
            <Alert.Heading>Oh Snap - this is a overly-dramatic error banner!</Alert.Heading>
            <p>
                {errorMessage}
            </p>
        </Alert>
    ) : <div></div>

    return (
        <Container>
            <Row>
                <Col>
                    {joinTableForm}
                    {errorAlert}
                </Col>
            </Row>
        </Container>
    )
}

export default PlayerPanel