import React from 'react'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";
import {
    server,
    createNewRoom,
    closeRoom,
    roomCreated,
    userCountUpdate,
    newQuestion,
    closeQuestion,
    answerCountUpdate,
    answerStatsRequest,
    answerStatsResponse,
    generalRankingRequest,
    generalRankingResponse,
    gameCompleted
} from "../../connection/config";
import {Button} from "react-bootstrap";
import Creating from "./Creating";
import WaitingForCode from "./WaitingForCode";
import WaitingForStart from "./WaitingForStart";


import testQuestions from '../../testQuestions'
import Question from "./Question";

class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connectedUsers: 0, //TODO connected users in waiting for start
            answerCount: 0,
            questions: [],
            questionIndex: 0,
            questionIsOpen: true,
            questionTab: 0,
            answerStats: null,
            generalRanking: null
        }
    }

    componentDidMount() {
        this.socket = socketIOClient(server);

        const data = {
            title: 'quiz testowy',
            timeLimit: 0,
            questionLimit: 0,
            randomOrder: false
        };
        this.props.setHostingRoom(data); //TODO temp
        this.setState({questions: testQuestions});
        this.socket.emit(createNewRoom, data); //TODO temp
        this.props.switchState('WAITING_FOR_CODE'); //CREATING TODO temp



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

        this.socket.on(gameCompleted, (stats) => {
            this.setState({generalRanking: stats});
            this.props.switchState('FINAL');
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    nextButton = () => {
        if(this.state.questionIsOpen) {
            this.setState({questionIsOpen: false});
            this.socket.emit(closeQuestion, this.props.game.hostingRoom.roomCode, this.state.questions[this.state.questionIndex]);
        }else{
            this.nextQuestion(this.state.questionIndex + 1);
        }
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

    isLastQuestion = () => {
        return this.state.questionIndex + 1 === this.lastIndexNumber();
    };

    lastIndexNumber = () => {
        if(this.props.game.hostingRoom.questionLimit === 0) {
            return this.state.questions.length;
        }else{
            return Math.min(this.props.game.hostingRoom.questionLimit, this.state.questions.length);
        }
    };

    changeTab = (tab) => {
        switch (tab) {
            case 1:
                this.setState({
                   questionTab: 1
                });
                break;
            case 2:
                this.setState({
                    questionTab: 2,
                    answerStats: null
                });
                break;
            case 3:
                this.setState({
                    questionTab: 3,
                    generalRanking: null
                });
                break;
        }
    };

    render() {
        switch(this.props.game.state) {
            case 'CREATING':
                return(<Creating {...this.props}
                                 socket={this.socket}
                                 questionList={(q) => this.setState({questions: q})}/>);
            case 'WAITING_FOR_CODE':
                return(<WaitingForCode {...this.props}/>);
            case 'WAITING_FOR_START':
                return(<WaitingForStart {...this.props}
                                        socket={this.socket}
                                        nextQuestion={(i) => this.nextQuestion(i)}/>);
            case 'QUESTION':
                return(<Question {...this.props}
                                 socket={this.socket}
                                 answerCount={this.state.answerCount}
                                 questionIndex={this.state.questionIndex}
                                 lastIndexNumber={this.lastIndexNumber()}
                                 question={this.state.questions[this.state.questionIndex]}
                                 questionIsOpen={this.state.questionIsOpen}
                                 questionTab={this.state.questionTab}
                                 changeTab={this.changeTab}
                                 nextButton={this.nextButton}/>);
            case 'FINAL':
                let rank = this.state.generalRanking.slice();
                let alpha = this.state.generalRanking.slice();
                rank.sort((a, b) => {
                    if(a.points < b.points) return 1;
                    if(a.points > b.points) return -1;
                    return 0;
                });
                alpha.sort((a, b) => {
                    const nameA = a.nickname.toUpperCase();
                    const nameB = b.nickname.toUpperCase();
                    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                });
                return (
                    <div>
                        title: {this.props.game.hostingRoom.title}<br/>
                        przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}
                        <br/><br/>
                        Ranking generalny:<br/>
                        {
                            rank.map(item => {
                                return <div key={item.nickname}>{item.nickname + ' - punktów ' + item.points}</div>;
                            })
                        }
                        <br/><br/>
                        Alfabetyczna lista graczy:<br/>
                        {
                            alpha.map(item => {
                                return <div key={item.nickname}>{item.nickname + ' - punktów ' + item.points}</div>;
                            })
                        }
                        <br/><br/>
                        <Button variant={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
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