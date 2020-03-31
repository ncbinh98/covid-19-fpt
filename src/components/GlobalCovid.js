import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
class GlobalCovid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakPoint: "",
            global: {},
            ytdGlobal: {}
        };
    }

    numberWithCommas = x => {
        if (x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    async componentDidMount() {
        axios.get(`https://corona.lmao.ninja/all`).then(res => {
            this.setState({
                global: res.data
            });
        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 col-lg-4 mt-3">
                            <div className="card border-secondary mb-3">
                                <div style={{ backgroundColor: "#003cb3", borderRadius: "4px" }} className="card-body">
                                    <h4 className="card-title">Tổng số ca nhiễm toàn cầu</h4>
                                    <p style={{ fontSize: "30px", fontWeight: 700 }} className="card-text">
                                        {this.numberWithCommas(this.state.global.cases)}{" "}
                                        <span style={{ fontSize: "16px", textShadow: "0 0 2px #0c0d0c", color: "#dbaa5a " }}>
                                            (+
                                            {this.numberWithCommas(this.state.global.cases - this.props.globalHistory.cases)})*
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mt-3">
                            <div className="card border-secondary mb-3">
                                <div style={{ backgroundColor: "#ff3333", borderRadius: "4px" }} className="card-body">
                                    <h4 className="card-title">Tổng số ca tử vong toàn cầu</h4>
                                    <p style={{ fontSize: "30px", fontWeight: 700 }} className="card-text">
                                        {this.numberWithCommas(this.state.global.deaths)}{" "}
                                        <span style={{ fontSize: "16px", textShadow: "0 0 2px #0c0d0c", color: "#8ae378 " }}>
                                            (+
                                            {this.numberWithCommas(this.state.global.deaths - this.props.globalHistory.deaths)})*
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mt-3">
                            <div className="card border-secondary mb-3">
                                <div style={{ backgroundColor: "#00cc44", borderRadius: "4px" }} className="card-body">
                                    <h4 className="card-title">Tổng số ca hồi phục toàn cầu</h4>
                                    <p style={{ fontSize: "30px", fontWeight: 700 }} className="card-text">
                                        {this.numberWithCommas(this.state.global.recovered)}{" "}
                                        <span style={{ fontSize: "16px", color: "#d9200f" }}>
                                            (+
                                            {this.numberWithCommas(this.state.global.recovered - this.props.globalHistory.recovered)})*
                                        </span>
                                    </p>{" "}
                                </div>
                            </div>
                        </div>
                        <span className="ml-3" style={{ fontSize: "12px", color: "#9d9d9e" }}>
                            *số lượng tăng trong một ngày | cập nhật lúc {moment(this.state.global.updated).format("lll")} theo thời gian và
                            số liệu của WHO
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default GlobalCovid;
