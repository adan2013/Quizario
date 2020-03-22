import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";
import RankTable from "../../components/RankTable";

class Final extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <div className={"message-box"}>
                    <div style={{marginBottom: '20px'}}>Wyniki quizu "{this.props.game.hostingRoom.title}":</div>
                    <RankTable data={this.props.generalRanking} showHeader/>
                </div>
            </CenterBox>
        );
    }
}

export default Final;