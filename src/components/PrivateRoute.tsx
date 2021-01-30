import React  from 'react';
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

interface IPrivateRoute {
  component: React.ComponentType,
  path: string;
}

const ProtectedRoute = ({ component, ...args }: IPrivateRoute) => (
  <Route component={withAuthenticationRequired(component)} {...args} exact={true}/>
);

export default ProtectedRoute;
