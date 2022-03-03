import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './substrate-lib'
import { Grid } from 'semantic-ui-react'

const Auction = () => {
    const { api } = useSubstrateState()
    const [_, setUnsub] = useState(null)
    const [highestPrice, setHighestPrice] = useState('');
    const [highestBidder, setHighestBidder] = useState('');
    const [isStarted, setIsStarted] = useState('');



    useEffect(() => {
        const query = async (propertyName, callBack) => {
            const unsub = await api.query['templateModule'][propertyName](
                (result) => {
                    callBack(result.toString())
                }
            )
            setUnsub(() => unsub)
        }
        query('highestPrice', setHighestPrice);
        query('highestBidder', setHighestBidder);
        query('isStarted', setIsStarted);
    }, [])

    return (
        <Grid.Column width={8}>
            <h1>Auction State</h1>
            <p>Highest price : {highestPrice} USDT</p>
            <p>Highest bidder : {highestBidder}</p>
            <p>{isStarted}</p>
        </Grid.Column>
    )
}

export default Auction
