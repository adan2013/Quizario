import React from 'react'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";
import {
    closeRoom,
    createNewRoom,
    roomCreated,
    userCountUpdate,
    newQuestion,
    server
} from "../../connection/config";
import {Button, Form} from "react-bootstrap";
import testQuestions from '../../testQuestions'

class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            timeLimit: '0',
            questionLimit: '0',
            randomOrder: false,
            connectedUsers: 0,
            answersCount: 0,
            questions: testQuestions,
            questionIndex: 0,
            questionIsOpen: true
        }
    }

    componentDidMount() {
        this.props.switchState('CREATING');

        this.socket = socketIOClient(server);

        this.socket.on(roomCreated, (code) => {
            this.props.setHostingRoom({...this.props.game.hostingRoom, roomCode: code});
            this.props.switchState('WAITING_FOR_START');
        });

        this.socket.on(userCountUpdate, (count) => {
            this.setState({connectedUsers: count})
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    createRoom = () => {
        const data = {
            title: this.state.title,
            timeLimit: this.state.timeLimit,
            questionLimit: this.state.questionLimit,
            randomOrder: this.state.randomOrder
        };
        this.props.setHostingRoom(data);
        this.props.switchState('WAITING_FOR_CODE');
        this.socket.emit(createNewRoom, data);
    };

    nextQuestion = (index) => {
        this.setState({
            questionIndex: index,
            questionIsOpen: true,
            answersCount: 0
        });
        this.props.switchState('QUESTION');
        this.socket.emit(newQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[index]);
    };

    render() {
        switch(this.props.game.state) {
            case 'CREATING':
                return(
                    <div>
                        <form>
                            <div>Tytuł quizu:</div>
                            <Form.Control type={"text"}
                                          value={this.state.title}
                                          onChange={(e) => this.setState({title: e.target.value})}
                                          maxLength={"30"}/>
                            <div>Limit czasu: (0-wyłączone)</div>
                            <Form.Control type={"text"}
                                          value={this.state.timeLimit}
                                          onChange={(e) => this.setState({timeLimit: e.target.value})}
                                          maxLength={"3"}/>
                            <div>Limit ilości pytań: (0-wyłączone)</div>
                            <Form.Control type={"text"}
                                          value={this.state.questionLimit}
                                          onChange={(e) => this.setState({questionLimit: e.target.value})}
                                          maxLength={"3"}/>
                            <div>Losowa kolejność:</div>
                            <Form.Control type={"checkbox"}
                                          checked={this.state.randomOrder}
                                          onChange={(e) => this.setState({randomOrder: e.target.checked})}
                                          maxLength={"3"}/>
                            <Button type={"submit"} variant={"primary"} onClick={this.createRoom} disabled={this.state.title === ''}>
                                Utwórz pokój
                            </Button>
                            <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
                        </form>
                    </div>
                );
            case 'WAITING_FOR_CODE':
                return(
                    <div>
                        title: {this.props.game.title}<br/>
                        Oczekiwanie na wygenerowanie kodu...<br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Anuluj</Button>
                    </div>
                );
            case 'WAITING_FOR_START':
                return(
                    <div>
                        title: {this.props.game.hostingRoom.title}<br/>
                        przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/>
                        Ilość podłączonych graczy: {this.state.connectedUsers}<br/>
                        Pokój utworzony. Oczekiwanie na graczy...<br/>
                        <Button variant={"danger"} onClick={() => {
                            this.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                            this.props.history.push('/');
                        }}>Anuluj grę</Button>
                        <Button variant={"primary"} onClick={() => {
                            this.nextQuestion(0);
                        }}>Uruchom grę i pokaż pytanie</Button>
                    </div>
                );
            case 'QUESTION':
                return (
                    <div>
                        title: {this.props.game.hostingRoom.title}<br/>
                        przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                        Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                        Poprawna: {this.state.questions[this.state.questionIndex].correct}<br/>
                        A: {this.state.questions[this.state.questionIndex].answers[0]}<br/>
                        B: {this.state.questions[this.state.questionIndex].answers[1]}<br/>
                        C: {this.state.questions[this.state.questionIndex].answers[2]}<br/>
                        D: {this.state.questions[this.state.questionIndex].answers[3]}<br/>
                        Liczba udzielonych odpowiedzi: {this.state.answersCount}<br/>
                        <Button variant={"danger"} disabled={this.state.questionIsOpen} onClick={() => {

                        }}>Zakończ grę</Button>
                        <Button variant={"warning"} disabled={this.state.questionIsOpen} onClick={() => {

                        }}>Pokaż poprawną</Button>
                        <Button variant={"warning"} disabled={this.state.questionIsOpen} onClick={() => {

                        }}>Pokaż statystyki tego pytania</Button>
                        <Button variant={"warning"} disabled={this.state.questionIsOpen} onClick={() => {

                        }}>Pokaż ranking gry</Button>
                        <Button variant={"primary"} onClick={() => {
                            if(this.state.questionIsOpen) {
                                this.setState({questionIsOpen: false});
                                //TODO send event
                            }else{
                                this.nextQuestion(this.state.questionIndex + 1);
                            }
                        }}>{this.state.questionIsOpen ? 'Zakończ odpowiadanie' : 'Następne pytanie'}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Host)