import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import CasinoWarABI from "./CasinoWarABI.json";
import Alert from 'react-bootstrap/Alert'
import { Container } from 'react-bootstrap'
import Header from "./Header";
import SharedStatePanels from './SharedStatePanels';

const App = () => {

    // Smart contract address
    const contractAddress = window.contractAddress;

    const [errorMessage, setErrorMessage] = useState(null);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [currentAccount, setCurrentAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const [dealerAddress, setDealerAddress] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
                setConnButtonText('Wallet Connected');
            })
        } else {
            setErrorMessage("Need to install MetaMask!");
        }
    }

    const accountChangedHandler = (newAccount) => {
        console.log("App.js - accountChangedHandler()");
        setCurrentAccount(newAccount);
        updateEthers();
    }

    const updateEthers = async () => {
        console.log("App.js - updateEthers()");

        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, CasinoWarABI, tempSigner);
        setContract(tempContract)

        let tempDealerAddress = await tempContract.dealer();
        setDealerAddress(tempDealerAddress);
    }

    useEffect(() => {
        function handler (accounts) {
            accountChangedHandler(accounts[0])
        } 
        // Subscribe to account switching events
        console.log('Subscribing to accountsChanged event.')
        window.ethereum.on('accountsChanged', handler);

        return function cleanup() {
            console.log('Un-Subscribing from accountsChanged event.')
            window.ethereum.removeListener('accountsChanged', handler)
        }
    }, []);  

    const header = (
        <Header provider={provider} currentAccount={currentAccount}/>
    )

    const errorAlert = showErrorMessage ? (
        <Alert variant='danger' onClose={() => setShowErrorMessage(false)} dismissible>
            <Alert.Heading>Oh Snap - an error occurred</Alert.Heading>
            <p>
                {errorMessage}
            </p>
        </Alert>
    ) : <div></div>

    const mainPage = (
        <Container>
            <div>
                {header}
                <hr/>
                <SharedStatePanels contract={contract} dealerAddress={dealerAddress} currentAccount={currentAccount}/>
                <hr/>
                <div className="fixed-bottom">
                    {errorAlert}
                </div>
            </div>
        </Container>
    )


    // Wait for required state to be set before displaying game page
    if (currentAccount && dealerAddress && provider && contract && signer) {
        return (
            mainPage
        )
    } else {
        return (
            <div className="container">
                <h1>Welcome to Casino War!</h1>
                <button className="btn btn-primary" onClick={connectWalletHandler}>{connButtonText}</button>
            </div>
        )
    }

}

export default App