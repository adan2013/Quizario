import React from 'react'
import {connect} from 'react-redux'
import {switchStateAC, setPlayerConfigAC} from '../../actions/game'
import {Button, Form} from 'react-bootstrap'
import './main.css'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: '',
            playerName: ''
        };
    }

    componentDidMount() {
        this.props.setPlayerConfig('', '');
    }

    startGame = () => {
        if(this.state.roomCode !== '') {
            this.props.setPlayerConfig(this.state.roomCode, this.state.playerName);
            this.props.history.push('/player');
        }
    };

    render() {
        return(
            <div>
                <Button color={"primary"} onClick={() => this.props.history.push('/host')}>
                    Stwórz nową grę
                </Button>
                <Button color={"primary"} onClick={() => this.props.history.push('/editor')}>
                    Edytor pytań
                </Button>
                <form>
                    <Form.Control type={"text"}
                                  value={this.state.playerName}
                                  onChange={(e) => this.setState({playerName: e.target.value})}
                                  placeholder={"Nick gracza"}
                                  maxLength={"15"}/>
                    <Form.Control type={"text"}
                                  value={this.state.roomCode}
                                  onChange={(e) => this.setState({roomCode: e.target.value})}
                                  placeholder={"Kod dostępu"}
                                  maxLength={"6"}/>
                    <Button type={"submit"} color={"primary"} onClick={this.startGame} disabled={this.state.roomCode.length !== 6}>
                        Dołącz do gry
                    </Button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
};

const mapDispatchToProps = dispatch => ({
    switchState: (...args) => dispatch(switchStateAC(...args)),
    setPlayerConfig: (...args) => dispatch(setPlayerConfigAC(...args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main)