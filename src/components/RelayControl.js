import React from 'react';
import RelayList from './RelayList';
import socketIOClient from 'socket.io-client';
import ip from 'ip';


class RelayControl extends React.Component {
  constructor(){
    super();

    const endpoint = `http://${ip.address()}:3000`;
    this.state = {
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
    const cloneRelays = this.state.relays;
    this.socket.emit('updateRelay', {
      relayID: relayID,
      relayState: this.state.relays[cloneRelays.findIndex((obj) => {return obj.relayID === relayID })].relayState ^= 1
    },() =>{
      //Call Back Code here if needed
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