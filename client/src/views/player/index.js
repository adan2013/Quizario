import React from 'react'
import socketIOClient from 'socket.io-client'
import {
    server,
    addToRoom,
    roomNotFound,
    nicknameIsBusy,
    joinedToRoom,
    answersOpen,
    answersClose,
    gameCompleted
} from '../../connection/config'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import LoadingRoom from "./LoadingRoom";
import NicknameIsBusy from "./NicknameIsBusy";
import RoomNotFound from "./RoomNotFound";
import Waiting from "./Waiting";
import Question from "./Question";
import Final from "./Final";

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: null,
            selectedAnswer: null,
            correctAnswer: null
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
                this.setState({question: question, selectedAnswer: null, correctAnswer: null});
                this.props.switchState('QUESTION');
            });

            this.socket.on(answersClose, question => {
                this.setState({question: question, correctAnswer: question.correct});
                this.props.switchState('WAITING');
            });

            this.socket.on(gameCompleted, stats => {
                this.setState({stats: stats});
                this.props.switchState('FINAL');
            });

        }else{
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        if(this.socket) this.socket.disconnect();
    }

    selected = (number) => {
        this.setState({selectedAnswer: number});
    };

    render() {
        switch(this.props.game.state) {
            case 'LOADING_ROOM':
                return(<LoadingRoom {...this.props}/>);
            case 'NICKNAME_IS_BUSY':
                return(<NicknameIsBusy {...this.props}/>);
            case 'ROOM_NOT_FOUND':
                return(<RoomNotFound {...this.props}/>);
            case 'WAITING':
                return(<Waiting {...this.props}
                                selectedAnswer={this.state.selectedAnswer}
                                correctAnswer={this.state.correctAnswer}/>);
            case 'QUESTION':
                return(<Question {...this.props}
                                 socket={this.socket}
                                 question={this.state.question}
                                 selected={this.selected}/>);
            case 'FINAL':
                return(<Final {...this.props}
                              stats={this.state.stats}/>);
            default:
                return(<span>NOT FOUND</span>);
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