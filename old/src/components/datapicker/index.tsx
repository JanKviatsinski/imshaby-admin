import React from 'react';
import DatePicker from 'react-datepicker';
import be from 'date-fns/locale/be';

import './stylesheets/datepicker.scss';

interface IProps {
  onChange: (date: Date) => void;
  selected: Date;
}

const DateTimePicker = ({onChange, selected}: IProps) => {

  const handleChange = (date) => {
    onChange(date);
  };

  return <>
    <DatePicker
      locale={be}
      dateFormat="dd/MM/yyyy"
      selected={selected}
      onChange={date => handleChange(date)}
    />
  </>
};

export default DateTimePicker
