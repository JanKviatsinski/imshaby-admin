import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IParish } from "../api/interfeces";
import Header from "../components/header";
import Loading from "../components/loading";

import ParishEdit from "../components/parishEdit";
import Section from "../components/section";
import SectionHeader from "../components/sectionHeader";
import {USER_PARISH_FIELD} from "../utils/constans";
import {getParishById} from "../api";
import { useGate, useStore } from 'effector-react';
import { $parish, ParishGate } from '../models/parish';
import { logout, LogoutGate } from '../models/auth';

const LogoutPage = () => {

  useGate(LogoutGate);

  useEffect(() => {
    console.log('LogoutPage PAGE');
  }, [])

  return <>
    LogoutPage
  </>
};

export default LogoutPage;
