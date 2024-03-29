import React, { useState, useEffect } from "react"

const Block = ( { provider }) => {

    const [block, setBlock] = useState(null);

    useEffect(() => {

        function handler(blockNumber) {
            setBlock(blockNumber)
        }


        // Subscribe to block update events
        console.log('Block.js - Subscribing to block events.')
        provider.on("block", handler)

        return function cleanup() {
            // Unsubscribe to block events
            console.log('Block.js - Unsubscribing from block events.')
            provider.off('block', handler)
        }
    }, [provider]);  

    return (
        <>
            {block ? block : 'Loading...'}
        </>
    )

}

export default Block