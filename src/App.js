import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import Header from "./Header";
import TableInfo from './TableInfo';
import DealerPanel from './DealerPanel';
import CasinoWarABI from "./CasinoWarABI.json";

const App = () => {

    // Smart contract address
    //const contractAddress = '0x086479A7d85524E68Cfeb9868C3A29CAd7791cbf';
    const contractAddress = window.contractAddress;

    const [errorMessage, setErrorMessage] = useState(null);
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
        setCurrentAccount(newAccount);
        updateEthers();
    }

    const updateEthers = async () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, CasinoWarABI, tempSigner);
        setContract(tempContract)

        let tempDealerAddress = await tempContract.dealer();
        setDealerAddress(tempDealerAddress);
    }

    if (currentAccount && dealerAddress && provider) {
        return (
            <div className="container">
                <Header provider={provider} currentAccount={currentAccount}/>
                <hr/>
                <TableInfo provider={provider} contract={contract} />
                <hr/>
                <DealerPanel dealerAddress={dealerAddress} currentAccount={currentAccount} provider={provider} contract={contract} />
            </div>
        )
    } else {
        return (
            <div className="container">
                <button onClick={connectWalletHandler}>{connButtonText}</button>
                <hr/>
                {errorMessage}
            </div>
        )
    }

}

export default App