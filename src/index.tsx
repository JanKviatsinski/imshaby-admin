import React from "react";
import ReactDOM from 'react-dom';
import { Router, Switch} from "react-router-dom";
import { Auth0Provider, useAuth0 } from "./utils/react-auth0-spa";
import history from "./utils/history";

import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages";
import Loading from "./components/loading";

const App = () => {
  const { loading } = useAuth0();

  if (loading) return <Loading />;
  return (
    <Router history={history}>
      <Switch>
        <PrivateRoute path="/" component={MainPage} />
      </Switch>
    </Router>
  );
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
