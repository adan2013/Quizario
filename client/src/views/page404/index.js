import React from 'react'
import CenterBox from "../../components/CenterBox";

class Page404 extends React.Component {
    render() {
        return(
            <CenterBox logo cancel={"Powrót"} {...this.props}>
                <div className={"message-box"}>
                    <div style={{fontSize: '4em'}}>404</div>
                    Podana strona nie została znaleziona
                </div>
            </CenterBox>
        );
    }
}

export default Page404