import React, {useRef, useState} from "react";
import format from "date-fns/format";
import {IMassHours} from "../../../../api/interfeces";
import Repeat from "../../../repeat";
import {
  InfinityIcon, YoutubeIcon, DeleteIcon, EditIcon, PauseIcon, PointsIcon
} from "../../../icons";
import useClickOutside from "../../../../utils/useClickOutside";

interface props {
  massHours: IMassHours;
}

const TimeTableLine = ({ massHours }: props) => {
  return <React.Fragment>
    {
      massHours.data.map((item, i) => (
        <tr className="timetable__line" key={i}>
          <td className="timetable__online">
            {item.online && <YoutubeIcon className="timetable__icon"/>}
          </td>
          <td className="timetable__time">{massHours.hour}</td>
          <td className="timetable__lang">{item.langCode}</td>
          <td className="timetable__comments">{item.info}</td>
          <td className="timetable__period">
            <div className="period">
              {
                item.startDate && item.endDate && item.days && <>
                  <span className="period__start">з </span>
                  <span className="period__date">{format(new Date(item.startDate), 'dd.MM.yyyy')}</span>
                  <br/>
                  <span className="period__end">па </span>
                  <span className="period__date">{format(new Date(item.endDate), 'dd.MM.yyyy')}</span>
                </>
              }
              {
                !item.endDate && item.days && <>
                  <InfinityIcon className="timetable__icon" />
                </>
              }
              {
                !item.days && <span className="period__date">Адзінкавая</span>
              }
            </div>
          </td>
          <td className="timetable__repeat">
            {
              item.days && <Repeat week={item.days} />
            }
          </td>
          <td className="timetable__btn">
            <div className="timetable__actions">
              <button className="timetable__btnIcon">
                <EditIcon className="timetable__icon" />
              </button>
              <button className="timetable__btnIcon">
                <DeleteIcon className="timetable__icon" />
              </button>
            </div>
          </td>
        </tr>
      ))
    }
  </React.Fragment>;
}
//
// interface propsTimeTableActions {
//   onSelect: (i: string) => void;
//   lineNumber: string | null;
// }
// const TimeTableActions = ({ onSelect, lineNumber }: propsTimeTableActions) => {
//   const [actionOpen, setActionOpen] = useState<boolean>(false);
//   const ref = useRef(null);
//
//   useClickOutside(ref, () => {
//     setActionOpen(false);
//     onSelect(null);
//   })
//
//   const handleClick = () => {
//     setActionOpen(!actionOpen);
//     onSelect(lineNumber);
//   }
//
//   return (
//     <section className="actions" ref={ref}>
//       <button onClick={handleClick} className="timetable__btnIcon">
//         <PointsIcon className="timetable__icon" />
//       </button>
//
//       <div className={`timetable__action ${actionOpen ? 'timetable__action--open' : ''}`} >
//         <button className="timetable__btnIcon">
//           <PauseIcon className="timetable__icon" />
//         </button>
//         <button className="timetable__btnIcon">
//           <EditIcon className="timetable__icon" />
//         </button>
//         <button className="timetable__btnIcon">
//           <DeleteIcon className="timetable__icon" />
//         </button>
//         <button onClick={handleClick} className={`timetable__btnIcon ${actionOpen ? 'timetable__btnIcon--open' : ''}`}>
//           <PointsIcon className="timetable__icon" />
//         </button>
//       </div>
//     </section>
//   )
// }


export default TimeTableLine;
