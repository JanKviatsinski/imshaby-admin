import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch } from "react-router-dom";
import { Auth0Provider, useAuth0, AppState } from "@auth0/auth0-react";
import reportWebVitals from './reportWebVitals';
import history from "./utils/history";

import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/index";
import Loading from "./components/loading";

import "./styles/style.scss"

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;
  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute path="/" component={ MainPage } />
      </Switch>
    </Router>
  );
};

const onRedirectCallback = (appState: AppState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN || ''}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID || ''}
    audience={process.env.REACT_APP_AUTH_AUDIENCE}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.querySelector('#root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
