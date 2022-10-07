import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import contractQR from './assets/contract_qr.png'
import QRCode from "react-qr-code";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';


function ContractInfo({ contractAddress }) {

    const contractAddressPopOver = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Contract Address</Popover.Header>
            <Popover.Body>
                Send ETH direct to this address to join a Running table!
            </Popover.Body>
        </Popover>
    )

    const contractEtherScanPopOver = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Browse on Etherscan</Popover.Header>
            <Popover.Body>
                Scan this QR code to see the contract on Etherscan!
            </Popover.Body>
        </Popover>
    )

    return (
        <Card className="h-100">
            {/*<Card.Header>Contract Address and QR Code</Card.Header>*/}
            <Card.Header>Contract Address - {contractAddress.slice(0, 4) + '...' + contractAddress.slice(contractAddress.length - 4)}</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Text>
                            <OverlayTrigger overlay={contractAddressPopOver} placement={'right'}>
                                <span className="d-inline-block">
                                    <QRCode value={contractAddress} size={100} />
                                </span>
                            </OverlayTrigger>
                        </Card.Text>
                        <span>Send to Address</span>
                    </Col>
                    <Col>
                        <Card.Text>
                            <OverlayTrigger overlay={contractEtherScanPopOver} placement={'left'}>
                                <span className="d-inline-block">
                                    <QRCode value={'https://goerli.etherscan.io/address/' + contractAddress} size={100} />
                                </span>
                            </OverlayTrigger>
                        </Card.Text>
                        <span>Check on Etherscan</span>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default ContractInfo