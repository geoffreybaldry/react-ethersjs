import React, { useState, useEffect } from 'react'

const CardTable = ( { contract, playerCount, toastToParent } ) => {

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
        console.log('Length of dealt cards array is ' + dealtCards.length);

        if (dealtCards.length === playerCount + 1) { // To include the dealer
            console.log("All the players have been dealt a card " + dealtCards.length);
        }

        setDisplayCards(true);

    }, [dealtCards, playerCount]);  

    if (displayCards) {
        // Display the cards that were selected


    }

    return (
        <div>No Cards have been drawn in this game.</div>
    )
}

export default CardTable