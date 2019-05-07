import React from "react";
import cookie from 'react-cookies';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        document.getElementById("logoutForm").submit();
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <a className="navbar-brand" >MERN minimal</a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a>{this.props.session.email}</a>
                            </li>
                            <li>
                                <a onClick={this.logout}>Logout</a>
                                <form action="/ui/logout" method="post" id="logoutForm">
                                    <input type="hidden" name="_csrf" defaultValue={`${cookie.load("_csrf_token")}`} />
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        );
    }
}

export default Header;