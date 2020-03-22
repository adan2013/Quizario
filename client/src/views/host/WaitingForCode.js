import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

class WaitingForCode extends Component {
    render() {
        return (
            <CenterBox logo cancel={"Anuluj"} {...this.props}>
                <div className={"message-box"}>
                    łączenie z serwerem...
                </div>
            </CenterBox>
        );
    }
}

export default WaitingForCode;