import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import Block from "./Block";
import AccountBalance from "./AccountBalance";

const Header = ( {provider, currentAccount} ) => {
    
    return currentAccount ? <div>
        <header className="App-header">
            <Container>
                <h3>Casino War - Live Table Info</h3>
                <hr />
                <Row>
                    <Col>Account: {currentAccount}</Col>
                    <Col>Balance: <AccountBalance provider={provider} currentAccount={currentAccount}/></Col>
                    <Col>Current Block: <Block provider={provider} /></Col>
                </Row>
            </Container>
        </header>
    </div>
    :
    <div>connect to get header info</div>          
}

export default Header