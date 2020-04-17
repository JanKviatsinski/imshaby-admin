import React, {useState, useEffect} from 'react';
import {IMassCreate, ISchedule, IWeekSchedule} from "../../api/interfeces";
import be from 'date-fns/locale/be';
//import { addDays, parse, format, startOfWeek, subDays, compareDesc, setHours, setMinutes } from 'date-fns';
import addDays from 'date-fns/addDays';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import subDays from 'date-fns/subDays';
import compareDesc from 'date-fns/compareDesc';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

import ArrowLeftIcon from '/assets/images/arrow-left.svg';
import ArrowRightIcon from '/assets/images/arrow-right.svg';
import DeleteIcon from '/assets/images/delete.svg';
import InfinityIcon from '/assets/images/infinity.svg';
import Repeat from "../repeat";
import './style.scss';

interface IProps {
  weekSchedule: IWeekSchedule,
  changeDate: (date: Date) => void;
  deleteMass: (mass: IMassCreate, date: Date) => void;
  date: Date;
}

const Schedule = ({weekSchedule,date, changeDate, deleteMass} : IProps) => {
  const [isCurrentWeek, setCurrentWeek] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<ISchedule[]>([]);


  useEffect(() => {
    setSchedule(weekSchedule.schedule?.map((i) => ({...i, date: parse(i.date, 'MM/dd/yyyy', new Date())})));
  }, [weekSchedule]);

  useEffect(() => {
    setCurrentWeek(compareDesc(new Date(), date) < 0);
  }, [date]);

  const handleNextWeek = () => changeDate(addDays(date, 7));
  const handlePrevWeek = () => changeDate(subDays(date, 7));
  const handleSetCurrentWeek = () => changeDate(startOfWeek(new Date()));

  const handleDeleteMass = (mass, date, hour) => {
    let currentDate = setHours(date, hour.split(':')[0])
    currentDate = setMinutes(currentDate, hour.split(':')[1]);

    deleteMass(mass, currentDate);
  };

  if(!schedule?.length) return <div>Loading...</div>;

  return <>
    <section className="schedule">
      <section className="schedule__main">
        <header className="schedule__nav">
          <div className="schedule__title">Расклад на тыдзень</div>
          <div className="schedule__pagination pagination">
            {
              !isCurrentWeek && <>
                <span className="pagination__prev" onClick={() => handlePrevWeek()}> <ArrowLeftIcon/> </span>
              </>
            }

            <span
              className="pagination__date"> {format(schedule[0].date, 'd')} - {format(schedule[6].date, 'dd MMMM', {locale: be})}</span>
            <span className="pagination__next" onClick={() => handleNextWeek()}> <ArrowRightIcon/> </span>
          </div>
          <span className={`schedule__current-week ${!isCurrentWeek ? 'schedule__current-week--active' : ''}`}
                onClick={handleSetCurrentWeek}>Бягучы тыдзень</span>
        </header>

        <section className="schedule__table timetable">
          <header className="timetable__header">
            <table className="timetable__head">
              <tbody>
              <tr>
                <td className="timetable__date">Дзень тыдня</td>
                <td className="timetable__time">Час</td>
                <td className="timetable__lang">Мова Імшы</td>
                <td className="timetable__comments">Каментарый</td>
                <td className="timetable__period">Тэрмін дзеяння</td>
                <td className="timetable__repeat">Паўтор</td>
                <td className="timetable__btn"/>
              </tr>
              </tbody>
            </table>
          </header>

          <section className="timetable__main">
            {
              schedule.map((day: ISchedule, i) => {
                const countMass = day.massHours
                  .reduce((count: number, current) => count + current.data.length, 0);

                return <React.Fragment key={i}>
                  <section className="timetable__section">
                    <table className="timetable__body">
                      <tbody>
                      <tr className="timetable__line">
                        <td className="timetable__date" rowSpan={countMass + 1}>
                          <div className="timetable__weekday">{format(day.date, 'eeee', {locale: be})}</div>
                          <div className="timetable__day">{format(day.date, 'dd MMMM', {locale: be})}</div>
                        </td>
                      </tr>

                      {
                        day.massHours.map((massHours, k) => <React.Fragment key={k}>
                          {
                            massHours.data.map((data, n) => <React.Fragment key={n}>

                              <tr className="timetable__line">
                                <td className="timetable__time">{massHours.hour}</td>
                                <td className="timetable__lang">{data.langCode}</td>
                                <td className="timetable__comments">{data.info}</td>
                                <td className="timetable__period">
                                  <div className="period">
                                    {
                                      data.startDate && data.endDate && data.days && <>
                                        <span className="period__start">з </span>
                                        <span className="period__date">{format(new Date(data.startDate), 'dd.MM.yyyy')}</span>
                                        <br/>
                                        <span className="period__end">па </span>
                                        <span className="period__date">{format(new Date(data.endDate), 'dd.MM.yyyy')}</span>
                                      </>
                                    }
                                    {
                                      !data.endDate && data.days && <>
                                        <InfinityIcon/>
                                      </>
                                    }
                                    {
                                      !data.days && <span className="period__date">Адзінкавая</span>
                                    }
                                  </div>
                                </td>
                                <td className="timetable__repeat">
                                  {
                                    data.days && <Repeat week={data.days} />
                                  }
                                </td>
                                <td className="timetable__btn">
                                  <DeleteIcon className="timetable__btn-icon" onClick={() => handleDeleteMass(data, day.date, massHours.hour)}/>
                                </td>
                              </tr>
                            </React.Fragment>)
                          }

                        </React.Fragment>)
                      }
                      </tbody>
                    </table>
                  </section>
                </React.Fragment>
              })
            }

          </section>
        </section>

      </section>
    </section>
  </>
};

export default Schedule;
