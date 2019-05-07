import React from "react";
import { hot } from 'react-hot-loader/root';
import DevTools from "./components/DevTools.js";
import { renderRoutes } from "react-router-config";
import routes from "./routes.js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isMounted: false };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
    }

    render() {

        var { route } = this.props;

        return (
            <div>
                {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV == 'development' && <DevTools />}
                <div>
                    {renderRoutes(routes)}
                </div>
            </div>
        );
    }
}

export default hot(App);
