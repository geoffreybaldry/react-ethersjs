import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import Alert from 'react-bootstrap/Alert'

const PlayerPanel = ( { contract, gameState, errorsToParent }) => {

    const [betAmount, setBetAmount] = useState(0);
    const [joiningTable, setJoiningTable] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Player is betting ' + betAmount + " ETH")
        const options = {value: ethers.utils.parseEther(betAmount)};
        
        contract.joinTable(options)
        .then((result) => {
            // Things to do upon successful submission
            setJoiningTable(true);
        }, (error) => {
            console.log(error.reason);
            errorsToParent(error.reason)
        });
    }

    /*const joinTableForm = (
        <form onSubmit={handleSubmit}>
            <label>Enter Bet Amount in ETH:
                <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setBetAmount(e.target.value)}
                    />
            </label>
            <input type="submit" className="btn btn-primary" disabled={joiningTable}/>
        </form>
    )*/

    const joinTableForm = (
        <form onSubmit={handleSubmit}>
            <label>Enter Bet Amount in ETH:
                <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                        setBetAmount(e.target.value)
                    }}
                    />
            </label>
            <button type="submit" className="btn btn-primary" disabled={joiningTable}>
                {joiningTable && <i className="fa fa-refresh fa-spin"></i>}
                Join Table
            </button>
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