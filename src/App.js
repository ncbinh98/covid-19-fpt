import React, { Component } from "react";

import "./App.css";
import CountryCovid from "./components/CountryCovid";
import GlobalCovid from "./components/GlobalCovid";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            globalHistory: {}
        };
    }

    callbackFunction = dataChild => {
        this.setState({
            globalHistory: dataChild
        });
    };

    render() {
        return (
            <div>
                <GlobalCovid globalHistory={this.state.globalHistory} />
                <CountryCovid getGlobalHistory={this.callbackFunction} />
            </div>
        );
    }
}

export default App;
