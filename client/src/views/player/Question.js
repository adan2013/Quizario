import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Container, Col, Row, Button} from 'react-bootstrap'
import {answerSelected} from "../../connection/config";
import './Question.css'

import answerA from '../../assets/answerA.svg';
import answerB from '../../assets/answerB.svg';
import answerC from '../../assets/answerC.svg';
import answerD from '../../assets/answerD.svg';

class Question extends Component {
    Keyboard = () => {
        return(
            <div>
                <Row noGutters className={"keyboard-pc"}>
                    <Col xs={3}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(0)}>
                            <img src={answerA} alt={"answer A"}/>
                        </Button>
                    </Col>
                    <Col xs={3}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(1)}>
                            <img src={answerB} alt={"answer B"}/>
                        </Button>
                    </Col>
                    <Col xs={3}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(2)}>
                            <img src={answerC} alt={"answer C"}/>
                        </Button>
                    </Col>
                    <Col xs={3}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(3)}>
                            <img src={answerD} alt={"answer D"}/>
                        </Button>
                    </Col>
                </Row>
                <Row noGutters className={"keyboard-mobile"}>
                    <Col xs={6}>
                        <div className={"keyboard-left-column"}>
                            <Button variant={"secondary"}
                                    className={"keyboard-button"}
                                    onClick={() => this.selectAnswer(0)}>
                                <img src={answerA} alt={"answer A"}/>
                            </Button>
                            <Button variant={"secondary"}
                                    className={"keyboard-button"}
                                    onClick={() => this.selectAnswer(2)}>
                                <img src={answerC} alt={"answer C"}/>
                            </Button>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(1)}>
                            <img src={answerB} alt={"answer B"}/>
                        </Button>
                        <Button variant={"secondary"}
                                className={"keyboard-button"}
                                onClick={() => this.selectAnswer(3)}>
                            <img src={answerD} alt={"answer D"}/>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    };

    selectAnswer = (number) => {
        if(this.props.question) {
            this.props.selected(number);
            this.props.socket.emit(answerSelected, this.props.game.roomCode, this.props.game.playerName, number);
            this.props.switchState('WAITING');
        }
    };

    render() {
        return (
            <CenterBox logo cancel={"Wyjdź"} {...this.props}>
                <div className={"message-box"}>
                    Odpowiedz na pytanie:<br/>
                    <Container fluid>
                        <this.Keyboard/>
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default Question;