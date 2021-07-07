import React, { useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useMediaQuery } from 'react-responsive';
import { useToasts } from 'react-toast-notifications';
import { setHours, setMinutes } from 'date-fns';
import format from 'date-fns/format';
import be from 'date-fns/locale/be';
import isToday from 'date-fns/isToday';

import DeleteModal from '../modalDelete';
import TimeTableLine from './components/timetableLine';

import { Period } from '../../models/mass/types';
import { $massDeleted, deleteMass } from '../../models/mass';
import { MassHours, MassHoursData, Schedule } from '../../models/schedule/types';

import './style.scss';

interface props {
  schedule: Schedule[];
}

const TimeTable = ({ schedule }: props) => {
  const [selectedMass, setSelectedMass] = useState<MassHoursData | null>(null);
  const [period, setPeriod] = useState<Period>();
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [tab, setTab] = useState<number>(0);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 812px)' });
  const { addToast } = useToasts();

  const isDeletedMass = useStore($massDeleted);

  useEffect(() => {
    if (!selectedMass || !isDeletedMass) return;

    addToast(toastHelper(selectedMass, period, selectedDay));
  }, [isDeletedMass]);


  const handleDeleteModalOpen = (massHoursData: MassHoursData, day: Schedule, massHours: MassHours) => {
    const [hour, minute] = massHours.hour.split(':');
    let date = setHours(day.date, Number(hour));
    date = setMinutes(date, Number(minute));
    setSelectedDay(date);
    setSelectedMass(massHoursData);
    setVisibleDelete(true);
  };

  const handleDelete = (mass_id: string, period: Period) => {
    if (!selectedMass) return;

    setVisibleDelete(false);
    setPeriod(period);
    deleteMass({ mass_id, period });
  };

  return (
    <>
      <section className="timetable">
        {
        !isTablet && ( // desktop
        <>
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
              schedule.map((day: Schedule, i) => {
                const lineCount = day.massHours
                  .reduce((count: number, current) => count + current.data.length, 1);

                return (
                  <section className="timetable__section" key={i}>
                    <table className="timetable__body">
                      <tbody>
                        <tr className="timetable__lineDate">
                          <td className="timetable__date" rowSpan={lineCount}>
                            <div className="timetable__weekday">{format(day.date, 'eeee', { locale: be })}</div>
                            <div className="timetable__day">{format(day.date, 'dd MMMM', { locale: be })}</div>
                          </td>
                        </tr>
                        {
                        day.massHours.map((massHours, k) => (
                          <TimeTableLine
                            massHours={massHours}
                            key={k}
                            onDelete={(data) => handleDeleteModalOpen(data, day, massHours)}
                          />
                        ))
                      }
                      </tbody>
                    </table>
                  </section>
                );
              })
            }

          </section>
        </>
        )
      }
        {
          (isTablet && !isMobile) && (
        <>
          <ul className="tabs">
            {
              schedule.map((day: Schedule, i) => (
                <li key={i} className={`tabs__item ${tab === i ? 'tabs__item--selected' : ''}`} onClick={() => setTab(i)}>
                  { isToday(day.date) && <div className="tabs__today">сёння</div> }
                  <div className="tabs__weekDate">{format(day.date, 'EEEE', { locale: be })}</div>
                  <div className="tabs__date">{format(day.date, 'dd.MM', { locale: be })}</div>
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
                  schedule[tab]?.massHours?.map((massHours, k) => (
                    <TimeTableLine
                      massHours={massHours}
                      key={k}
                      onDelete={(data) => handleDeleteModalOpen(data, schedule[tab], massHours)}
                    />
                  ))
                }
                </tbody>
              </table>
            </section>
          </section>
        </>
        )
      }

        {
          isMobile && (
            <>
              <ul className="tabs">
                {
                  schedule.map((day: Schedule, i) => (
                    <li key={i} className={`tabs__item ${tab === i ? 'tabs__item--selected' : ''}`} onClick={() => setTab(i)}>
                      { isToday(day.date) && <div className="tabs__today">сёння</div> }
                      <div className="tabs__weekDate">{format(day.date, 'EEEEEE', { locale: be })}</div>
                      <div className="tabs__date">{format(day.date, 'dd.MM', { locale: be })}</div>
                    </li>
                  ))
                }
              </ul>

              <section className="timetable__main">
                <section className="timetable__section">
                  <table className="timetable__body">
                    <tbody>
                    {
                      schedule[tab]?.massHours?.map((massHours, k) => (
                        <TimeTableLine
                          massHours={massHours}
                          key={k}
                          onDelete={(data) => handleDeleteModalOpen(data, schedule[tab], massHours)}
                        />
                      ))
                    }
                    </tbody>
                  </table>
                </section>
              </section>
            </>
          )
        }

      </section>
      <DeleteModal visible={visibleDelete} onSave={handleDelete} onClose={() => setVisibleDelete(false)} mass={selectedMass} date={selectedDay} />
    </>
  );
};

const toastHelper = (mass: MassHoursData, period: Period | undefined, date: Date): string => {
  if (!mass.days?.length) {
    return `Адзінкавая Імша ${format(date, 'dd.MM.yyyy, eeeeee', { locale: be })}, ${mass.langCode}, выдалена з раскладу!`;
  }
  if (mass.days?.length && period?.from && period.to) {
    return `Сталая Імша ${format(date, 'HH:mm, eeeeee', { locale: be })}, ${mass.langCode}, выдалена з раскладу ${format(date, 'dd.MM.yyyy')}`;

  }
  if (mass.days?.length && !period?.from && !period?.to) {
    return `Сталая Імша ${format(date, 'HH:mm, eeeeee', { locale: be })}, ${mass.langCode}, выдалена з раскладу цалкам`;
  }
  return '';
};

export default TimeTable;
