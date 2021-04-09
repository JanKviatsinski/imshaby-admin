import React from 'react';
import { useStore } from 'effector-react';
import { Route } from 'react-router-dom';
import { $user } from '../models/auth';
import { $appInitialized } from '../models/app';
import Loading from './loading';

interface IPrivateRoute {
  component: React.ComponentType,
  path: string;
}

const PrivateRoute = ({ component, path }: IPrivateRoute) => {
  const appInitialized = useStore($appInitialized);
  const { parish_id } = useStore($user);

  if (appInitialized && parish_id) {
    return <Route component={(component)} path={path} exact />;
  }
  return <Loading />;
};

export default PrivateRoute;
