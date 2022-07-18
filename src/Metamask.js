import React, { Component } from 'react';

import { ethers } from "ethers";
import CasinoWarABI from "./CasinoWarABI.json";

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    const block = await provider.getBlockNumber();

    provider.on("block", (block) => {
        this.setState({ block })
    })

    const casinoWarContract = new ethers.Contract(window.contractAddress, CasinoWarABI, provider);
    const gameState = await casinoWarContract.gameState();
    const playerCount = ethers.BigNumber.from(await casinoWarContract.getPlayerCount()).toNumber();
    
    const dealerAddress = (await casinoWarContract.dealer()).toString().toLowerCase();
    const tableValue = ethers.utils.formatEther(await casinoWarContract.getTableValue());
    const maxBetAmount = ethers.utils.formatEther(await casinoWarContract.maxBetAmount());
    const minBetAmount = ethers.utils.formatEther(await casinoWarContract.minBetAmount());

    this.setState({ selectedAddress: accounts[0].toString().toLowerCase(), 
                    balance: balanceInEther,
                    block,
                    dealerAddress,
                    gameState,
                    playerCount,
                    tableValue,
                    maxBetAmount,
                    minBetAmount
    })

    // Filtering for events
    /*filter = {
        address: window.contractAddress,
        topics: [
            // the name of the event, parnetheses containing the data type of each event, no spaces
            utils.id("BetPlacedEvent(address,uint)")
        ]
    }*/

    casinoWarContract.on("BetPlacedEvent", (address, amount)=>{
        console.log(address, amount);
    })
  }

  async joinTable() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const casinoWarContract = new ethers.Contract('0x7d63464EBc9dA9A90D283D22c33cE24cC6864d56', CasinoWarABI, provider);
    const casinoWarContractWithSigner = casinoWarContract.connect(signer);

    const options = {value: ethers.utils.parseEther("1.0")};
    const receipt = await casinoWarContractWithSigner.joinTable(options);
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()}>Connect to Metamask</button>
      )
    } else {
      return (
        <div>
            <p>Welcome {this.state.selectedAddress}</p>
            <p>Your ETH Balance is: {this.state.balance} ETH</p>
            <p>Current ETH Block is: {this.state.block}</p>
            <p>Current Game state is: {this.state.gameState}</p>
            <p>Current player count is: {this.state.playerCount}</p>
            <p>Dealer Address is : {this.state.dealerAddress}</p>
            <p>Table Value is : {this.state.tableValue} ETH</p>
            <p>Max bet amount is : {this.state.maxBetAmount} ETH</p>
            <p>Min bet amount is : {this.state.minBetAmount} ETH</p>
        </div>
      );
    }
  }

  renderJoinTableButton() {
    if (this.state.selectedAddress !== this.state.dealerAddress) {
        return (
            <div>
                <p>{this.state.selectedAddress}, {this.state.dealerAddress}</p>
                <button onClick={() => this.joinTable()}>Join Table</button>
            </div>
        )
    }
  }

  render() {
    return(
      <div>
        {this.renderMetamask()}
        {this.renderJoinTableButton()}
      </div>
    )
  }
}

export default Metamask;