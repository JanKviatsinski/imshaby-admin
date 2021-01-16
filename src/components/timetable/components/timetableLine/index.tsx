import React, {useRef, useState} from "react";
import format from "date-fns/format";
import {IMassHours, IMassHoursData, ISchedule} from "../../../../api/interfeces";
import Repeat from "../../../repeat";
import {
  InfinityIcon, YoutubeIcon, DeleteIcon, EditIcon, PauseIcon, PointsIcon
} from "../../../icons";
import useClickOutside from "../../../../utils/useClickOutside";
import CreateModal from "../../../modalCreate";
import DeleteModal from "../../../modalDelete";

interface props {
  massHours: IMassHours;
  onDelete: (item: IMassHoursData) => void;
  onEdit: (id: string) => void;
}

const TimeTableLine = ({ massHours, onDelete, onEdit }: props) => {


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
                </>
              }
              {
                item.endDate && item.days && <>
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
                !item.days && <span className="period__date">адзінкавая</span>
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
              <button className="timetable__btnIcon" onClick={()=> onEdit(item.id)}>
                <EditIcon className="timetable__icon" />
              </button>
              <button className="timetable__btnIcon" onClick={()=> onDelete(item)}>
                <DeleteIcon className="timetable__icon" />
              </button>
            </div>
          </td>
        </tr>
      ))
    }
  </React.Fragment>;
}

export default TimeTableLine;
