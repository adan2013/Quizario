import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Row, Col, Form} from "react-bootstrap";
import testQuestions from "../../testQuestions";
import {createNewRoom} from "../../connection/config";
import './Creating.css';
import TimePicker from "../../components/TimePicker";
import NumberPicker from "../../components/NumberPicker";
import LogicSwitch from "../../components/LogicSwitch";

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

class Creating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            timeLimit: 0,
            questionLimit: 0,
            randomOrder: false
        }
    }

    createRoom = () => {
        const data = {
            title: this.state.title,
            timeLimit: this.state.timeLimit,
            questionLimit: this.state.questionLimit,
            randomOrder: this.state.randomOrder
        };
        let q = testQuestions;
        if(this.state.randomOrder) this.shuffle(q);
        this.setState({
            questions: q
        });
        this.props.setHostingRoom(data);
        this.props.switchState('WAITING_FOR_CODE');
        this.props.socket.emit(createNewRoom, data);
    };

    render() {
        return (
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <div className={"message-box"}>
                    <form>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <div className={"creating-label"}>Tytuł quizu:</div>
                                    <Form.Control type={"text"}
                                                  value={this.state.title}
                                                  className={"creating-textbox"}
                                                  onChange={(e) => this.setState({title: e.target.value.trim()})}
                                                  maxLength={"30"}/>
                                    <div className={"creating-label"}>Kolejność pytań:</div>
                                    <LogicSwitch value={this.state.randomOrder}
                                                 offText={"Zwykła"} onText={"Losowa"}
                                                 onChange={(e) => this.setState({randomOrder: e})}/>
                                </Col>
                                <Col md={6}>
                                    <div className={"creating-label"}>Limit czasu:</div>
                                    <TimePicker value={this.state.timeLimit}
                                                  min={0} max={300} zeroText={"Wył."}
                                                  onChange={(e) => this.setState({timeLimit: e})}/>
                                    <div className={"creating-label"}>Limit ilości pytań:</div>
                                    <NumberPicker value={this.state.questionLimit}
                                                  min={0} max={500} zeroText={"Wył."}
                                                  onChange={(e) => this.setState({questionLimit: e})}/>
                                </Col>
                            </Row>
                        </Container>
                        <Button type={"submit"}
                                variant={"secondary"}
                                onClick={this.createRoom}
                                disabled={this.state.title.trim() === ''}
                                className={"creating-button"}>
                            <PlayCircleOutlineIcon/><br/>
                            Utwórz pokój
                        </Button>
                    </form>
                </div>
            </CenterBox>
        );
    }
}

export default Creating;