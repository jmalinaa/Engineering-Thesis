import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "../pages/mainPage";
import Layout from "./layout"
import Station from "../pages/stations/station";
import StationComparison from "../pages/stations/stationsComparison/StationComparison";
import Stations from "../pages/stations";

function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    <Switch>
                        <Route exact path='/' component={MainPage} />
                        <Route exact path='/stations' component={Stations} />
                        <Route exact path='/station/:id' component={Station} />
                        <Route exact path='/stations/comparison/:id1/:id2' component={StationComparison} />
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )

}

export default Routes;