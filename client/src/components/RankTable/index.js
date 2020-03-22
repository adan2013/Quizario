import React, {Component} from 'react';
import {Table} from 'react-bootstrap'
import './RankTable.css'

class RankTable extends Component {
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
        data.sort(this.props.byPoints ? this.sortByPoints : this.sortAlphabetically);
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