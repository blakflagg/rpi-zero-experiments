import React from 'react';
import RelaySwitch from './RelaySwitch';

const RelayList = (props) => {

  const relayItems = props.relays.map((relay) => {
    return (
      <RelaySwitch
        key={relay.relayID}
        relay={relay}
        handleClick={props.handleClick} />
    )
  })
  return (
    <div>
      {relayItems}
    </div>
  )
}

export default RelayList;
