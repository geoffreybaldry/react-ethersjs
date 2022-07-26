import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Block from "./Block";
import AccountBalance from "./AccountBalance";

const Header = ( {provider, currentAccount} ) => {
    
    /*return currentAccount ? <div>
        <header className="App-header">
            /*<Container>
                <Row>
                    <Col>Account: {currentAccount}</Col>
                    <Col>Balance: <AccountBalance provider={provider} currentAccount={currentAccount}/></Col>
                    <Col>Current Block: <Block provider={provider} /></Col>
                </Row>
            </Container>
        </header>
    </div>
    :
    <div>connect to get header info</div>*/     
    
    return (
        <Card className="h-100">
            <Card.Header>Your Wallet Information</Card.Header>
            <Card.Body>
                <Row>
                    <strong>Account: {currentAccount}</strong>
                </Row>
                <Row>
                    <strong>Balance: <AccountBalance provider={provider} currentAccount={currentAccount}/> ETH</strong>
                </Row>
                <Row>
                    <strong>Current Block: <Block provider={provider} /></strong>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Header