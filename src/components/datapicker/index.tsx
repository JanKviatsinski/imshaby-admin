import React, {SyntheticEvent} from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import be from 'date-fns/locale/be';

import './stylesheets/datepicker.scss';

interface IProps {
  onChange: (date: Date | null) => void;
  selected: Date | null;
  minDate?: Date | null,
  maxDate?: Date | null,
}

const DateTimePicker = ({onChange, selected, minDate, maxDate}: IProps) => {

  const handleChange = (date: Date | [Date, Date] | null, e: SyntheticEvent) => {
    console.log('handleChangehandleChangehandleChangehandleChange');
    e.stopPropagation();
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
      onChange={handleChange}
      minDate={minDate}
      maxDate={maxDate}
    />
  </>
};

export default DateTimePicker
