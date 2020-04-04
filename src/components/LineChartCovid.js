import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
class LineChartCovid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openChart: false
        };
    }

    handleOpenChartBtn = e => {
        this.setState({
            openChart: !this.state.openChart
        });
    };

    render() {
        return (
            <div className="col-xl-12 col-sm-12">
                {this.state.openChart ? (
                    <div>
                        <button onClick={this.handleOpenChartBtn} type="button" className="btn btn-outline-danger btn-sm">
                            Đóng biểu đồ
                        </button>
                        <Line options={{ responsive: true }} data={this.props.countryData} />
                    </div>
                ) : (
                    <button onClick={this.handleOpenChartBtn} type="button" className="btn btn-outline-info btn-sm">
                        Mở biểu đồ
                    </button>
                )}
            </div>
        );
    }
}

export default LineChartCovid;
