import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

class Final extends Component {
    render() {
        if(!this.props.stats) return(<span/>);
        let stats = this.props.stats.slice();
        stats.sort((a, b) => {
            if(a.points < b.points) return 1;
            if(a.points > b.points) return -1;
            return 0;
        });
        let place = stats.findIndex(item => {
            return item.nickname === this.props.game.playerName;
        });
        if(place > -1) {
            let totalPoints = stats[place].points;
            place++; // 0 > 1, 1 > 2 etc.
            return (
                <CenterBox logo cancel={"Powrót"} roomHeader {...this.props}>
                    <AssignmentTurnedInIcon style={{fontSize: '4.5em'}}/>
                    <div className={"message-box"}>
                        Quiz zakończony!<br/><br/>
                        Zdobyto punktów:<br/>
                        {totalPoints}<br/>
                        <br/>
                        Zajęto miejsce nr:<br/>
                        {place}
                    </div>
                </CenterBox>
            );
        }else{
            return(<span/>);
        }
    }
}

export default Final;