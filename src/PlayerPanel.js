import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import Alert from 'react-bootstrap/Alert'

const PlayerPanel = ( { contract, errorsToParent }) => {

    //const [showError, setShowError] = useState(false);
    //const [errorMessage, setErrorMessage] = useState(null);

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
            errorsToParent(error.reason)
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

    return (
        <Container>
            <Row>
                <Col>
                    {joinTableForm}
                </Col>
            </Row>
        </Container>
    )
}

export default PlayerPanel