import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import tile000 from './assets/tile000.png'
import tile001 from './assets/tile001.png'

const CardTable = ( { contract, playerCount, currentAccount, toastToParent } ) => {

    const [dealtCards, setDealtCards] = useState([]);
    const [displayCards, setDisplayCards] = useState(false);

    useEffect(() => {
        
        function handleCardDealt(player, card) {
            console.log("Card " + card + " was dealt to player " + player);

            // These toasts don't work well beause they don't stack at the moment
            toastToParent({
                heading: 'Card Dealt',
                subheading: null,
                message: 'Card ' + card + ' was dealt to player ' + player,
                variant: null
            })
            setDealtCards(dealtCards => [...dealtCards, {player: card}]);
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

    /* Not yet ready to use...
    if (displayCards) {
        // Display the cards that were selected
        return (
            <>
            <Row>
            <div className='col-sm-2'>
            
            <Card bg='light'>
                <Card.Img variant="top" src={tile000} />
                    <Card.Body>
                        <Card.Title>Player 1</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
            </Card>
            </div>
            <div className='col-sm-2'>
            <Card bg='warning' >
                <Card.Img variant="top" src={tile001} className='mx-auto d-block'/>
                    <Card.Body>
                        <Card.Title>Dealer</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
            </Card>
            
            </div>
            </Row>
            </>
        )
    } else {
        return (
            <div>No Cards have been drawn in this game.</div>
        )
    }*/

    return (
        <div>CardTable not Yet implemented... (but nearly)</div>
    )
}

export default CardTable