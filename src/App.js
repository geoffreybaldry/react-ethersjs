import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import CasinoWarABI from "./CasinoWarABI.json";
import Header from "./Header";
import TableInfo from './TableInfo';
import DealerPanel from './DealerPanel';
import PlayerPanel from './PlayerPanel';

const App = () => {

    // Smart contract address
    const contractAddress = '0x02a5bfbb644596700c5624ed428371eb0f657023';

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

    if (dealerAddress && currentAccount) {
        var dealerPanel = dealerAddress.toString().toLowerCase() === currentAccount.toString().toLowerCase() ? (
            <DealerPanel contract={contract} />
        ) : <div></div>

        var playerPanel = dealerAddress.toString().toLowerCase() !== currentAccount.toString().toLowerCase() ? (
            <PlayerPanel contract={contract} />
        ) : <div></div>
    }

    if (currentAccount && dealerAddress && provider && contract) {
        return (
            <div>
                {header}
                <hr/>
                {tableInfo}
                <hr/>
                {dealerPanel}
                {playerPanel}
                <hr/>
            </div>
        )
    } else {
        return (
            <div>
                <button onClick={connectWalletHandler}>{connButtonText}</button>

                {errorMessage}
            </div>
        )
    }

}

export default App