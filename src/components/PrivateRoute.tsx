import React, { useEffect } from 'react';
import { Route, withRouter } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

/*import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const PrivateRoute = () => (<div>Private</div>);

export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<div>Redirecting you to the login page...</div>)
});*/

interface IPrivateRoute {
  component: React.ComponentType,
  path: string;
}

const ProtectedRoute = ({ component, ...args }: IPrivateRoute) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);



/*const PrivateRoute = ({component: Component, path, ...rest} : IPrivateRoute) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (isLoading || isAuthenticated) {
      return;
    }

    const fn = async () => {
      await loginWithRedirect({appState: { targetUrl: path }});
    };
    fn();

  }, [isLoading, isAuthenticated, loginWithRedirect, path])

  const render = props => isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};*/

export default ProtectedRoute;
