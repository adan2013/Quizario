import React, {Component} from 'react';
import CenterBox from "../../components/CenterBox";

import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {returnLetter} from "../../utilities";

class Waiting extends Component {
    render() {
        if(this.props.selectedAnswer != null) {
            if(this.props.correctAnswer != null) {
                if(this.props.selectedAnswer === this.props.correctAnswer) {
                    return (
                        <CenterBox logo cancel={"Wyjdź"} roomHeader {...this.props}>
                            <InsertEmoticonIcon style={{fontSize: '72px'}}/>
                            <div className={"message-box"}>
                                Odpowiedź poprawna! Gratulacje!
                            </div>
                        </CenterBox>
                    );
                }else{
                    return (
                        <CenterBox logo cancel={"Wyjdź"} roomHeader {...this.props}>
                            <SentimentVeryDissatisfiedIcon style={{fontSize: '72px'}}/>
                            <div className={"message-box"}>
                                Odpowiedź błędna<br/><br/>
                                Poprawną odpowiedzią było: {returnLetter(this.props.correctAnswer)}
                            </div>
                        </CenterBox>
                    );
                }
            }else{
                return (
                    <CenterBox logo cancel={"Wyjdź"} roomHeader {...this.props}>
                        <QueryBuilderIcon style={{fontSize: '72px'}}/>
                        <div className={"message-box"}>
                            Wybrano odpowiedź {returnLetter(this.props.selectedAnswer)}<br/><br/>
                            Oczekuj na zakończenie odpowiadania...
                        </div>
                    </CenterBox>
                );
            }
        }else{
            return (
                <CenterBox logo cancel={"Wyjdź"} roomHeader {...this.props}>
                    <CheckCircleOutlineIcon style={{fontSize: '72px'}}/>
                    <div className={"message-box"}>
                        Połączono z pokojem<br/>
                        {this.props.game.hostingRoom.title}<br/><br/>
                        Obserwuj komunikaty na ekranie hosta...
                    </div>
                </CenterBox>
            );
        }
    }
}

export default Waiting;