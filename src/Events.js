import React, { useEffect, useState } from 'react'
import { Feed, Grid } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'

const eventName = ev => `${ev.section}:${ev.method}`

function Main(props) {
  const { api } = useSubstrateState()
  const [eventFeed, setEventFeed] = useState([])

  useEffect(() => {
    let unsub = null
    let keyNum = 0
    const allEvents = async () => {
      unsub = await api.query.system.events(events => {
        // loop through the Vec<EventRecord>
        events.forEach(record => {
          // extract the phase, event and the event types
          const { event } = record

          // show what we are busy with
          const evHuman = event.toHuman()
          const evName = eventName(evHuman)

          if (evName.includes('templateModule:')) {
            const eventNames = evName.split(':');
            let eventContent = '';
            switch (eventNames[1]) {
              case 'HighestPriceUpdated':
                eventContent = `${evHuman.data[1]} đã đặt giá ${evHuman.data[0]} USDT`;
                break;
              case 'AuctionStarted':
                eventContent = `Cuộc đấu giá đã bắt đầu`;
                break;
              case 'AuctionEnded':
                eventContent = `Cuộc đấu giá đã kết thúc. ${evHuman.data[1]} đã chiến thắng với giá ${evHuman.data[0]} USDT`;
                break;
              default:
                break;
            }

            setEventFeed(e => [
              ...e,
              {
                key: keyNum,
                icon: 'bell',
                summary: eventNames[1],
                content: eventContent,
              },
            ])
            keyNum += 1
          } else {
            return;
          }
        })
      })
    }

    allEvents()
    return () => unsub && unsub()
  }, [api.query.system])

  const { feedMaxHeight = 250 } = props

  return (
    <Grid.Column width={8}>
      <h1 style={{ float: 'left' }}>Auction Events</h1>
      <Feed
        style={{ clear: 'both', overflow: 'auto', maxHeight: feedMaxHeight }}
        events={eventFeed}
      />
    </Grid.Column>
  )
}

export default function Events(props) {
  const { api } = useSubstrateState()
  return api.query && api.query.system && api.query.system.events ? (
    <Main {...props} />
  ) : null
}
