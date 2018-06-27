import React from 'react';
import RelaySwitch from './RelaySwitch';
import socketIOClient from 'socket.io-client';


class RelayControl extends React.Component {
  constructor(){
    super();
    const socket = socketIOClient(endpoint);
    const endpoint = "http://127.0.0.1.3000";

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:3000",
      relay1: 0,
      relay2: 0,
      relay3: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    // socket.on('connect', data => this.setState({response: data}));
    this.socket.on('connect', () => {
      console.log('connected to server');
    })
    this. socket.on('stateUpdate', data => this.setState(
      { relay1: data.relay1,
        relay2: data.relay2,
        relay3: data.relay3
      }))
    this.socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  }

  handleClick = (relayID) => {
    socket.emit('updateRelay', {
      relay: relayID,
      value: 1
    })
  }
  render() {
    return (

      <div className="container">
      <h2>Relay Control</h2>
        <RelaySwitch relayState={this.state.relay1} handleClick={this.handleClick} relayID="1" />
        <RelaySwitch relayState={this.state.relay2} handleClick={this.handleClick} relayID="2" />
        <RelaySwitch relayState={this.state.relay3} handleClick={this.handleClick} relayID="3" />
      </div>
    );
  }


}
export default RelayControl;