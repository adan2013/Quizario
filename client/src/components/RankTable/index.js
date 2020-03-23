import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Container, Row, Col, Button} from 'react-bootstrap';
import LogicSwitch from "../LogicSwitch";
import Downloader from 'react-file-download'
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

    render() {
        if(this.props.data) {
            let csv = [["Lp.", "Nick gracza", "Ilość punktów"]];
            let data = this.props.data.slice();
            let no = 1;
            data.sort(this.state.byPoints ? this.sortByPoints : this.sortAlphabetically);
            data.forEach(item => {
                csv.push([no++, item.nickname, item.points]);
            });
            const csvFile = csv.map(e => e.join(",")).join("\n");
            no = 1;

            return (
                <div className={"rank-table"}>
                    {
                        this.props.showHeader &&
                        <Container fluid style={{marginBottom: '20px'}}>
                            <Row noGutters>
                                <Col xs={6}>
                                    <LogicSwitch value={this.state.byPoints}
                                                 offText={"Alfabetycznie"} onText={"Punkty malejąco"}
                                                 onChange={(val) => {this.setState({byPoints: val})}}/>
                                </Col>
                                <Col xs={6}>
                                    <Button variant={"secondary"} onClick={() => {
                                        Downloader(csvFile, 'quiz.csv');
                                    }}>
                                        Export do pliku CSV
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    }
                    <Table striped bordered>
                        <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Nick gracza</th>
                            <th>Ilość punktów</th>
                        </tr>
                        </thead>
                        <tbody>
                            {data.map(item => {
                                return(
                                    <tr>
                                        <td>{no++}</td>
                                        <td>{item.nickname}</td>
                                        <td>{item.points}</td>
                                    </tr>
                                );
                            })}
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