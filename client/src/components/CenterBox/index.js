import React, {Component} from 'react';
import './CenterBox.css'

class CenterBox extends Component {
    render() {
        return (
            <div className={"outer"}>
                <div className="middle">
                    <div className={"inner"}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default CenterBox;