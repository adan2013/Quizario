import React from 'react'
import socketIOClient from 'socket.io-client'
import {
    server,
    addToRoom,
    roomNotFound,
    nicknameIsBusy,
    joinedToRoom,
    answersOpen
} from '../../connection/config'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null
        }
    }

    componentDidMount() {
        this.props.switchState('LOADING_ROOM');
        if(this.props.game.roomCode && this.props.game.playerName) {
            this.socket = socketIOClient(server);

            this.socket.on('connect', () => {
                this.socket.emit(addToRoom, this.props.game.roomCode, this.props.game.playerName);
            });

            this.socket.on(nicknameIsBusy, () => {
                this.props.switchState('NICKNAME_IS_BUSY');
            });

            this.socket.on(roomNotFound, () => {
                this.props.switchState('ROOM_NOT_FOUND');
            });

            this.socket.on(joinedToRoom, (roomObject) => {
                this.props.setHostingRoom(roomObject);
                this.props.switchState('WAITING');
            });

            this.socket.on(answersOpen, question => {
                this.setState({question: question});
                this.props.switchState('QUESTION');
            });

        }else{
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        if(this.socket) this.socket.disconnect();
    }

    render() {
        switch(this.props.game.state) {
            case 'LOADING_ROOM':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        łączenie z pokojem...<br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Anuluj</Button>
                    </div>
                );
            case 'NICKNAME_IS_BUSY':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        WYBRANY NICK JUŻ ISTNIEJE W POKOJU! WYBIERZ INNY!<br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
                    </div>
                );
            case 'ROOM_NOT_FOUND':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        POKÓJ NIE ZOSTAŁ ZNALEZIONY!<br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
                    </div>
                );
            case 'WAITING':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        title: {this.props.game.hostingRoom.title}<br/>
                        Dołączono. Obserwuj komunikaty na ekranie hosta...<br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Wyjdź z gry</Button>
                    </div>
                );
            case 'QUESTION':
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        title: {this.props.game.hostingRoom.title}<br/>
                        Odpowiedz na pytanie:<br/><br/>
                        Pytanie: {this.state.question.question}<br/>
                        A: {this.state.question.answers[0]}<br/>
                        B: {this.state.question.answers[1]}<br/>
                        C: {this.state.question.answers[2]}<br/>
                        D: {this.state.question.answers[3]}<br/>
                        <br/>
                        <Button variant={"primary"} onClick={() => {

                        }}>Wybierz A</Button>
                        <Button variant={"primary"} onClick={() => {

                        }}>Wybierz B</Button>
                        <Button variant={"primary"} onClick={() => {

                        }}>Wybierz C</Button>
                        <Button variant={"primary"} onClick={() => {

                        }}>Wybierz D</Button>
                        <br/><br/>
                        <Button variant={"danger"} onClick={() => this.props.history.push('/')}>Wyjdź z gry</Button>
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