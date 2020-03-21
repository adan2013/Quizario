import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

import WarningIcon from '@material-ui/icons/Warning';

class NicknameIsBusy extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <WarningIcon style={{fontSize: '72px'}}/>
                <div className={"message-box"}>
                    Nick "{this.props.game.playerName}" jest już zajęty - wybierz inny!
                </div>
            </CenterBox>
        );
    }
}

export default NicknameIsBusy;