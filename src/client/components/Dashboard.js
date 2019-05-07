import React from "react";
import { renderRoutes } from "react-router-config";
import Header from "./Header.js";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        var { route, getCountries, countries, session } = this.props;

        return (
            <div>
                <Header session={session} />
                {renderRoutes(route.routes, { getCountries, countries })}
            </div>
        );
    }
}


export default Dashboard;