import React from "react";
import ReactDOM from 'react-dom';
import { Router, Switch } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import process from 'process';

import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/index";
import Loading from "./components/loading";

const App = () => {
  /*const { isLoading } = useAuth0();*/

/*  if (isLoading) return <Loading />;*/
  return <>hello</>
 /* return (
    <Router history={history}>
      <Switch>
        <PrivateRoute path="/" component={ MainPage } />
      </Switch>
    </Router>
  );*/
};

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);
