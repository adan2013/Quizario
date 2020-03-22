import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Container, Row, Col, Button} from 'react-bootstrap';
import LogicSwitch from "../LogicSwitch";
import './RankTable.css';

class RankTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            byPoints: true
        }
    }

    sortByPoints = (a, b) => {
        if(a.points < b.points) return 1;
        if(a.points > b.points) return -1;
        return 0;
    };

    sortAlphabetically = (a, b) => {
        const nameA = a.nickname.toUpperCase();
        const nameB = b.nickname.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    };

    TableContent = () => {
        let data = this.props.data.slice();
        data.sort(this.state.byPoints ? this.sortByPoints : this.sortAlphabetically);
        let no = 1;
        return data.map(item => {
            return(
                <tr key={item.nickname}>
                    <td>{no++}</td>
                    <td>{item.nickname}</td>
                    <td>{item.points}</td>
                </tr>
            );
        });
    };

    render() {
        if(this.props.data) {
            return (
                <div className={"rank-table"}>
                    {
                        this.props.showHeader &&
                        <Container fluid style={{marginBottom: '20px'}}>
                            <Row noGutters>
                                <Col xs={6}>
                                    <LogicSwitch value={this.state.byPoints}
                                                 offText={"Alfabetycznie"} onText={"Punkty malejąco"}
                                                 onChange={(val) => this.setState({byPoints: val})}/>
                                </Col>
                                <Col xs={6}>
                                    <Button variant={"secondary"}>
                                        Exportuj do pliku CSV
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    }
                    <Table striped bordered>
                        <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Nick</th>
                            <th>Ilość punktów</th>
                        </tr>
                        </thead>
                        <tbody>
                        <this.TableContent/>
                        </tbody>
                    </Table>
                </div>
            );
        }else{
            return (
                <span/>
            );
        }
    }
}

export default RankTable;