import React from 'react'
import CenterBox from "../../components/CenterBox";
import {Container, Row, Col, Button} from 'react-bootstrap'
import './Editor.css';
import QuestionExplorer from "../../components/QuestionExplorer";
import QuestionEditor from "../../components/QuestionEditor";

import testQuestion from '../../testQuestions';

import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import HelpIcon from '@material-ui/icons/Help';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workspace: [],
            selectedIndex: -1,
        }
    }

    componentDidMount() {
        this.setState({
            workspace: testQuestion,
            selectedIndex: 0
        })
    }

    changeSelecion = (index) => {
        this.setState({
            selectedIndex: index
        })
    };

    exitButton = () => {

    };

    topButtonsConfig = [
        {
            text: 'Wyjdź',
            icon: <CloseIcon/>,
            click: this.exitButton
        },
        {
            text: 'Wgraj',
            icon: <PublishIcon/>,
            click: this.exitButton
        },
        {
            text: 'Pobierz',
            icon: <GetAppIcon/>,
            click: this.exitButton
        },
        {
            text: 'Pomoc',
            icon: <HelpIcon/>,
            click: this.exitButton
        },
        {
            text: 'Przesuń w dół',
            icon: <ArrowDownwardIcon/>,
            click: this.exitButton
        },
        {
            text: 'Przesuń w górę',
            icon: <ArrowUpwardIcon/>,
            click: this.exitButton
        },
        {
            text: 'Dodaj tutaj',
            icon: <AddBoxIcon/>,
            click: this.exitButton
        },
        {
            text: 'Dodaj na końcu',
            icon: <AddBoxIcon/>,
            click: this.exitButton
        },
        {
            text: 'Usuń',
            icon: <DeleteForeverIcon/>,
            click: this.exitButton
        }
    ];

    updateQuestion = (data) => {
        if(this.state.selectedIndex >= 0) {
            let newData = this.state.workspace.slice();
            newData[this.state.selectedIndex] = data;
            this.setState({workspace: newData});
        }
    };

    render() {
        return(
            <CenterBox {...this.props}>
                <Container fluid className={"editor-container d-none d-sm-none d-md-block"}>
                    <Row style={{height: '100%'}}>
                        <Col xl={4} lg={4} md={4} sm={12}>
                            <QuestionExplorer questions={this.state.workspace}
                                              selectedIndex={this.state.selectedIndex}
                                              selected={this.changeSelecion}/>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={12}>
                            <div className={"question-editor"}>
                                <Container fluid>
                                    <Row noGutters>
                                        {
                                            this.topButtonsConfig.map(btn => {
                                                return(
                                                    <Col lg={4} md={6} key={btn.text}>
                                                        <Button variant={"secondary"}
                                                                className={"editor-button"}
                                                                onClick={btn.click}>
                                                            {btn.icon}
                                                            {(btn.icon ? ' ' : '') + btn.text}
                                                        </Button>
                                                    </Col>
                                                );
                                            })
                                        }
                                    </Row>
                                    <Row>
                                        <QuestionEditor question={this.state.selectedIndex < 0 ? null : this.state.workspace[this.state.selectedIndex]}
                                                        update={this.updateQuestion}/>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </CenterBox>
        );
    }
}

export default Editor