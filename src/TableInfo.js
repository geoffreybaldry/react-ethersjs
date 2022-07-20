import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

const TableInfo = ( { provider, contract } ) => {

    const [tableInfo, setTableInfo] = useState({});

    const getTableInfo = async () => {
        const gameState = await contract.gameState();
        const mapGameState = {0: "Started", 1: "Running", 2: "Ended", 3:"Canceled"};
        const friendlyGameState = mapGameState[gameState];
        const playerCount = ethers.BigNumber.from(await contract.getPlayerCount()).toNumber();
        const tableValue = ethers.utils.formatEther( await(contract.getTableValue()) );
        const maxBetAmount = ethers.utils.formatEther( await(contract.maxBetAmount()) );
        const minBetAmount = ethers.utils.formatEther( await(contract.minBetAmount()) );

        provider.on("BetPlacedEvent", (address, amount) => {
            //setBasicInfo(prev => ({...prev, block }))
            console.log('Bet of ' + amount + ' placed by player with address: ' + address);
        })

        setTableInfo({
            gameState,
            friendlyGameState,
            playerCount,
            tableValue,
            maxBetAmount,
            minBetAmount
        })
    }

    useEffect(() => {
        getTableInfo();
    });

    return (
        <Container>
            <Row>
                <Col> Gamestate:</Col>
                <Col> PlayerCount:</Col>
                <Col> TableValue:</Col>
                <Col> MaxBetAmount:</Col>
                <Col> MinBetAmount:</Col>
            </Row>
            <Row>
                <Col> {tableInfo.friendlyGameState} </Col>
                <Col> {tableInfo.playerCount} </Col>
                <Col> {tableInfo.tableValue} ETH </Col>
                <Col> {tableInfo.maxBetAmount} ETH </Col>
                <Col> {tableInfo.minBetAmount} ETH </Col>
            </Row>            
        </Container>
  )
}

export default TableInfo