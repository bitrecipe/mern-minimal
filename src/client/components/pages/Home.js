import React from "react";

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getCountries();
    }

    render() {

        var { countries } = this.props;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3 col-md-2 sidebar">
                        <ul className="nav nav-sidebar">
                            <li className="active"><a >Menu 1 <span className="sr-only">(current)</span></a></li>
                            <li><a >Menu 2</a></li>
                            <li><a >Menu 3</a></li>
                        </ul>
                    </div>
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        <h1 className="page-header">Dashboard</h1>
                        <div className="row placeholders">
                            <div className="col-xs-6 col-sm-3 placeholder">
                                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width={200} height={200} className="img-responsive" alt="Generic placeholder thumbnail" />
                                <h4>Label</h4>
                                <span className="text-muted">Something else</span>
                            </div>
                            <div className="col-xs-6 col-sm-3 placeholder">
                                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width={200} height={200} className="img-responsive" alt="Generic placeholder thumbnail" />
                                <h4>Label</h4>
                                <span className="text-muted">Something else</span>
                            </div>
                            <div className="col-xs-6 col-sm-3 placeholder">
                                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width={200} height={200} className="img-responsive" alt="Generic placeholder thumbnail" />
                                <h4>Label</h4>
                                <span className="text-muted">Something else</span>
                            </div>
                            <div className="col-xs-6 col-sm-3 placeholder">
                                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" width={200} height={200} className="img-responsive" alt="Generic placeholder thumbnail" />
                                <h4>Label</h4>
                                <span className="text-muted">Something else</span>
                            </div>
                        </div>
                        <h2 className="sub-header">Countries</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>id</th>
                                        <th>name</th>
                                        <th>capital</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {countries.data.map(function (e, i) {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{e._id}</td>
                                                <td>{e.name}</td>
                                                <td>{e.capital}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Home;