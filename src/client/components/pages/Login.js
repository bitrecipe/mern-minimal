import React from "react";
import { Link } from 'react-router-dom';
import { login } from "./../../apis/auth.js";
import { Field, reduxForm } from 'redux-form';

const _LoginForm = props => {
    const { handleSubmit, pristine, submitting, login } = props
    return (
        <form className="form-signin" onSubmit={handleSubmit(login)}>
            <h2 className="form-signin-heading">signin (signup first)</h2>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <Field name="email" component="input" type="text" placeholder="Email address" id="inputEmail" className="form-control" />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <Field name="password" component="input" type="password" placeholder="Password" id="inputPassword" className="form-control" />
            <div className="checkbox">
                <label>
                    <Link to="/signup">signup</Link>
                </label>
            </div>
            <button type="submit" disabled={pristine || submitting} className="btn btn-lg btn-primary btn-block">Sign in</button>
        </form>
    )
}

const LoginForm = reduxForm({ form: 'loginForm' })(_LoginForm);

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
    }

    login(data) {
        var _this = this;

        return login(data).then(function (res) {
            console.log(res.data);
            _this.props.loginFulfilled(res.data);
        }).catch(function (err) {
            console.log(err.response.data)
        });
    }

    render() {

        return (
            <div className="container">
                <LoginForm login={this.login} />
            </div>
        );
    }
}


export default Login;
