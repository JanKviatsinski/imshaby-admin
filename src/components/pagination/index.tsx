import React from 'react';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import be from 'date-fns/locale/be';
import { endOfWeek } from 'date-fns';

import { LeftArrowIcon, RightArrowIcon } from '../icons';
import Loading from '../loading';

import { WeekSchedule } from '../../models/schedule/types';

import './style.scss';

interface props {
  schedule: WeekSchedule;
  changeDate: (date: Date) => void;
  isCurrentWeek: boolean;
}

const Pagination = ({ schedule, changeDate, isCurrentWeek }: props) => {
  const handlePrevWeek = () => changeDate(subDays(schedule.startWeekDate, 7));
  const handleNextWeek = () => changeDate(addDays(schedule.startWeekDate, 7));

  if (!schedule) return <Loading />;
  return (
    <section className="pagination">
      {
        !isCurrentWeek && (
        <>
          <button className="pagination__left" onClick={handlePrevWeek} type="button">
            <LeftArrowIcon className="pagination__icon" />
          </button>
        </>
        )
      }
      {
        !!schedule.schedule.length && (
        <>
          <span className="pagination__date">
            {format(schedule.schedule[0].date, 'd')}
            {' '}
            -
            {format(schedule.schedule[schedule.schedule.length - 1].date, 'dd MMMM', { locale: be })}
          </span>
        </>
        )
      }
      {
        !schedule.schedule.length && (
        <>
          <span className="pagination__date">
            {format(new Date(), 'dd MMMM', { locale: be })}
            {' '}
            -
            {' '}
            {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'dd MMMM', { locale: be })}
          </span>
        </>
        )
      }
      <button className="pagination__right" onClick={handleNextWeek} type="button">
        <RightArrowIcon className="pagination__icon" />
      </button>

    </section>
  );
};

export default Pagination;
