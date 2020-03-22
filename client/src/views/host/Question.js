import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Col, Row, ButtonGroup} from "react-bootstrap";
import './Question.css'
import {
    answerStatsRequest,
    closeQuestion,
    closeRoom,
    generalRankingRequest,
    newQuestion
} from "../../connection/config";

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ViewListIcon from '@material-ui/icons/ViewList';
import PanToolIcon from '@material-ui/icons/PanTool';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        }
    }

    QuestionGrid = () => {
        return(
            <div>
                <Row noGutters>
                    <Col md={{span: 4, order: 1}} sm={{span: 6, order: 2}} xs={{span: 6, order: 2}}>
                        <div className={"question-counter"}>
                            Pytanie: {this.props.questionIndex+1}/{this.props.lastIndexNumber}
                        </div>
                    </Col>
                    <Col md={{span: 4, order: 2}} sm={{span: 12, order: 1}} xs={{span: 12, order: 1}}>
                        <div className={"question-timer"}>0:00</div>
                    </Col>
                    <Col md={{span: 4, order: 3}} sm={{span: 6, order: 3}} xs={{span: 6, order: 3}}>
                        <div className={"question-answers-counter"}>
                            Odpowiedziało: {this.props.answerCount}
                        </div>
                    </Col>
                </Row>
                <Row noGutters>
                    <Col xs={12}>
                        <div className={"question-question"}>{this.props.question.question}</div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer"}>
                            <div className={"question-answer-letter"}>A</div>
                            {this.props.question.answers[0]}
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer"}>
                            <div className={"question-answer-letter"}>B</div>
                            {this.props.question.answers[1]}
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer"}>
                            <div className={"question-answer-letter"}>C</div>
                            {this.props.question.answers[2]}
                        </div>
                    </Col>
                    <Col md={6} sm={12}>
                        <div className={"question-answer"}>
                            <div className={"question-answer-letter"}>D</div>
                            {this.props.question.answers[3]}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    ControlButtons = () => {
        return(
            <div className={"question-control-buttons"}>
                <ButtonGroup>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen} onClick={() => {
                        this.props.changeTab(1)
                    }}>
                        <CheckBoxIcon fontSize={"large"}/><br/>Poprawna
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen} onClick={() => {
                        this.props.changeTab(1);
                        this.props.socket.emit(answerStatsRequest, this.props.game.hostingRoom.roomCode);
                    }}>
                        <AssessmentIcon fontSize={"large"}/><br/>Statystyki
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.questionIsOpen} onClick={() => {
                        this.props.changeTab(1);
                        this.props.socket.emit(generalRankingRequest, this.props.game.hostingRoom.roomCode);
                    }}>
                        <ViewListIcon fontSize={"large"}/><br/>Ranking
                    </Button>
                    <Button variant={"secondary"} disabled={this.props.isLastQuestion && !this.props.questionIsOpen} onClick={this.props.nextButton}>
                        {this.props.questionIsOpen ? <PanToolIcon fontSize={"large"}/> : <ArrowForwardIcon/>}
                        <br/>
                        {this.props.questionIsOpen ? 'Stop' : 'Następne'}
                    </Button>
                </ButtonGroup>
            </div>
        );
    };

    render() {
        return (
            <CenterBox logo cancel={"Zakończ quiz"} closeRoomSignal roomHeader {...this.props}>
                <div className={"message-box"}>
                    <Container fluid>
                        <this.QuestionGrid/>
                    </Container>
                </div>
                <div className={"question-control-offset"}/>
                <this.ControlButtons/>
            </CenterBox>
        );


        /*switch (this.state.questionTab) {
            case 1: //correct answer
                return (
                    <div>
                        licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
                            licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
                            licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
                    let rank = this.state.generalRanking.slice();
                    rank.sort((a, b) => {
                        if(a.points < b.points) return 1;
                        if(a.points > b.points) return -1;
                        return 0;
                    });
                    return (
                        <div>
                            licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
                            licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
                        licznik: {this.state.questionIndex + 1}/{this.lastIndexNumber()}<br/>
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
        }*/








    }
}

export default Question;