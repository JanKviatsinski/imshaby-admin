import React from 'react';
import { useGate } from 'effector-react';
import { LoginGate } from '../models/auth';

const LoginPage = () => {
  useGate(LoginGate);

  return (
    <>
      LoginPage
    </>
  );
};

export default LoginPage;
