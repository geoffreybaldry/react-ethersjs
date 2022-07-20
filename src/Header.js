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
        <header> <h2>Welcome to Casino War!!</h2>
            <Container>
                <Row>
                    <Col>Your Address:</Col>
                    <Col>Your Balance:</Col>
                    <Col>Current Block:</Col>
                </Row>
                <Row>
                    <Col>{currentAccount}</Col>
                    <Col>{basicInfo.balance} ETH</Col>
                    <Col>{basicInfo.block}</Col>
                </Row>                
            </Container>
        </header>
    </div>
    :
    <div>Connect to your account to get header info</div>          
}

export default Header