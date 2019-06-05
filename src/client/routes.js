import React from "react";
import { Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

const AppWrapper = loadable(() => import("./components/AppWrapper.js"));
const Home = loadable(() => import("./components/pages/Home.js"));
const Dashboard = loadable(() => import("./components/Dashboard.js"));
const Login = loadable(() => import("./components/pages/Login.js"));
const Signup = loadable(() => import("./components/pages/Signup.js"));
const ErrorPage = loadable(() => import("./components/pages/ErrorPage.js"));

function createRoutes(store) {

    var routes = [{
        path: "/",
        component: AppWrapper,
        routes: [{
                path: "/",
                exact: true,
                component: () => <Redirect to="/dashboard" />
            },
            {
                path: "/login",
                component: Login
            },
            {
                path: "/signup",
                component: Signup
            },
            {
                path: "/dashboard",
                component: Dashboard,
                routes: [{
                    path: "/dashboard",
                    exact: true,
                    component: Home
                }]
            },
            {
                path: "/error/:code",
                exact: true,
                component: ErrorPage
            }
        ]
    }];

    return routes;
}

export default createRoutes;