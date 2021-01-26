import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Layout from "./layout"
import Station from "../pages/stations/station";
import StationsComparison from "../pages/stations/stationsComparison/StationsComparison";
import Stations from "../pages/stations";

function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    <Switch>
                        <Route exact path='/' component={Stations} />
                        <Route exact path='/stations' component={Stations} />
                        <Route exact path='/station/:id' component={Station} />
                        <Route exact path='/stations/comparison/:id1/:id2' component={StationsComparison} />
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )

}

export default Routes;