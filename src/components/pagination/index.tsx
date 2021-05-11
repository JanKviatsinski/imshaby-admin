import React, { useEffect, useState } from 'react';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import be from 'date-fns/locale/be';
import { endOfWeek, startOfWeek } from 'date-fns';

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
  const [startPeriod, setStartPeriod] = useState<Date>(new Date());
  const [endPeriod, setEndPeriod] = useState<Date>(new Date());

  useEffect(() => {
    setStartPeriod(startOfWeek(schedule.startWeekDate, { weekStartsOn: 1 }));
    setEndPeriod(endOfWeek(schedule.startWeekDate, { weekStartsOn: 1 }));
  }, [schedule])

  const handlePrevWeek = () => changeDate(subDays(startPeriod, 7));
  const handleNextWeek = () => changeDate(addDays(endPeriod, 1));

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
            {format(startPeriod, 'd')}
            {' '}
            -
            {' '}
            {format(endPeriod, 'dd MMMM', { locale: be })}
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
