import React from 'react';
import RelayList from './RelayList';
import socketIOClient from 'socket.io-client';


class RelayControl extends React.Component {
  constructor(){
    super();

    const endpoint = "http://127.0.0.1:3000";
    this.state = {
      response: false,
      relays: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.socket = socketIOClient(endpoint);
  }
  componentDidMount() {
    this.socket.on('connect', () => {
      console.log('connected to server');
    })

    this.socket.on('stateUpdate', data =>{
     this.setState(() => ({ relays: data }));
    })

    this.socket.on('disconnect', () => {
      console.log('disconnected from server');
    })
  }

  handleClick = (relayID) => {
    
    this.socket.emit('updateRelay', {
      relayID: relayID,
      relayState: this.state.relays[relayID -1].relayState ^= 1
    },() =>{
      console.log('callback');
    })
  }

  render() {
    return (

      <div className="container">
      <h2>Relay Control</h2>
      <RelayList handleClick={ this.handleClick } relays={this.state.relays}/>
      </div>
    );
  }


}
export default RelayControl;