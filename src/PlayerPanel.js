import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const PlayerPanel = ( { contract, playerData, currentAccount, errorsToParent }) => {

    const [betAmount, setBetAmount] = useState(0);
    const [joiningTable, setJoiningTable] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        let isJoinedTest=false
        for (let i=0; i<playerData.length; i++) {
            if (playerData[i].playerAddress.toLowerCase() === currentAccount.toLowerCase()) {
                isJoinedTest=true;
                break;
            }
        }
        isJoinedTest ? setIsJoined(true) : setIsJoined(false)
        
    }, [playerData, currentAccount]);

    useEffect(() => {
        console.log('Player isJoined is set to ' + isJoined);
        setJoiningTable(false);
    }, [isJoined]);

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
            <button type="submit" className="btn btn-primary" disabled={joiningTable}>Place Bet
                {joiningTable && <FontAwesomeIcon icon={faSpinner} spin />}
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