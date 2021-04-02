import React, { useState, useEffect } from "react";
import {useToasts} from "react-toast-notifications";
import format from "date-fns/format";
import Pagination from "../pagination";
import {IMassCreate, IMassHoursData, IParish, IPeriod, IWeekSchedule} from "../../api/interfeces";
import Loading from "../loading";
import TimeTable from "../timetable";
import compareDesc from "date-fns/compareDesc";
import CreateModal from "../modalCreate";
import CreateModalResult from "../modalCreate/result";
import be from "date-fns/locale/be";
import './style.scss';
import { useGate, useStore } from 'effector-react';
import { $schedule, fetchWeekSchedule, updateScheduleDate } from '../../models/schedule';
import { $massDeleted, changeMassMode, resetMass } from '../../models/mass';
import parish from '../../pages/parish';
import { MassMode } from '../../models/mass/types';

const Schedule = () => {
  const weekSchedule = useStore($schedule);
  const [date, setDate] = useState<Date>(new Date());
  const [isCurrentWeek, setCurrentWeek] = useState<boolean>(false);


  useEffect(() => {
    fetchWeekSchedule()
  }, []);




  useEffect(() => {
    if (!weekSchedule) return;
    setCurrentWeek(compareDesc(new Date(), weekSchedule.startWeekDate) < 0);
  }, [weekSchedule]);


  const handleChangeDate = (date: Date) => {
    updateScheduleDate(date)
    fetchWeekSchedule()
  }

  const handleMassCreateOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    resetMass()
    changeMassMode(MassMode.CREATE);
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
        <TimeTable schedule={weekSchedule.schedule} />
      </section>
    </section>

    <CreateModal />
    <CreateModalResult />
  </>;
}

export default Schedule;
