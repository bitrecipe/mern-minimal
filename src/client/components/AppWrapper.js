import React from "react";
import { renderRoutes, matchRoutes } from "react-router-config";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from './../actions/auth.js';
import * as commonActions from './../actions/common.js';

class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var { route, session, location: { pathname }, getCountries, loginFulfilled, countries } = this.props;

        var branchs = matchRoutes(route.routes, pathname), notFound = true;

        for (let i = 0; i < branchs.length; i++) {
            if (branchs[i].match.isExact) {
                notFound = false;
            }
        }

        var content = "";

        if (notFound) {
            content = <Redirect to="/error/404" />
        } else {
            if (session.authenticated && !pathname.startsWith("/dashboard")) {
                content = <Redirect to="/dashboard" />
            } else if (!session.authenticated && pathname.startsWith("/dashboard")) {
                content = <Redirect to="/login" />
            } else {
                content = renderRoutes(route.routes, { getCountries, loginFulfilled, countries, session })
            }
        }

        return (
            <div>
                {content}
            </div>
        );

    }
}


function mapStateToProps(store) {
    return {
        session: store.session,
        countries: store.countries
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, authActions, commonActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
