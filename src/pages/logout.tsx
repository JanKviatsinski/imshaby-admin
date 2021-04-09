import React from 'react';
import { useGate } from 'effector-react';
import { LogoutGate } from '../models/auth';

const LogoutPage = () => {
  useGate(LogoutGate);

  return (
    <>
      LogoutPage
    </>
  );
};

export default LogoutPage;
