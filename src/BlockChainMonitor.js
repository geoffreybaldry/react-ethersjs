import React, { useState, useEffect } from "react"
import { ToastContainer } from "react-bootstrap";
import Toast from 'react-bootstrap/Toast'

const BlockChainMonitor = ( { toast } ) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (toast.message != null) { 
            setShow(true)
        }
    }, [toast]);

    return (
        <ToastContainer className="p-3" position={'top-end'}>
            <Toast bg={toast.variant} onClose={() => setShow(false)} show={show} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{toast.heading}</strong>
                    <small>{toast.subheading}</small>
                </Toast.Header>
            <Toast.Body className={toast.variant != null && 'text-white'}>{toast.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default BlockChainMonitor