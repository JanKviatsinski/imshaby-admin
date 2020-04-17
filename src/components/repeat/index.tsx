import React from 'react';
import './style.scss'

interface IProps {
  week: number[];
}
const Repeat = ({week} : IProps) => {

  return <>
    <div className="repeat">
      <span className={`repeat__item ${week.includes(7) ? 'repeat__item--active' : ''}`}>Нд</span>
      <span className={`repeat__item ${week.includes(1) ? 'repeat__item--active' : ''}`}>Пн</span>
      <span className={`repeat__item ${week.includes(2) ? 'repeat__item--active' : ''}`}>Ат</span>
      <span className={`repeat__item ${week.includes(3) ? 'repeat__item--active' : ''}`}>Ср</span>
      <span className={`repeat__item ${week.includes(4) ? 'repeat__item--active' : ''}`}>Чц</span>
      <span className={`repeat__item ${week.includes(5) ? 'repeat__item--active' : ''}`}>Пт</span>
      <span className={`repeat__item ${week.includes(6) ? 'repeat__item--active' : ''}`}>Сб</span>
    </div>
  </>
}

export default Repeat;
