import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import { ethers } from 'ethers';

// There must be a better way, lol!!!
import tile1 from './assets/1.png'
import tile2 from './assets/2.png'
import tile3 from './assets/3.png'
import tile4 from './assets/4.png'
import tile5 from './assets/5.png'
import tile6 from './assets/6.png'
import tile7 from './assets/7.png'
import tile8 from './assets/8.png'
import tile9 from './assets/9.png'
import tile10 from './assets/10.png'
import tile11 from './assets/11.png'
import tile12 from './assets/12.png'
import tile13 from './assets/13.png'
import tile14 from './assets/14.png'
import tile15 from './assets/15.png'
import tile16 from './assets/16.png'
import tile17 from './assets/17.png'
import tile18 from './assets/18.png'
import tile19 from './assets/19.png'
import tile20 from './assets/20.png'
import tile21 from './assets/21.png'
import tile22 from './assets/22.png'
import tile23 from './assets/23.png'
import tile24 from './assets/24.png'
import tile25 from './assets/25.png'
import tile26 from './assets/26.png'
import tile27 from './assets/27.png'
import tile28 from './assets/28.png'
import tile29 from './assets/29.png'
import tile30 from './assets/30.png'
import tile31 from './assets/31.png'
import tile32 from './assets/32.png'
import tile33 from './assets/33.png'
import tile34 from './assets/34.png'
import tile35 from './assets/35.png'
import tile36 from './assets/36.png'
import tile37 from './assets/37.png'
import tile38 from './assets/38.png'
import tile39 from './assets/39.png'
import tile40 from './assets/40.png'
import tile41 from './assets/41.png'
import tile42 from './assets/42.png'
import tile43 from './assets/43.png'
import tile44 from './assets/44.png'
import tile45 from './assets/45.png'
import tile46 from './assets/46.png'
import tile47 from './assets/47.png'
import tile48 from './assets/48.png'
import tile49 from './assets/49.png'
import tile50 from './assets/50.png'
import tile51 from './assets/51.png'
import tile52 from './assets/52.png'

const CardTable = ( { contract, playerCount, resetCardTable, gameState } ) => {

    const CardEnum = {
        1: tile1,
        2: tile2,
        3: tile3,
        4: tile4,
        5: tile5,
        6: tile6,
        7: tile7,
        8: tile8,
        9: tile9,
        10: tile10,
        11: tile11,
        12: tile12,
        13: tile13,
        14: tile14,
        15: tile15,
        16: tile16,
        17: tile17,
        18: tile18,
        19: tile19,
        20: tile20,
        21: tile21,
        22: tile22,
        23: tile23,
        24: tile24,
        25: tile25,
        26: tile26,
        27: tile27,
        28: tile28,
        29: tile29,
        30: tile30,
        31: tile31,
        32: tile32,
        33: tile33,
        34: tile34,
        35: tile35,
        36: tile36,
        37: tile37,
        38: tile38,
        39: tile39,
        40: tile40,
        41: tile41,
        42: tile42,
        43: tile43,
        44: tile44,
        45: tile45,
        46: tile46,
        47: tile47,
        48: tile48,
        49: tile49,
        50: tile50,
        51: tile51,
        52: tile52
    }

    const cardSuit = {
        1: 'Clubs',
        2: 'Diamonds',
        3: 'Hearts',
        4: 'Spades'
    }

    const [dealtCards, setDealtCards] = useState([]);
    const [displayCards, setDisplayCards] = useState(false);

    useEffect(() => {
        
        function handleCardDealt(player, cardNumber, cardType) {
            console.log("Card " + ethers.BigNumber.from(cardNumber).toNumber() + " of suit " + cardSuit[ethers.BigNumber.from(cardType).toNumber()] + " was dealt to player " + player);

            // These toasts don't work well beause they don't stack at the moment
            /*toastToParent({
                heading: 'Card Dealt',
                subheading: null,
                message: 'Card ' + card + ' was dealt to player ' + player,
                variant: null
            })*/

            const cardLookup = ethers.BigNumber.from(cardNumber).toNumber() + ((ethers.BigNumber.from(cardType).toNumber() -1) * 13)
            console.log('Card lookup : ' + cardLookup)

            let needsInsert = true;
            for (let i=0; i<dealtCards.length; i++) {
                if (dealtCards[i].playerAddress === player.toString())
                needsInsert = false;
                break;
            }
            if (needsInsert) {
                // Convert the cardNumber and type into a value between 1-52 for our card enum of images to use
                setDealtCards(dealtCards => [...dealtCards, {playerAddress: player, playerCard: cardLookup}]);
            }
        }

        // Subscribe to CardDealtEvent events
        contract.on("CardDealtEvent", handleCardDealt);

        // We need to unsubscribe in clean-up or we'll end up with multiple subscriptions
        return function cleanup() {
            contract.off("CardDealtEvent", handleCardDealt);
        }
    }, []);

    // Action to take whenever we see in state that a player has been dealt a card
    useEffect(() => {  
        if (dealtCards.length === playerCount + 1) { // To include the dealer
            console.log("All the players have been dealt a card " + dealtCards.length);
            setDisplayCards(true);
        } 
    }, [dealtCards, playerCount]);  

    useEffect(() => { 
        if (resetCardTable)  {
            console.log('ResetCardTable event causing reset of cardTable.')
            setDealtCards([]);
        }
    }, [resetCardTable]);

    useEffect(() => { 
        if (gameState === 1)  {
            console.log('GameState change to Running causing reset of cardTable.')
            setDealtCards([]);
        }
    }, [gameState]);

    // Not yet ready to use...
    if (displayCards) {
        // Display the cards that were selected
        return (
            
            <Row>
            {/* Map over the dealtCards array to create bootstrap 'cards' to represent each one*/}

            {dealtCards.map((player, index) => (
                
                    <div className='col-sm-2' key={player.playerAddress}>
                        <Card bg='light' >
                            <Card.Img variant="top" src={CardEnum[player.playerCard]} />
                                <Card.Body>
                                    <Card.Title>{'...' + player.playerAddress.slice(player.playerAddress.length -4)}</Card.Title>
                                    {/*<Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                    </Card.Text>*/}
                                </Card.Body>
                        </Card>
                    </div>
            ))}

            </Row>    
        )
    } else {
        return (
            <div>No Cards have been drawn in this game.</div>
        )
    }

    /*return (
        <div>CardTable not Yet implemented... (but nearly)</div>
    )*/
}

export default CardTable