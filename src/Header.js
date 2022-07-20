import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'

const Header = ( {provider, currentAccount} ) => {

    const [basicInfo, setBasicInfo] = useState({});

    const getBasicInfo = async () => {
        const balance = await provider.getBalance(currentAccount);
        const balanceInEther = ethers.utils.formatEther(balance);
        const block = await provider.getBlockNumber();

        provider.on("block", (block) => {
            setBasicInfo(prev => ({...prev, block }))
        })

        setBasicInfo({
            balance: balanceInEther,
            block,
        })
    }

    useEffect(() => {
        getBasicInfo();
    }, []);

    
    return currentAccount ? <div>
        <header className="App-header">
            <Container>
                <Row>
                    <Col>Address: {currentAccount}</Col>
                    <Col>Balance: {basicInfo.balance} ETH</Col>
                    <Col>Current Block: {basicInfo.block}</Col>
                </Row>
            </Container>
        </header>
    </div>
    :
    <div>connect to get header info</div>          
}

export default Header