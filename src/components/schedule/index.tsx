import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import {useAuth0} from "@auth0/auth0-react";
import Pagination from "../pagination";
import {getWeekSchedule, createMass} from "../../api";
import {IMassCreate, IParish, IWeekSchedule} from "../../api/interfeces";
import './style.scss';
import Loading from "../loading";
import TimeTable from "../timetable";
import compareDesc from "date-fns/compareDesc";
import CreateModal from "../modalCreate";
import CreateModalResult from "../modalCreate/result";

interface props {
  parish: IParish;
}

const Schedule = ({ parish } : props) => {
  const { getAccessTokenSilently } = useAuth0();
  const [date, setDate] = useState<Date>(new Date());
  const [weekSchedule, setWeekSchedule] = useState<IWeekSchedule | null>(null);
  const [isCurrentWeek, setCurrentWeek] = useState<boolean>(false);
  const [triggerCreateModal, setTriggerCreateModal] = useState<boolean>(false);
  const [triggerCreateResultModal, setTriggerCreateResultModal] = useState<boolean>(false);
  const [mass, setMass] = useState<IMassCreate | null>(null);

  useEffect(() => {
    if (!weekSchedule) return;
    setCurrentWeek(compareDesc(new Date(), weekSchedule.startWeekDate) < 0);
  }, [weekSchedule]);

  useEffect(() => {
    fetchSchedule();
  }, [date]);


  const fetchSchedule = async () => {
    if (!parish?.id) {
      return;
    }
    const token = await getAccessTokenSilently();
    const schedule = await getWeekSchedule(token, parish.id, format(date, 'dd-MM-yyyy'));
    setWeekSchedule(schedule);
  }

  const handleChangeDate = (date: Date) => {
    setDate(date);
  }

  const handleMassCreateOpen = () => {
    setTriggerCreateModal(true);
  }
  const handleMassCreateClose = () => {
    setTriggerCreateModal(false);
  }
  const handleMassCreate = async (data: IMassCreate) => {
    const newMass = {
      ...data,
      cityId: parish.cityId,
      parishId: parish.id,
    }
    const token = await getAccessTokenSilently();
    const mass = await createMass(token, newMass);
    const schedule = await fetchSchedule();
    setMass(mass)
    setTriggerCreateModal(false);
    setTriggerCreateResultModal(true);
  }

  if (!weekSchedule) return <Loading />
  return <>
    <section className="schedule">
      <header className="schedule__header">
        <div className="schedule__add">
          <button className="btn" onClick={handleMassCreateOpen}>Дадаць Імшу</button>
        </div>
        <div className="schedule__pagination">
          <Pagination schedule={weekSchedule} changeDate={handleChangeDate} isCurrentWeek={isCurrentWeek}/>
        </div>
        <div className="schedule__currentWeek">
          <button className="btn btn-empty" onClick={() => handleChangeDate(new Date())} disabled={isCurrentWeek}>
            Бягучы тыдзень
          </button>
        </div>
      </header>

      <section className="schedule__content">
        <TimeTable schedule={weekSchedule.schedule}/>
      </section>
    </section>

    <CreateModal visible={triggerCreateModal} onClose={handleMassCreateClose} onSave={handleMassCreate}/>
    <CreateModalResult visible={triggerCreateResultModal} onClose={() => setTriggerCreateResultModal(false)} mass={mass} />
  </>;
}

export default Schedule;
