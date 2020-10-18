import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Stations from "../pages/stations"
import MainPage from "../pages/mainPage";
import Layout from "./layout"

function Routes() {
    return (
        <BrowserRouter>
            <Route render={(props) => (
                <Layout {...props}>
                    <Switch>
                        <Route path='/' exact component={MainPage} />
                        <Route path='/stations' component={Stations} />
                    </Switch>
                </Layout>
            )} />
        </BrowserRouter>
    )

}

export default Routes;