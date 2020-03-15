import React from 'react'
import {setHostingRoomAC, switchStateAC} from "../../actions/game";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";
import {closeRoom, createNewRoom, roomCreated, server} from "../../connection/config";
import {Button, Form} from "react-bootstrap";

class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ''
        }
    }

    componentDidMount() {
        this.props.switchState('CREATING');

        this.socket = socketIOClient(server);

        this.socket.on(roomCreated, (code) => {
            this.props.setHostingRoom({...this.props.game.hostingRoom, roomCode: code});
            this.props.switchState('WAITING_FOR_START');
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    createRoom = () => {
        this.props.setHostingRoom({
            title: this.state.title
        });
        this.props.switchState('WAITING_FOR_CODE');
        this.socket.emit(createNewRoom, {
           title: this.state.title
        });
    };

    render() {
        switch(this.props.game.state) {
            case 'CREATING':
                return(
                    <div>
                        <form>
                            <Form.Control type={"text"}
                                          value={this.state.title}
                                          onChange={(e) => this.setState({title: e.target.value})}
                                          placeholder={"Tytuł quizu"}
                                          maxLength={"30"}/>
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