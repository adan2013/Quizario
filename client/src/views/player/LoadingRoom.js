import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

class LoadingRoom extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Anuluj"} {...this.props}>
                <div className={"message-box"}>
                    łączenie z pokojem...
                </div>
            </CenterBox>
        );
    }
}

export default LoadingRoom;