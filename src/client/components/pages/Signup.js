import React from "react";
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { createUser } from "./../../apis/auth.js";

const _SignupForm = props => {
    const { handleSubmit, pristine, submitting, createUser } = props
    return (
        <form className="form-signin" onSubmit={handleSubmit(createUser)}>
            <h2 className="form-signin-heading">signup</h2>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <Field name="email" component="input" type="text" placeholder="Email address" id="inputEmail" className="form-control" />
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <Field name="password" component="input" type="password" placeholder="Password" id="inputPassword" className="form-control" />
            <div className="checkbox">
                <label>
                    <Link to="/login">login</Link>
                </label>
            </div>
            <button type="submit" disabled={pristine || submitting} className="btn btn-lg btn-primary btn-block">Sign up</button>
        </form>
    )
}

const SignupForm = reduxForm({ form: 'signupForm' })(_SignupForm);

class Signup extends React.Component {
    constructor(props) {
        super(props);
    }

    createUser(data) {
        
        return createUser(data).then(function (res) {

            alert(res.data.message)

        }).catch(function (err) {
            console.log(err.response.data)
        });
    }

    render() {

        return (
            <div className="container">
                <SignupForm createUser={this.createUser} />
            </div>
        );
    }
}


export default Signup;
