import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import GameState from "./GameState";
import PlayerCount from "./PlayerCount";
import TableValue from "./TableValue"
import MaxBetAmount from "./MaxBetAmount";
import MinBetAmount from "./MinBetAmount";

const TableInfo = ( { contract } ) => {

    return (
        <Container>
            <Row>
                <Col>
                    Gamestate: <GameState contract={contract} />
                </Col>
                <Col>
                    PlayerCount: <PlayerCount contract={contract} />
                </Col>
                <Col>
                    TableValue: <TableValue contract={contract} /> ETH
                </Col>
                <Col>
                    MaxBetAmount: <MaxBetAmount contract={contract} /> ETH
                </Col>
                <Col>
                    MinBetAmount: <MinBetAmount contract={contract} /> ETH
                </Col>
            </Row>
        </Container>

  )
}

export default TableInfo