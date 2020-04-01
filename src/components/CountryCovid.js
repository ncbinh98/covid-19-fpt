import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Line } from "react-chartjs-2";
import "moment/locale/vi";
var _ = require("lodash");
class TestState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            sortCases: true,
            nations: [],
            sortNations: [],
            vnNews: [],
            nationsHistory: [],
            globalHistory: {}
        };
    }

    async componentDidMount() {
        moment.locale("vi");

        axios.get(`https://corona.lmao.ninja/countries?sort=country`).then(res => {
            let dataProcessed = res.data.map((nation, index) => {
                return {
                    ...nation,
                    rRecovered: (nation.recovered / nation.cases) * 100,
                    rDeath: (nation.deaths / nation.cases) * 100
                };
            });
            let sortArr = _.orderBy(dataProcessed, ["cases"], ["desc"]);
            this.setState({
                nations: sortArr,
                sortNations: sortArr
            });
        });

        axios.get(`https://corona.lmao.ninja/v2/historical`).then(res => {
            let today0 = moment().format("M/D/YY");
            let yesterday0 = moment(today)
                .subtract("1", "d")
                .format("M/D/YY");

            let globalCasesHistory = 0;
            let globalDeathsHistory = 0;
            let globalRecoveredHistory = 0;
            res.data.forEach(nation => {
                globalCasesHistory = globalCasesHistory + nation.timeline.cases[yesterday0];
                globalDeathsHistory = globalDeathsHistory + nation.timeline.deaths[yesterday0];
                globalRecoveredHistory = globalRecoveredHistory + nation.timeline.recovered[yesterday0];
            });
            this.setState({
                globalHistory: {
                    cases: globalCasesHistory,
                    deaths: globalDeathsHistory,
                    recovered: globalRecoveredHistory
                }
            });

            this.props.getGlobalHistory(this.state.globalHistory);
            this.setState({
                nationsHistory: res.data
            });
        });

        let keyApiKeys = [
            "d1f8b972b2df4c20a403080e17bb8267",
            "69acb943971641d1920c812056c61935",
            "52502ce7ffd243e1b587f5c1bf2eafa4",
            "6b9715b8148c4d769d1ad583681c69b1",
            "638bf1002c7141c9ba72545dc2a57b25",
            "358ee09870014252b7a9d88bd1971908"
        ];
        let today = moment().format("YYYY-MM-DD");
        let yesterday = moment(today)
            .subtract("1", "d")
            .format("YYYY-MM-DD");
        for (var i = 0; i < keyApiKeys.length; i++) {
            let res = await axios.get(
                "https://newsapi.org/v2/everything?q=covid&from=" +
                    yesterday +
                    "&to=" +
                    today +
                    "&domains=vnexpress.net&sortBy=publishedAt&apiKey=" +
                    keyApiKeys[i]
            );
            if (res.data.status === "ok" && res.data.totalResults > 0) {
                this.setState({
                    vnNews: res.data.articles
                });
                break;
            }
            // if (res.data.status === "ok" && res.data.totalResults === 0) {
            //     let yesterday = moment(today)
            //         .subtract("1", "d")
            //         .format("YYYY-MM-DD");
            //     res = await axios.get(
            //         "https://newsapi.org/v2/everything?q=covid&from=" +
            //             yesterday +
            //             "&domains=vnexpress.net&sortBy=publishedAt&apiKey=" +
            //             keyApiKeys[i]
            //     );
            //     if (res.data.status === "ok" && res.data.articles.length >= 0) {
            //         this.setState({
            //             vnNews: res.data.articles
            //         });
            //         break;
            //     }
            // }
        }
    }

    onSearch = e => {
        this.setState({
            searchTerm: e.target.value
        });
    };

    numberWithCommas = x => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    getNationHistory = name => {
        let result = this.state.nationsHistory.find(country => country.country === name && country.province === null);
        if (result) {
            var datasetsLabel = Object.keys(result.timeline);
            var labels = Object.keys(result.timeline.cases);

            labels = labels.splice(labels.length - 15);
            var dataCases = Object.values(result.timeline.cases);
            dataCases = dataCases.splice(dataCases.length - 15);
            var dataRecovered = Object.values(result.timeline.recovered);
            dataRecovered = dataRecovered.splice(dataRecovered.length - 15);
            var dataDeaths = Object.values(result.timeline.deaths);
            dataDeaths = dataDeaths.splice(dataDeaths.length - 15);
        }

        let data = {
            labels: labels,
            datasets: [
                {
                    label: "Ca nhiễm",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(191, 191, 191)",
                    borderColor: "rgba(255, 255, 255)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(255, 255, 255)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 255, 255)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataCases
                },
                {
                    label: "Phục hồi",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(191, 191, 191)",
                    borderColor: "rgba(0, 255, 0)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(0, 255, 0)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(0, 255, 0)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataRecovered
                },
                {
                    label: "Tử vong",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(191, 191, 191)",
                    borderColor: "rgba(255, 0, 0)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(255, 0, 0)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 0, 0)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataDeaths
                }
            ]
        };
        return data;
    };

    handleSortCases = e => {
        var sortArr = [];
        if (this.state.sortCases) {
            sortArr = _.orderBy(this.state.nations, ["cases"], ["asc"]);
        } else {
            sortArr = _.orderBy(this.state.nations, ["cases"], ["desc"]);
        }
        this.setState({
            sortCases: !this.state.sortCases,
            sortNations: sortArr
        });
    };

    handleSortRRecovered = e => {
        var sortArr = [];
        if (this.state.sortCases) {
            sortArr = _.orderBy(this.state.nations, ["recovered"], ["asc"]);
        } else {
            sortArr = _.orderBy(this.state.nations, ["recovered"], ["desc"]);
        }
        this.setState({
            sortCases: !this.state.sortCases,
            sortNations: sortArr
        });
    };

    handleTodayCases = e => {
        var sortArr = [];
        if (this.state.sortCases) {
            sortArr = _.orderBy(this.state.nations, ["todayCases"], ["asc"]);
        } else {
            sortArr = _.orderBy(this.state.nations, ["todayCases"], ["desc"]);
        }
        this.setState({
            sortCases: !this.state.sortCases,
            sortNations: sortArr
        });
    };

    handleSortDeaths = e => {
        var sortArr = [];
        if (this.state.sortCases) {
            sortArr = _.orderBy(this.state.nations, ["deaths"], ["asc"]);
        } else {
            sortArr = _.orderBy(this.state.nations, ["deaths"], ["desc"]);
        }
        this.setState({
            sortCases: !this.state.sortCases,
            sortNations: sortArr
        });
    };

    render() {
        let elementProducts = this.state.nations
            ? this.state.sortNations.map((nation, index) => {
                  if (nation.country.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
                      return (
                          <div className="col-xl-12" key={index} style={{ padding: 0 }}>
                              <div className="card mb-3">
                                  <div className="card-body">
                                      <h3 className="card-title">
                                          {nation.country}{" "}
                                          <img style={{ height: "20px", width: "25px" }} src={nation.countryInfo.flag}></img>
                                      </h3>
                                      <h6 className="card-subtitle mb-2 text-muted">
                                          Cập nhật lúc: {moment(nation.updated).format("lll")}
                                      </h6>
                                      <div className="row">
                                          <div className="col-xl-4 col-sm-4">
                                              <strong>Tổng số ca:</strong> {this.numberWithCommas(nation.cases)} (
                                              <span style={{ color: "#00ff00" }}>+{this.numberWithCommas(nation.todayCases)}</span>)
                                              <br />
                                              <strong style={{ color: "#ff0000" }}>Tử vong:</strong> {this.numberWithCommas(nation.deaths)}{" "}
                                              (<span style={{ color: "#00ff00" }}>+{this.numberWithCommas(nation.todayDeaths)}</span>)
                                              <br />
                                              <strong style={{ color: "#00ff00" }}>Đã phục hồi:</strong>{" "}
                                              {this.numberWithCommas(nation.recovered)}
                                              <br />
                                          </div>
                                          <div className="col-xl-4 col-sm-4">
                                              <strong style={{ color: "#ff9933" }}>Đang chữa trị:</strong>{" "}
                                              {this.numberWithCommas(nation.active)}
                                              <br />
                                              <strong style={{ color: "#cc00cc" }}>Ca nghiêm trọng:</strong>{" "}
                                              {this.numberWithCommas(nation.critical)}
                                              <br />
                                              <strong style={{ color: "#00ff00" }}>Tỷ lệ phục hồi:</strong>{" "}
                                              {((nation.recovered / nation.cases) * 100).toFixed(3)}%
                                              <br />
                                          </div>
                                          <div className="col-xl-4 col-sm-4">
                                              <strong style={{ color: "#ff9933" }}>Tỷ lệ ca nhiễm mới:</strong>{" "}
                                              {((nation.todayCases / nation.cases) * 100).toFixed(3)}%
                                              <br />
                                              <strong style={{ color: "#cc00cc" }}>Tỷ lệ tử vong: </strong>{" "}
                                              {((nation.deaths / nation.cases) * 100).toFixed(3)}%
                                          </div>
                                          <div className="col-xl-12 col-sm-12">
                                              <Line options={{ responsive: true }} data={this.getNationHistory(nation.country)} />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      );
                  } else {
                      return null;
                  }
              })
            : null;
        let elementsNews = this.state.vnNews.map((news, index) => {
            return (
                <div className="card mb-3" key={index}>
                    <img
                        className="card-img-top"
                        style={{ objectFit: "cover", height: "150px" }}
                        src={news.urlToImage}
                        alt="Card image cap"
                    />
                    <div className="card-body">
                        <a href={news.url}>
                            <h5 className="card-title">{news.title}</h5>
                        </a>

                        <h6 className="card-subtitle mb-2 text-muted">{news.description}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">*{moment(news.publishedAt).fromNow()}</h6>
                    </div>
                </div>
            );
        });
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8">
                            <div className="row">
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Tìm kiếm quốc gia"
                                        aria-label="Username"
                                        onChange={this.onSearch}
                                        aria-describedby="basic-addon1"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 col-sm-3">
                                    <button type="button" className="btn btn-secondary mr-2 mb-2" onClick={this.handleSortCases}>
                                        Sắp xếp theo <strong style={{}}>Tổng số ca:</strong>{" "}
                                        <i className={this.state.sortCases ? "fa fa-sort-desc" : "fa fa-sort-asc"} aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <button type="button" className="btn btn-secondary mr-2 mb-2" onClick={this.handleSortRRecovered}>
                                        Sắp xếp theo <strong style={{ color: "#00ff00" }}>ca phục hồi</strong>{" "}
                                        <i className={this.state.sortCases ? "fa fa-sort-desc" : "fa fa-sort-asc"} aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <button type="button" className="btn btn-secondary mr-2 mb-2" onClick={this.handleTodayCases}>
                                        Sắp xếp theo <strong style={{ color: "#3bede7" }}>ca nhiễm mới: </strong>{" "}
                                        <i className={this.state.sortCases ? "fa fa-sort-desc" : "fa fa-sort-asc"} aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <button type="button" className="btn btn-secondary mr-2 mb-2" onClick={this.handleSortDeaths}>
                                        Sắp xếp theo <strong style={{ color: "#ff0000" }}>ca tử vong:</strong>{" "}
                                        <i className={this.state.sortCases ? "fa fa-sort-desc" : "fa fa-sort-asc"} aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">{elementProducts}</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <h3 style={{}}>
                                <span className="badge badge-primary">
                                    Tin tức mới nhất <i className="fa fa-newspaper-o" aria-hidden="true"></i>
                                </span>
                            </h3>
                            {elementsNews}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TestState;
