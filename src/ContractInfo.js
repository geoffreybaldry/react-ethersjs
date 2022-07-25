import React from 'react'
import { Row, Col } from 'react-bootstrap'
import contractQR from './assets/contract_qr.png'

function ContractInfo( { contractAddress } ) {

    return (
        <Row>
            <Col>
            <div className='col-sm-6'>Contract Address: {contractAddress}</div>
            </Col>
            <Col>
                <img src={contractQR} />
                </Col>
        </Row>
    )
}

export default ContractInfo