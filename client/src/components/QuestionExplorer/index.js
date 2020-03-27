import React, {Component} from 'react';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './QuestionExplorer.css';

class QuestionExplorer extends Component {

    render() {
        let no = 0;
        return (
            <div className={"question-explorer"}>
                <Container fluid>
                    <Row>
                        <div className={"question-explorer-list"}>
                            {
                                this.props.questions.map(item => {
                                    const itemNo = no++;
                                    return(
                                        <div className={"question-explorer-list-item" + (this.props.selectedIndex === itemNo ? ' item-selected' : '')} key={itemNo} onClick={ () => {
                                            this.props.selected(itemNo)
                                        }}>
                                            {(itemNo + 1) + '. ' + item.question}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default QuestionExplorer;