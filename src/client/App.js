import React from "react";
import { hot } from 'react-hot-loader/root';
import DevTools from "./components/DevTools.js";
import { renderRoutes } from "react-router-config";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import createRoutes from "./routes.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isMounted: false };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    render() {

        var { route, store } = this.props;

        return (
            <div>
                {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV == 'development' && <DevTools />}
                <div>
                    {renderRoutes(createRoutes(store))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(store) {
    return { store };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, {}), dispatch);
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(App));
