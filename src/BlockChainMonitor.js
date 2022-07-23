import React, { useState, useEffect } from "react"
import { ToastContainer } from "react-bootstrap";
import Toast from 'react-bootstrap/Toast'

const BlockChainMonitor = ( { toastMessage } ) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true)
    }, [toastMessage]);

    return (
        <ToastContainer className="p-3" position={'top-end'}>
            <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Message</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default BlockChainMonitor