import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import {useAuth0} from "@auth0/auth0-react";
import Pagination from "../pagination";
import {getWeekSchedule} from "../../api";
import {IParish, IWeekSchedule} from "../../api/interfeces";
import './style.scss';
import Loading from "../loading";
import TimeTable from "../timetable";
import compareDesc from "date-fns/compareDesc";
import CreateModal from "../modalCreate";

interface props {
  parish: IParish;
}

const Schedule = ({ parish } : props) => {
  const { getAccessTokenSilently } = useAuth0();
  const [date, setDate] = useState<Date>(new Date());
  const [weekSchedule, setWeekSchedule] = useState<IWeekSchedule>(null);
  const [isCurrentWeek, setCurrentWeek] = useState<boolean>(false);

  useEffect(() => {
    if (!weekSchedule) return;
    setCurrentWeek(compareDesc(new Date(), weekSchedule.startWeekDate) < 0);
  }, [weekSchedule]);

  useEffect(() => {
    fetchSchedule();
  }, [date]);


  const fetchSchedule = async () => {
    const token = await getAccessTokenSilently();
    const schedule = await getWeekSchedule(token, parish.id, format(date, 'dd-MM-yyyy'));
    setWeekSchedule(schedule);
  }

  const handleChangeDate = (date: Date) => {
    setDate(date);
  }

  const handleMassCreate = () => {
    
  }

  if (!weekSchedule) return <Loading />
  return <>
    <section className="schedule">
      <header className="schedule__header">
        <div className="schedule__add">
          <button className="btn" onClick={handleMassCreate}>Дадаць Імшу</button>
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

    <CreateModal visible={true} onClose={handleMassCreate} onSave={handleMassCreate}/>
  </>;
}

export default Schedule;
