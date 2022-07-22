import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import CasinoWarABI from "./CasinoWarABI.json";
import Alert from 'react-bootstrap/Alert'
import Header from "./Header";
import SharedStatePanels from './SharedStatePanels';
import DealerPanel from './DealerPanel';
import PlayerPanel from './PlayerPanel';
import PlayerBets from './PlayerBets';

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

    const header = (
        <Header provider={provider} currentAccount={currentAccount}/>
    )

    // A function to pass down to children so that the children can pass error data back to parent
    /*const errorsToParent = (childErrorMessage) => {
        setErrorMessage(childErrorMessage);
        setShowErrorMessage(true);
    }*/

    const errorAlert = showErrorMessage ? (
        <Alert variant='danger' onClose={() => setShowErrorMessage(false)} dismissible>
            <Alert.Heading>Oh Snap - this is a overly-dramatic error banner!</Alert.Heading>
            <p>
                {errorMessage}
            </p>
        </Alert>
    ) : <div></div>

    const playerBets = (
        <PlayerBets contract={contract} />
    )

    // Wait for required state to be set before displaying game page
    if (currentAccount && dealerAddress && provider && contract) {
        return (
            <div>
                {header}
                <hr/>
                <SharedStatePanels contract={contract} dealerAddress={dealerAddress} currentAccount={currentAccount}/>
                <hr/>
                <div className="fixed-bottom">
                    {errorAlert}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={connectWalletHandler}>{connButtonText}</button>
            </div>
        )
    }

}

export default App