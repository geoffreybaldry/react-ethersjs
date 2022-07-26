import React from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import contractQR from './assets/contract_qr.png'
import QRCode from "react-qr-code";


function ContractInfo( { contractAddress } ) {

    // Generate the QR code in real-time from the contract address
    /*return (
        <Row>
            <Col>
                <div className='col-sm-6'>Contract Address: {contractAddress}</div>
            </Col>
            <Col>
                <div className='col-sm-6' style={{ background: 'white', padding: '16px' }}>
                    <QRCode value={contractAddress} size={100}/>
                </div>
            </Col>
        </Row>

    )*/

    return (
        <Card className="h-100">
            <Card.Header>Contract Address and QR Code</Card.Header>
            <Card.Body>
                <Row>
                    <Col>
                        <Card.Title>{contractAddress}</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>Send ETH direct to this address to join a Running table!</Card.Subtitle>
                    </Col>
                    <Col>
                        <Card.Text>
                            <div style={{ background: 'white', padding: '16px' }}>
                                <QRCode value={contractAddress} size={100}/>
                            </div>
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default ContractInfo