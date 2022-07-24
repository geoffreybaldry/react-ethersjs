import React, { useState } from "react"

const Block = ( { provider }) => {

    const [block, setBlock] = useState(null);

    provider.on("block", (blockNumber) => {
        setBlock(blockNumber);
    })

    return (
        <div>
            {block}
        </div>
    )

}

export default Block