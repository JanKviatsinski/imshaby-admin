import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { Route } from 'react-router-dom';
import { $auth, $authStatus, loginWithRedirect } from '../models/auth';
import { $appInitialized, $auth0ClientReady } from '../models/app';
import Loading from './loading';
import { AuthStatus } from '../models/auth/types';

interface IPrivateRoute {
  component: React.ComponentType,
  path: string;
}

const ProtectedRoute = ({ component, ...args }: IPrivateRoute) => {
  const appInitialized = useStore($appInitialized);
  const authClientInitialized = useStore($auth0ClientReady);
  const { token } = useStore($auth);
  const authStatus = useStore($authStatus);

  useEffect(() => {
    console.log(authStatus);
    debugger
    if (authStatus === AuthStatus.failed) {
      loginWithRedirect();
    }
  }, [authStatus]);


  if (appInitialized) {
    return <Route component={(component)} {...args} exact={true} />;
  } else {
    return <Loading />;
  }
};

export default ProtectedRoute;
