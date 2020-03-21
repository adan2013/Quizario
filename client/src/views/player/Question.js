import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Container, Col, Row, Button} from 'react-bootstrap'
import {answerSelected} from "../../connection/config";

class Question extends Component {
    leftColumn = {
        float: 'right'
    };

    keyboardStyle = {
        display: 'block',
        margin: '20px 10px',
        height: '35vw',
        width: '35vw',
        fontSize: '20vw',
        backgroundColor: 'rgba(108, 117, 125, .65)'
    };

    Keyboard = () => {
        return(
            <Row noGutters>
                <Col sm={6} xs={6}>
                    <div style={this.leftColumn}>
                        <Button variant={"secondary"}
                                style={this.keyboardStyle}
                                onClick={() => this.selectAnswer(0)}>
                            A
                        </Button>
                        <Button variant={"secondary"}
                                style={this.keyboardStyle}
                                onClick={() => this.selectAnswer(2)}>
                            C
                        </Button>
                    </div>
                </Col>
                <Col sm={6} xs={6}>
                    <Button variant={"secondary"}
                            style={this.keyboardStyle}
                            onClick={() => this.selectAnswer(1)}>
                        B
                    </Button>
                    <Button variant={"secondary"}
                            style={this.keyboardStyle}
                            onClick={() => this.selectAnswer(3)}>
                        D
                    </Button>
                </Col>
            </Row>
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
                    Odpowiedz na pytanie:
                    <Container fluid>
                        <this.Keyboard/>
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default Question;