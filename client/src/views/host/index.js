import React from 'react'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";
import {
    server,
    closeRoom,
    createNewRoom,
    roomCreated,
    userCountUpdate,
    newQuestion,
    closeQuestion,
    answerCountUpdate,
    answerStatsRequest,
    answerStatsResponse,
    generalRankingRequest,
    generalRankingResponse
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
            answerCount: 0,
            questions: testQuestions,
            questionIndex: 0,
            questionIsOpen: true,
            questionTab: 0,
            answerStats: null,
            generalRanking: null
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

        this.socket.on(answerCountUpdate, (count) => {
            this.setState({answerCount: count})
        });

        this.socket.on(answerStatsResponse, (stats) => {
            this.setState({answerStats: stats})
        });

        this.socket.on(generalRankingResponse, (stats) => {
            this.setState({generalRanking: stats})
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
            answerCount: 0,
            questionTab: 0
        });
        this.props.switchState('QUESTION');
        this.socket.emit(newQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[index]);
    };

    returnLetter = (number) => {
        switch(number) {
            case 0: return 'A';
            case 1: return 'B';
            case 2: return 'C';
            case 3: return 'D';
            default: return '';
        }
    };

    ControlButtons = () => {
        return(
            <div>
                <Button variant={"danger"} disabled={this.state.questionIsOpen} onClick={() => {
                    this.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                    this.props.history.push('/');
                }}>Zakończ grę</Button>
                <Button variant={"warning"} disabled={this.state.questionIsOpen || this.state.questionTab === 1} onClick={() => {
                    this.setState({questionTab: 1})
                }}>Poprawna odp.</Button>
                <Button variant={"warning"} disabled={this.state.questionIsOpen || this.state.questionTab === 2} onClick={() => {
                    this.setState({
                        questionTab: 2,
                        answerStats: null
                    });
                    this.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
                }}>Statystyki tego pytania</Button>
                <Button variant={"warning"} disabled={this.state.questionIsOpen || this.state.questionTab === 3} onClick={() => {
                    this.setState({
                        questionTab: 3,
                        generalRanking: null
                    });
                    this.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
                }}>Ranking ogólny gry</Button>
                <Button variant={"primary"} onClick={() => {
                    if(this.state.questionIsOpen) {
                        this.setState({questionIsOpen: false});
                        this.socket.emit(closeQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[this.state.questionIndex]);
                    }else{
                        this.nextQuestion(this.state.questionIndex + 1);
                    }
                }}>{this.state.questionIsOpen ? 'Zakończ odpowiadanie' : 'Następne pytanie'}</Button>
            </div>
        );
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
                switch (this.state.questionTab) {
                    case 1: //correct answer
                        return (
                            <div>
                                title: {this.props.game.hostingRoom.title}<br/>
                                przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                Poprawną odpowiedzią było: {this.returnLetter(this.state.questions[this.state.questionIndex].correct)}<br/>
                                Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                <this.ControlButtons/>
                            </div>
                        );
                    case 2: //question stats
                        if(this.state.answerStats) {
                            let p1, p2, p3, p4;
                            if(this.state.answerCount === 0) {
                                p1 = 0;
                                p2 = 0;
                                p3 = 0;
                                p4 = 0;
                            }else{
                                p1 = Math.round(this.state.answerStats[0] * 100 / this.state.answerCount);
                                p2 = Math.round(this.state.answerStats[1] * 100 / this.state.answerCount);
                                p3 = Math.round(this.state.answerStats[2] * 100 / this.state.answerCount);
                                p4 = Math.round(this.state.answerStats[3] * 100 / this.state.answerCount);
                            }
                            return (
                                <div>
                                    title: {this.props.game.hostingRoom.title}<br/>
                                    przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                    Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                    Liczba głosów na odpowiedź A: {this.state.answerStats[0]} {p1}%<br/>
                                    Liczba głosów na odpowiedź B: {this.state.answerStats[1]} {p2}%<br/>
                                    Liczba głosów na odpowiedź C: {this.state.answerStats[2]} {p3}%<br/>
                                    Liczba głosów na odpowiedź D: {this.state.answerStats[3]} {p4}%<br/>
                                    Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                    <this.ControlButtons/>
                                </div>
                            );
                        }else{
                            return (
                                <div>
                                    title: {this.props.game.hostingRoom.title}<br/>
                                    przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                    Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                    POBIERANIE STATYSTYK...<br/>
                                    Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                    <this.ControlButtons/>
                                </div>
                            );
                        }
                    case 3: //general rank
                        if(this.state.generalRanking) {
                            let rank = this.state.generalRanking;
                            rank.sort((a, b) => {
                                if(a.points < b.points) return 1;
                                if(a.points > b.points) return -1;
                                return 0;
                            });
                            return (
                                <div>
                                    title: {this.props.game.hostingRoom.title}<br/>
                                    przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                    Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                    Ranking generalny:<br/>
                                    {
                                        rank.map(item => {
                                            return <div key={item.nickname}>{item.nickname + ' - punktów ' + item.points}</div>;
                                        })
                                    }
                                    Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                    <this.ControlButtons/>
                                </div>
                            );
                        }else{
                            return (
                                <div>
                                    title: {this.props.game.hostingRoom.title}<br/>
                                    przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                    Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                    POBIERANIE RANKINGU GENERALNEGO...<br/>
                                    Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                    <this.ControlButtons/>
                                </div>
                            );
                        }
                    default:
                        return (
                            <div>
                                title: {this.props.game.hostingRoom.title}<br/>
                                przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/><br/>
                                Pytanie: {this.state.questions[this.state.questionIndex].question}<br/>
                                A: {this.state.questions[this.state.questionIndex].answers[0]}<br/>
                                B: {this.state.questions[this.state.questionIndex].answers[1]}<br/>
                                C: {this.state.questions[this.state.questionIndex].answers[2]}<br/>
                                D: {this.state.questions[this.state.questionIndex].answers[3]}<br/>
                                Liczba udzielonych odpowiedzi: {this.state.answerCount}<br/>
                                <this.ControlButtons/>
                            </div>
                        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Host)