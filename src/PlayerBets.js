import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from "ethers"

const PlayerBets = ( { contract }) => {

    const [playerData, setPlayerData] = useState([]);
    const [playerCount, setPlayerCount] = useState(null);

    const getPlayerCount = async () => {
        const count = ethers.BigNumber.from(await contract.callStatic.getPlayerCount()).toNumber();
        setPlayerCount(count);
        console.log('PlayerBets.js - PlayerCount updated to ' + count);
    } 

    const getPlayers = async () => {
        var playerBetData = [];
        for (let i=0; i<playerCount; i++) {
            const playerAddress = await contract.callStatic.players(i);
            
            // Get the player's bet data
            const playerBet = ethers.utils.formatEther(await contract.callStatic.playerBets(playerAddress));
            console.log('PlayerBets.js - Player with address : ' + playerAddress + ' found with bet amount ' + playerBet + 'ETH');

            // Push this player's entry onto our array
            playerBetData.push({
                playerAddress: playerAddress,
                playerBet: playerBet
            });
            
        }
        // Set the playerBetData into our component's state
        setPlayerData(playerBetData);
    }

    // If a new bet gets placed re-check the player count so we can update playerBets table if needed
    useEffect(() => {
        getPlayerCount();
        contract.on("BetPlacedEvent", (address, amount) => {
            console.log('PlayerBets.js - Bet of ' + amount + ' placed by player with address: ' + address);
            getPlayerCount();
        })
    }, []);

    // If the playerCount changes, re-check the players so that we can update the playerBets table
    useEffect(() => {
        getPlayers();
    }, [playerCount]);

    return (
        <Container>
            <p>Current Bets:</p>
            {playerData.map((player, index) => (
                <p key={player.playerAddress}>PlayerAddress: {player.playerAddress} Bet: {player.playerBet}</p>
            ))}
        </Container>
    )
    
}

export default PlayerBets