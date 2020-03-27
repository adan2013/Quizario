import React, {Component} from 'react';
import {Container, Row, Form, InputGroup, Button} from 'react-bootstrap';
import './QuestionEditor.css';

import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {returnLetter} from "../../utilities";

class QuestionEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            correct: 0,
            answers: ['', '', '', '']
        }
    }

    updateAnswer = (index, value) => {
        let newData = this.state.answers.slice();
        newData[index] = value;
        this.setState({answers: newData});
    };

    AnswerBox = ({answer}) => {
        return(
            <Row>
                <div className={"question-editor-container-label"}>Odpowiedź {returnLetter(answer)}:</div>
                <InputGroup>
                    <Form.Control type={"text"}
                                  value={this.state.answers[answer]}
                                  className={"editor-textbox" + (answer === this.state.correct ? ' editor-textbox-correct' : '')}
                                  onChange={(e) => this.updateAnswer(answer, e.target.value)}
                                  maxLength={"120"}/>
                    <Button variant={"secondary"}
                            className={"correct-answer-button"}
                            disabled={answer === this.state.correct}
                            onClick={() => this.setState({correct: answer})}>
                        <CheckBoxIcon/>
                    </Button>
                </InputGroup>
            </Row>
        )
    };

    render() {
        if(this.props.question) {
            return (
                <Container fluid className={"question-editor-container"}>
                    <Row>
                        <div className={"question-editor-container-label"}>Treść pytania:</div>
                        <Form.Control as={"textarea"}
                                      value={this.state.question}
                                      className={"editor-textarea"}
                                      onChange={(e) => this.setState({question: e.target.value})}
                                      maxLength={"120"}/>
                    </Row>
                    <this.AnswerBox answer={0}/>
                    <this.AnswerBox answer={1}/>
                    <this.AnswerBox answer={2}/>
                    <this.AnswerBox answer={3}/>
                </Container>
            );
        }else{
            return (
                <div style={{margin: '80px auto 0 auto'}}>
                    Wybierz pytanie z listy po lewej
                </div>
            );
        }
    }
}

export default QuestionEditor;