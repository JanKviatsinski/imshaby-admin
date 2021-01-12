import React from "react";
import { ISchedule } from "../../api/interfeces";
import { InfinityIcon } from "../icons";

import './style.scss';
import format from "date-fns/format";
import be from "date-fns/locale/be";
import Repeat from "../repeat";
import TimeTableLine from "./components/timetableLine";

interface props {
  schedule: ISchedule[]
}

const TimeTable = ({ schedule }: props) => {


  return (
    <section className="timetable">
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
                    day.massHours.map((massHours, k) => <TimeTableLine massHours={massHours} key={k}/>)
                  }
                  </tbody>
                </table>
              </section>
            )
          })
        }

      </section>







    </section>
  );
}

export default TimeTable;
