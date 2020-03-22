import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import {Button, Container, Col, Row} from "react-bootstrap";
import {client} from "../../connection/config";
import './WaitingForStart.css'

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import QRCode from 'qrcode.react'

class WaitingForStart extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Zamknij pokój"} closeRoomSignal {...this.props}>
                <div className={"message-box"}>
                    <Container>
                        <Row>
                            <Col md={8} sm={12}>
                                Wejdź na adres:<br/>
                                <div className={"code-block"}>{client}</div>
                                i wprowadź poniższy kod dostępu:<br/>
                                <div className={"code-block"}>{this.props.game.hostingRoom.roomCode}</div>
                                <div className={"hide-qr"}>lub zeskanuj kod QR znajdujący się obok</div>
                                <Button variant={"secondary"} onClick={() => {this.props.nextQuestion(0);}}
                                        className={"start-button"}>
                                    <PlayCircleOutlineIcon fontSize={"large"}/><br/>Uruchom quiz
                                </Button>
                            </Col>
                            <Col md={4} sm={12}>
                                <div className={"qr-code hide-qr"}>
                                    <QRCode value={client + "/#/?code=" + this.props.game.hostingRoom.roomCode}
                                            size={250}
                                            renderas={'svg'}
                                            includeMargin/>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </CenterBox>
        );
    }
}

export default WaitingForStart;