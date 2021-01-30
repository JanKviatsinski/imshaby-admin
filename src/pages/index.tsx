import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {USER_PARISH_FIELD} from "../utils/constans";
import { IParish } from "../api/interfeces";
import Header from "../components/header";
import Loading from "../components/loading";

import Section from "../components/section";
import SectionHeader from "../components/sectionHeader";

import {getParishById} from "../api";
import Parish from "../components/parish";
import Schedule from "../components/schedule";

const MainPage = () => {
  const { isLoading, user, getAccessTokenSilently, logout } = useAuth0();
  const [parish, setParish] = useState<IParish | null>(null)
  useEffect(() => {

    const parishId = user[USER_PARISH_FIELD];
    fetchParish(parishId);
  }, [user])

  const fetchParish = async (id: string) => {
    const token = await getAccessTokenSilently();
    const parish = await getParishById(token, id);
    setParish({...parish, id});
  }

  const handleApprove = () => {
    if (parish) {
      fetchParish(parish.id);
    }
  }

  const handleLogout = () => {
    logout();
  };

  if (isLoading || !user || !parish) return <Loading />;
  return <>
    <Header />

    <Section
      header={
        <SectionHeader title={parish.name} action={true} callback={handleLogout} />
      }
      content={
        <Parish parish={parish} onApprove={handleApprove}/>
      }
    />

    <Section
      header={
        <SectionHeader title='Расклад на тыдзень' />
      }
      content={
        <Schedule parish={parish}/>
      }
    />
  </>
};

export default MainPage;
