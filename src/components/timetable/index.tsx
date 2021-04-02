import React, { useEffect, useState } from 'react';
import {IMassHours, IMassHoursData, IPeriod, ISchedule} from "../../api/interfeces";
import { useMediaQuery } from "react-responsive";
import format from "date-fns/format";
import be from "date-fns/locale/be";
import isToday from "date-fns/isToday";
import TimeTableLine from "./components/timetableLine";
import DeleteModal from "../modalDelete";
import './style.scss';
import {setHours, setMinutes} from "date-fns";
import { Period } from '../../models/mass/types';
import { $massDeleted, deleteMass } from '../../models/mass';
import { useToasts } from 'react-toast-notifications';
import { useStore } from 'effector-react';

interface props {
  schedule: ISchedule[];
  // onDelete: (id: string, period: IPeriod, mass: IMassHoursData, date: Date) => void;
}

const TimeTable = ({ schedule }: props) => {
  const [selectedMass, setSelectedMass] = useState<IMassHoursData | null>(null);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const [tab, setTab] = useState<number>(0);
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })

  const handleDeleteModalOpen = (massHoursData: IMassHoursData, day: ISchedule, massHours: IMassHours) => {
    const [hour, minute] = massHours.hour.split(':');
    let date = setHours(day.date, Number(hour))
    date = setMinutes(date, Number(minute))
    setSelectedDay(date);
    setSelectedMass(massHoursData);
    setVisibleDelete(true);
  }

  /* refactoring start */
  const isDeletedMass = useStore($massDeleted);
  const { addToast } = useToasts();
  const [period, setPeriod] = useState<Period>();

  const handleDelete = (mass_id: string, period: Period) => {
    if (!selectedMass) return;

    setVisibleDelete(false);
    setPeriod(period)

    deleteMass({ mass_id, period });
  }

  useEffect(() => {
    console.log(isDeletedMass);
    if (!selectedMass || !isDeletedMass) return;
    console.log('showww');
    addToast(toastHelper(selectedMass, period, selectedDay))
  }, [isDeletedMass]);
  /*refactoring end*/

  const toastHelper = (mass: IMassHoursData, period: Period | undefined, date: Date): string => {
    if (!mass.days?.length) {
      return `Адзінкавая Імша ${format(date, 'dd.MM.yyyy, eeeeee', {locale: be} )}, ${mass.langCode}\n
       выдалена з раскладу!`;
    }
    if (mass.days?.length && period?.from && period.to) {
      const text = `Сталая Імша ${format(date, 'HH:mm, eeeeee', {locale: be} )}, ${mass.langCode}\n
      выдалена з раскладу ${format(date, 'dd.MM.yyyy')}`;
      return text
    }
    if (mass.days?.length && !period?.from && !period?.to) {
      const text = `Сталая Імша ${format(date, 'HH:mm, eeeeee', {locale: be} )}, ${mass.langCode}\n
      выдалена з раскладу цалкам`;
      return text
    }
    return ''
  }

  return <>
    <section className="timetable">
      {
        !isTablet && <>
          <header className="timetable__header">
            <table className="timetable__head">
              <tbody>
              <tr>
                <td className="timetable__date">Дзень тыдня</td>
                <td className="timetable__online" />
                <td className="timetable__time">Час</td>
                <td className="timetable__lang">Мова Імшы</td>
                <td className="timetable__comments">Каментарый</td>
                <td className="timetable__period">Тэрмін дзеяння</td>
                <td className="timetable__repeat">Паўтор</td>
                <td className="timetable__btn" />
              </tr>
              </tbody>
            </table>
          </header>

          <section className="timetable__main">
            {
              schedule.map((day: ISchedule, i) => {
                const lineCount = day.massHours
                  .reduce((count: number, current) => count + current.data.length, 1);

                return (
                  <section className="timetable__section" key={i}>
                    <table className="timetable__body">
                      <tbody>
                      <tr className="timetable__line">
                        <td className="timetable__date" rowSpan={lineCount}>
                          <div className="timetable__weekday">{format(day.date, 'eeee', {locale: be})}</div>
                          <div className="timetable__day">{format(day.date, 'dd MMMM', {locale: be})}</div>
                        </td>
                      </tr>
                      {
                        day.massHours.map((massHours, k) =>
                          <TimeTableLine
                            massHours={massHours} key={k}
                            onDelete={(data) => handleDeleteModalOpen(data, day, massHours)}
                          />)
                      }
                      </tbody>
                    </table>
                  </section>
                )
              })
            }

          </section>
        </>
      }
      {
        isTablet && <>
          <ul className="tabs">
            {
              schedule.map((day: ISchedule, i) =>(
                <li key={i} className={`tabs__item ${tab === i ? 'tabs__item--selected' : ''}`} onClick={() => setTab(i)}>
                  { isToday(day.date) && <div className="tabs__today">сёння</div> }
                  <div className="tabs__date">{format(day.date, 'EEEE', {locale: be})}</div>
                  <div className="tabs__date">{format(day.date, 'dd.MM', {locale: be})}</div>
                </li>
              ))
            }
          </ul>

          <header className="timetable__header">
            <table className="timetable__head">
              <tbody>
              <tr>
                <td className="timetable__online" />
                <td className="timetable__time">Час</td>
                <td className="timetable__lang">Мова Імшы</td>
                <td className="timetable__comments">Каментарый</td>
                <td className="timetable__period">Тэрмін дзеяння</td>
                <td className="timetable__repeat">Паўтор</td>
                <td className="timetable__btn" />
              </tr>
              </tbody>
            </table>
          </header>

          <section className="timetable__main">
            <section className="timetable__section">
              <table className="timetable__body">
                <tbody>

                {
                  schedule[tab].massHours.map((massHours, k) =>
                    <TimeTableLine
                      massHours={massHours} key={k}
                      onDelete={(data) => handleDeleteModalOpen(data, schedule[tab], massHours)}
                    />)
                }

                </tbody>
              </table>
            </section>

          </section>
        </>
      }


    </section>
    <DeleteModal visible={visibleDelete} onSave={handleDelete} onClose={() => setVisibleDelete(false)} mass={selectedMass} date={selectedDay}/>
  </>;
}

export default TimeTable;
