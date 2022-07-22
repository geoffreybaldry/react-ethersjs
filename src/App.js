import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import CasinoWarABI from "./CasinoWarABI.json";
import Alert from 'react-bootstrap/Alert'
import Header from "./Header";
import TableInfo from './TableInfo';
import DealerPanel from './DealerPanel';
import PlayerPanel from './PlayerPanel';

const App = () => {

    // Smart contract address
    const contractAddress = '0x02a5bfbb644596700c5624ed428371eb0f657023';

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

    const tableInfo = (
        <TableInfo contract={contract} />
    )

    // A function to pass down to children so that the children can pass error data back to parent
    const errorsToParent = (childErrorMessage) => {
        setErrorMessage(childErrorMessage);
        setShowErrorMessage(true);
    }

    // Detect if the user is the dealer or a player based on their account addresses
    if (dealerAddress && currentAccount) {
        var dealerPanel = dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase() ? (
            <DealerPanel contract={contract} />
        ) : <div></div>

        var playerPanel = dealerAddress.toString().toLowerCase() !== currentAccount.toString().toLowerCase() ? (
            <PlayerPanel contract={contract} errorsToParent={errorsToParent}/>
        ) : <div></div>
    }

    const errorAlert = showErrorMessage ? (
        <Alert variant='danger' onClose={() => setShowErrorMessage(false)} dismissible>
            <Alert.Heading>Oh Snap - this is a overly-dramatic error banner!</Alert.Heading>
            <p>
                {errorMessage}
            </p>
        </Alert>
    ) : <div></div>

    // Wait for required state to be set before displaying game page
    if (currentAccount && dealerAddress && provider && contract) {
        return (
            <div>
                {header}
                <hr/>
                {tableInfo}
                <hr/>
                {dealerPanel}
                {playerPanel}
                <div className="fixed-bottom">
                    {errorAlert}
                </div>
                <hr/>
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