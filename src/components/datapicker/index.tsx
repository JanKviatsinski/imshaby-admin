import React from 'react';
import DatePicker from 'react-datepicker';
import be from 'date-fns/locale/be';

import './stylesheets/datepicker.scss';

interface IProps {
  onChange: (date: Date | null) => void;
  selected: Date | null;
}

const DateTimePicker = ({onChange, selected}: IProps) => {

  const handleChange = (date: Date | [Date, Date] | null) => {
    if (Array.isArray(date)) {
      return;
    }
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
