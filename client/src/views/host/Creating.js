import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Row, Col, Form} from "react-bootstrap";
import {createNewRoom} from "../../connection/config";
import './Creating.css';
import TimePicker from "../../components/TimePicker";
import NumberPicker from "../../components/NumberPicker";
import LogicSwitch from "../../components/LogicSwitch";

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PublishIcon from '@material-ui/icons/Publish';
import {validateJson} from "../../utilities";

class Creating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            questions: [],
            timeLimit: 0,
            questionLimit: 0,
            randomOrder: false
        };
        this.inputFile = React.createRef();
    }

    shuffle = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    createRoom = () => {
        const data = {
            title: this.state.title,
            timeLimit: this.state.timeLimit,
            questionLimit: this.state.questionLimit,
            randomOrder: this.state.randomOrder
        };
        let q = this.state.questions.slice();
        if(this.state.randomOrder) this.shuffle(q);
        this.props.questionList(q);
        this.props.setHostingRoom(data);
        this.props.switchState('WAITING_FOR_CODE');
        this.props.socket.emit(createNewRoom, data);
    };

    uploadFile = () => {
        let fr = new FileReader();
        fr.onload = (e) => {
            let output = null;
            try {
                output = JSON.parse(e.target.result);
                if(validateJson(output)) {
                    this.setState({
                        questions: output
                    });
                }else{
                    this.setState({
                        questions: []
                    });
                    alert('Wykryto błędną strukturę pliku!');
                }
            }catch(error) {
                this.setState({
                    questions: []
                });
                alert('Wykryto błędną składnię pliku JSON!');
            }
            this.inputFile.current.value = "";
        };
        if(this.inputFile.current.files.item(0)) {
            fr.readAsText(this.inputFile.current.files.item(0));
        }
    };

    render() {
        return (
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <div className={"message-box"}>
                    <form>
                        <Container>
                            <Row>
                                <Col md={6} className={"vcenter"}>
                                    <div>
                                        <div className={"creating-label"}>Tytuł quizu:</div>
                                        <Form.Control type={"text"}
                                                      value={this.state.title}
                                                      className={"creating-textbox"}
                                                      onChange={(e) => this.setState({title: e.target.value.trim()})}
                                                      maxLength={"30"}/>
                                        <div className={"creating-label"}>Baza pytań:</div>
                                        <span className={"btn btn-secondary btn-file"}>
                                            <PublishIcon/> Wybierz plik z pytaniami
                                            <input type={"file"} accept={"application/json"} onChange={this.uploadFile} ref={this.inputFile}/>
                                        </span>
                                        <div className={"questions-info"}>
                                            {
                                                this.state.questions.length === 0
                                                ?
                                                    'Brak bazy pytań'
                                                    :
                                                    'Załadowano pytań: ' + this.state.questions.length
                                            }
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className={"vcenter"}>
                                    <div>
                                        <div className={"creating-label"}>Kolejność pytań:</div>
                                        <LogicSwitch value={this.state.randomOrder}
                                                     offText={"Zwykła"} onText={"Losowa"}
                                                     onChange={(e) => this.setState({randomOrder: e})}/>
                                        <div className={"creating-label"}>Limit czasu:</div>
                                        <TimePicker value={this.state.timeLimit}
                                                    min={0} max={300} zeroText={"Wył."}
                                                    onChange={(e) => this.setState({timeLimit: e})}/>
                                        <div className={"creating-label"}>Limit ilości pytań:</div>
                                        <NumberPicker value={this.state.questionLimit}
                                                      min={0} max={500} zeroText={"Wył."}
                                                      onChange={(e) => this.setState({questionLimit: e})}/>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Button type={"submit"}
                                variant={"secondary"}
                                onClick={this.createRoom}
                                disabled={this.state.title.trim() === '' || this.state.questions.length === 0}
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