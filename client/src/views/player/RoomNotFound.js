import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

import WarningIcon from '@material-ui/icons/Warning';

class RoomNotFound extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <WarningIcon style={{fontSize: '72px'}}/>
                <div className={"message-box"}>
                    Pokój o numerze {this.props.game.roomCode} nie został znaleziony!
                </div>
            </CenterBox>
        );
    }
}

export default RoomNotFound;