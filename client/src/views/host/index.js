import React from 'react'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";
import {closeRoom, createNewRoom, roomCreated, userCountUpdate, server} from "../../connection/config";
import {Button, Form} from "react-bootstrap";

class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            timeLimit: '0',
            questionLimit: '0',
            randomOrder: false,
            connectedUsers: 0
        }
    }

    componentDidMount() {
        this.props.switchState('CREATING');

        this.socket = socketIOClient(server);

        this.socket.on(roomCreated, (code) => {
            this.props.setHostingRoom({...this.props.game.hostingRoom, roomCode: code});
            this.props.switchState('WAITING_FOR_START');
        });

        this.socket.on(userCountUpdate, (count) => {
            this.setState({connectedUsers: count})
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    createRoom = () => {
        const data = {
            title: this.state.title,
            timeLimit: this.state.timeLimit,
            questionLimit: this.state.questionLimit,
            randomOrder: this.state.randomOrder
        };
        this.props.setHostingRoom(data);
        this.props.switchState('WAITING_FOR_CODE');
        this.socket.emit(createNewRoom, data);
    };

    render() {
        switch(this.props.game.state) {
            case 'CREATING':
                return(
                    <div>
                        <form>
                            <div>Tytuł quizu:</div>
                            <Form.Control type={"text"}
                                          value={this.state.title}
                                          onChange={(e) => this.setState({title: e.target.value})}
                                          maxLength={"30"}/>
                            <div>Limit czasu: (0-wyłączone)</div>
                            <Form.Control type={"text"}
                                          value={this.state.timeLimit}
                                          onChange={(e) => this.setState({timeLimit: e.target.value})}
                                          maxLength={"3"}/>
                            <div>Limit ilości pytań: (0-wyłączone)</div>
                            <Form.Control type={"text"}
                                          value={this.state.questionLimit}
                                          onChange={(e) => this.setState({questionLimit: e.target.value})}
                                          maxLength={"3"}/>
                            <div>Losowa kolejność:</div>
                            <Form.Control type={"checkbox"}
                                          checked={this.state.randomOrder}
                                          onChange={(e) => this.setState({randomOrder: e.target.checked})}
                                          maxLength={"3"}/>
                            <Button type={"submit"} color={"primary"} onClick={this.createRoom} disabled={this.state.title === ''}>
                                Utwórz pokój
                            </Button>
                            <Button color={"primary"} onClick={() => this.props.history.push('/')}>Powrót do menu</Button>
                        </form>
                    </div>
                );
            case 'WAITING_FOR_CODE':
                return(
                    <div>
                        title: {this.props.game.title}<br/>
                        Oczekiwanie na wygenerowanie kodu...<br/>
                        <Button color={"primary"} onClick={() => this.props.history.push('/')}>Anuluj</Button>
                    </div>
                );
            case 'WAITING_FOR_START':
                return(
                    <div>
                        title: {this.props.game.hostingRoom.title}<br/>
                        przydzielony kod dostępu: {this.props.game.hostingRoom.roomCode}<br/>
                        Ilość podłączonych graczy: {this.state.connectedUsers}<br/>
                        Pokój utworzony. Oczekiwanie na graczy...<br/>
                        <Button color={"primary"} onClick={() => {
                            this.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                            this.props.history.push('/')
                        }}>Anuluj grę</Button>
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