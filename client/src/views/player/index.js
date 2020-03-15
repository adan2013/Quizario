import React from 'react'
import socketIOClient from 'socket.io-client'
import {server, addToRoom, roomNotFound, joinedToRoom} from '../../connection/config'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";

class Player extends React.Component {

    componentDidMount() {
        this.props.switchState('LOADING_ROOM');
        if(this.props.game.roomCode && this.props.game.playerName) {
            this.socket = socketIOClient(server);

            this.socket.on('connect', data => {
                this.socket.emit(addToRoom, this.props.game.roomCode, this.props.game.playerName);
            });

            this.socket.on(roomNotFound, () => {
                this.props.switchState('ROOM_NOT_FOUND');
            });

            this.socket.on(joinedToRoom, (roomObject) => {
                this.props.setHostingRoom(roomObject);
                this.props.switchState('WAITING');
            });

        }else{
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    render() {
        switch(this.props.game.state) {
            case 'LOADING_ROOM':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        łączenie z pokojem...
                    </div>
                );
            case 'ROOM_NOT_FOUND':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        POKÓJ NIE ISTNIEJE!
                    </div>
                );
            case 'WAITING':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        title: {this.props.game.hostingRoom.title}<br/>
                        Dołączono. Obserwuj komunikaty na ekranie hosta...
                    </div>
                );
            default:
                return(<span>BRAK WIDOKU</span>);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setHostingRoom: (...args) => dispatch(setHostingRoomAC(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Player)