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
    answerSelected,
    gameCompleted
} from '../../connection/config'
import {returnLetter} from "../../utilities";
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import LoadingRoom from "./LoadingRoom";
import NicknameIsBusy from "./NicknameIsBusy";
import RoomNotFound from "./RoomNotFound";

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
        this.props.switchState('ROOM_NOT_FOUND'); //LOADING_ROOM TODO temp
        //this.props.game.roomCode && this.props.game.playerName TODO temp
        if(true) {

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

    selectAnswer = (number) => {
        if(this.state.question) {
            this.setState({selectedAnswer: number});
            this.socket.emit(answerSelected, this.props.game.roomCode, this.props.game.playerName, number);
            this.props.switchState('WAITING');
        }
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
                return(
                    <div>
                        room code: {this.props.game.roomCode}<br/>
                        nick: {this.props.game.playerName}<br/>
                        title: {this.props.game.hostingRoom.title}<br/>
                        {this.state.selectedAnswer != null ?
                            this.state.correctAnswer != null ?
                                this.state.selectedAnswer === this.state.correctAnswer ?
                                    'Odpowiedź poprawna! Zdobywasz punkty! Obserwuj komunikaty na ekranie hosta...'
                                    :
                                    'Odpowiedź błędna :( Poprawna odpowiedź to: '+returnLetter(this.state.correctAnswer)+'. Obserwuj komunikaty na ekranie hosta...'
                                :
                                'Wybrano odpowiedź '+returnLetter(this.state.selectedAnswer)+'. Obserwuj komunikaty na ekranie hosta...'
                            :
                            'Dołączono. Obserwuj komunikaty na ekranie hosta...'
                        }
                            <br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Wyjdź z gry</Button>
                    </div>
                );
            case 'QUESTION':
                if(this.state.question){
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
                            <Button variant={"primary"} onClick={() => this.selectAnswer(0)}>Wybierz A</Button>
                            <Button variant={"primary"} onClick={() => this.selectAnswer(1)}>Wybierz B</Button>
                            <Button variant={"primary"} onClick={() => this.selectAnswer(2)}>Wybierz C</Button>
                            <Button variant={"primary"} onClick={() => this.selectAnswer(3)}>Wybierz D</Button>
                            <br/><br/>
                            <Button variant={"danger"} onClick={() => this.props.history.push('/')}>Wyjdź z gry</Button>
                        </div>
                    );
                }else{
                    return(<span/>);
                }
            case 'FINAL':
                let stats = this.state.stats.slice();
                stats.sort((a, b) => {
                    if(a.points < b.points) return 1;
                    if(a.points > b.points) return -1;
                    return 0;
                });
                let place = stats.findIndex(item => {
                    return item.nickname === this.props.game.playerName;
                });
                if(place > -1) {
                    let totalPoints = stats[place].points;
                    place++; // 0 > 1, 1 > 2 etc.
                    return(
                        <div>
                            room code: {this.props.game.roomCode}<br/>
                            nick: {this.props.game.playerName}<br/>
                            title: {this.props.game.hostingRoom.title}<br/>
                            <br/>
                            Zdobyto punktów {totalPoints} oraz zajęto miejsce nr {place} w rankingu generalnym gry<br/>
                            <br/>
                            <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
                        </div>
                    );
                }else{
                    return(<span/>);
                }
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