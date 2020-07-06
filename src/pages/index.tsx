import React, { useEffect, useState } from 'react';
// import { addDays, parse, format, startOfWeek } from 'date-fns';
import addDays from 'date-fns/addDays';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';

import {approveSchedule, createMass, deleteMass, getParishById, getWeekSchedule} from "../api";
import {IMassCreate, IParish, IWeekSchedule} from "../api/interfeces";

import ArrowDownIcon from '/assets/images/arrow-down.svg';


import { useAuth0 } from "../utils/react-auth0-spa";
import Schedule from "../components/schedule";

import CreateModal from "../components/modalCreate";

import CreateModalResult from "../components/modalCreate/result";
import DeleteModal from "../components/modalDelete";
import DeleteModalResult from "../components/modalDelete/result";
import Loading from "../components/loading";
import ApproveModalResult from "../components/modalApprove";

const USER_PARISH_ID = 'https://imshaby.by/parishId';

const MainPage = () => {
  const { loading, user, getTokenSilently } = useAuth0();

  const [parish, setParish] = useState<IParish | null>(null);
  const [parishId, setParishId] = useState<string>('');
  const [visibleCreate, setVisibleCreate] = useState<boolean>(false);
  const [visibleCreateResult, setVisibleCreateResult] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [visibleDeleteResult, setVisibleDeleteResult] = useState<boolean>(false);
  const [visibleApproveResult, setVisibleApproveResult] = useState<boolean>(false);
  const [collapsedInfo, setCollapsedInfo] = useState<boolean>(false);
  const [actualPeriod, setActualPeriod] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<IWeekSchedule[]>({});
  const [date, setDate] = useState<Date>(startOfWeek(new Date()));
  const [newMass, setNewMass] = useState<IMassCreate | null>(null);
  const [deletedMass, setDeletedMass] = useState<IMassCreate | null>(null);
  const [deletedMassDate, setDeletedMassDate] = useState<Date>(new Date());

  useEffect(() => {
    setParishId(user[USER_PARISH_ID]);
  }, [user]);

  useEffect(() => {
    if(!parishId) return;
    fetchParishInfo();
  }, [parishId]);

  useEffect(() => {
    if(!parishId) return;

    const fetchData = async () => {
      const schedule = await fetchDataSchedule();
      setSchedule(schedule);
    };
    fetchData();
  }, [date, parishId]);

  const fetchParishInfo = async () => {
    const token = await getTokenSilently();
    const parish: IParish = await getParishById(token, parishId);
    setParish(parish);

    let actualDate = parse(parish.lastMassActualDate, 'dd-MM-yyyy HH:mm:ss', new Date());
    actualDate = addDays(actualDate, parish.updatePeriodInDays);
    setActualPeriod(actualDate);
  }

  const fetchDataSchedule = async () => {
    const token = await getTokenSilently();
    return await getWeekSchedule(token, parishId, format(date, 'dd-MM-yyyy'))
  };


  const handleCreateOpen = () => setVisibleCreate(true);
  const handleCreateClose = () => setVisibleCreate(false);
  const handleSuccessClose = () => setVisibleCreateResult(false)


  const handleSaveMass = async (data) => {
    const token = await getTokenSilently();
    const params = {
      ...data,
      parishId,
      cityId: parish.cityId
    };
    const mass: IMassCreate = await createMass(token, params);
    setVisibleCreate(false);
    if (mass) {
      setNewMass(mass);
      setVisibleCreateResult(true);
      const schedule = await fetchDataSchedule();
      setSchedule(schedule);
    }
  };

  const handleSelectToDelete = (mass: IMassCreate, date: Date) => {
    setDeletedMass(mass);
    setDeletedMassDate(date);
    setVisibleDelete(true);
  }

  const handleDelete = async (id: string, period: {from: string, to: string}) => {
    const token = await getTokenSilently();
    const res = await deleteMass(token, id, period);
    setVisibleDelete(false);
    if (res) {
      setVisibleDeleteResult(true);
      const schedule = await fetchDataSchedule();
      setSchedule(schedule);
    }
  };

  const handleApprove = async () => {
    const token = await getTokenSilently();
    const res = await approveSchedule(token, parishId);
    setVisibleApproveResult(true);
    const resParish = await fetchParishInfo();
  }


  if (loading || !user || !parish) return <Loading />;
  return <>
    <section className="container">
      <header className="header">
        <h1 className="header__title">{parish.name}</h1>
        <section className="header__info church">
          <header className="church__header">
            <button className="church__btn" onClick={() => setCollapsedInfo(!collapsedInfo)}>
              <span className="church__btn-txt">Агульная інфармацыя</span>
              <ArrowDownIcon className={`church__icon ${collapsedInfo ? 'church__icon--collapsed' : ''}`}/>
            </button>
          </header>
          <section className={`church__content ${collapsedInfo ? 'church__content--collapsed' : ''}`} >
            <aside className="church__photo">
              <img className="church__img" src={`https://imsha.by/${parish.imgPath}`} alt=""/>
            </aside>
            <section className="church__main">
              <ul className="church__list">
                <li className="church__item">
                  <span className="church__dt">Парафія</span>
                  <span className="church__dd">{parish.name}</span>
                </li>
                <li className="church__item">
                  <span className="church__dt">Адрас</span>
                  <span className="church__dd">{parish.address}</span>
                </li>
                <li className="church__item">
                  <span className="church__dt">Адказная асоба</span>
                  <span className="church__dd">TODO: Андрэй Іваноў</span>
                </li>
                <li className="church__item">
                  <span className="church__dt">Тэлефон</span>
                  <span className="church__dd">TODO: {parish.supportPhone}</span>
                </li>
                <li className="church__item">
                  <span className="church__dt">Эл. пошта</span>
                  <span className="church__dd">TODO: {parish.email}</span>
                </li>
                <li className="church__item">
                  <span className="church__dt">Перыяд актуальнасці Імшаў</span>
                  <span className="church__dd">{parish.updatePeriodInDays} дні</span>
                </li>
              </ul>
              <span className="church__info">Расклад актуальны да {format(actualPeriod, 'dd.MM.yyyy')}</span>
            </section>
          </section>
        </section>
      </header>

      <section className="menu">
        <header className="schedule__header">
          <button className="schedule__btn btn" onClick={handleCreateOpen}>Дадаць Імшу</button>
          <button className="schedule__btn btn" onClick={handleApprove}>Пацвердзіць расклад</button>
        </header>
      </section>

      {
        schedule && <Schedule weekSchedule={schedule} changeDate={(date) => setDate(date)} date={date} deleteMass={handleSelectToDelete}/>
      }

    </section>
    <CreateModal visible={visibleCreate} onClose={handleCreateClose} onSave={handleSaveMass} />
    <CreateModalResult visible={visibleCreateResult} mass={newMass}  onClose={handleSuccessClose} />
    <DeleteModal visible={visibleDelete} onClose={() => setVisibleDelete(false)} onSave={handleDelete} mass={deletedMass} date={deletedMassDate} />
    <DeleteModalResult visible={visibleDeleteResult} onClose={() => setVisibleDeleteResult(false)} />
    <ApproveModalResult visible={visibleApproveResult} onClose={() => setVisibleApproveResult(false)} />
  </>
};

export default MainPage;
