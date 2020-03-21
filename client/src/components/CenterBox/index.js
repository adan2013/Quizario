import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import './CenterBox.css'

import logo from '../../assets/logo.svg'
import CloseIcon from '@material-ui/icons/Close'

class CenterBox extends Component {
    render() {
        return (
            <div className={"outer"}>
                <div className="middle">
                    <div className={"inner"}>
                        {this.props.children}
                    </div>
                </div>
                {
                    this.props.cancel &&
                    <div className={"cancel-btn"}>
                        <Button variant={"secondary"} onClick={() => this.props.history.push('/')}>
                            <CloseIcon/> Anuluj
                        </Button>
                    </div>
                }
                {
                    this.props.logo &&
                    <div className={"watermark-logo"}>
                        <img src={logo} alt={"quizario watermark logo"}/>
                    </div>
                }
            </div>
        );
    }
}

export default CenterBox;