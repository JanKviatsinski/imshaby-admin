import React, {useState} from "react";
import { IMassHoursData, IPeriod, ISchedule } from "../../api/interfeces";
import { useMediaQuery } from "react-responsive";
import format from "date-fns/format";
import be from "date-fns/locale/be";
import isToday from "date-fns/isToday";
import TimeTableLine from "./components/timetableLine";
import DeleteModal from "../modalDelete";
import './style.scss';

interface props {
  schedule: ISchedule[];
  onDelete: (id: string, period: IPeriod) => void;
  onEdit: (id: string) => void;
}

const TimeTable = ({ schedule, onDelete, onEdit }: props) => {
  const [selectedMass, setSelectedMass] = useState<IMassHoursData | null>(null);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const [tab, setTab] = useState<number>(0);
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })

  const handleDelete = (massHoursData: IMassHoursData, day: ISchedule) => {
    setSelectedDay(day.date);
    setSelectedMass(massHoursData);
    setVisibleDelete(true);
  }

  const handleSave = (massId: string, period: IPeriod) => {
    onDelete(massId, period);
    setVisibleDelete(false);
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
                            onDelete={(data) => handleDelete(data, day)}
                            onEdit={onEdit}
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
                      onDelete={(data) => handleDelete(data, schedule[tab])}
                      onEdit={onEdit}
                    />)
                }

                </tbody>
              </table>
            </section>

          </section>
        </>
      }


    </section>
    <DeleteModal visible={visibleDelete} onSave={handleSave} onClose={() => setVisibleDelete(false)} mass={selectedMass} date={selectedDay}/>
  </>;
}

export default TimeTable;
