import React, { useState, useEffect } from 'react';
import DateTimePicker from './../datapicker';
import format from 'date-fns/format';
import be from 'date-fns/locale/be';
import CloseIcon from '/assets/images/close.svg';
import {IMassCreate} from "../../api/interfeces";
import Modal from "../modal";

interface IProps {
  visible: boolean;
  onClose: Function;
  onSave: Function;
  mass: IMassCreate;
  date: Date;
}

enum Radio {
  one ,
  feature,
  period
}

const DeleteModal = ({ visible, onClose, onSave, mass, date }: IProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [value, setValue] = useState<string>(Radio.one);
  const [title, setTitle] = useState<string>('');


  useEffect(() => {
    if(!mass) return;

    if(mass.days) {
      setTitle(`Выдаліць абраную Імшу?`);
    }else {
      setTitle(`Выдаліць Імшу ${format(date, 'dd MMMM yyyy, eeeeee', {locale: be})} ?`);
    }

  }, [mass])


  const handleChange = (type) => setValue(type);

  const handleSubmit = () => {
    if(!mass.days) {
      onSave(mass.id);
      return;
    }

    const period = {
      from: '',
      to: '',
    }
    switch (value) {
      case Radio.one:
        period.from = format(date, 'dd-MM-yyyy');
        period.to = format(date, 'dd-MM-yyyy');
        break;
      case Radio.feature:
        period.from = format(date, 'dd-MM-yyyy');
        period.to = '';
        break;
      case Radio.period:
        period.from = format(startDate, 'dd-MM-yyyy');
        period.to = format(endDate, 'dd-MM-yyyy');
        break;
    }

    onSave(mass.id, period);
  }

  if (!mass) return <></>;
  return <>
    <Modal visible={visible}>
      <section className="modal">
        <header className="modal__header">
          <span className="modal__title">Выдаліць Імшу</span>
          <button className="modal__header-close" onClick={() => onClose()}>
            <CloseIcon className="icon"/>
          </button>
        </header>

        <section className="modal__body">
          <section className="delete">
            <div className="delete__title">{title}</div>
            {
              mass.days && <>
                <ul className="delete__list">
                  <li className="delete__item">
                <span className="delete__radio">
                  <label className="radio">
                    <input type="radio" className="radio__input" name="delete" onChange={()=> handleChange(Radio.one)} value={Radio.one} checked={value === Radio.one}/>
                    <span className="radio__text">толькі гэтую Імшу {format(date, 'dd.MM.yyyy')}</span>
                  </label>
                </span>
                  </li>
                  <li className="delete__item">
                <span className="delete__radio">
                  <label className="radio">
                    <input type="radio" className="radio__input" name="delete" onChange={()=> handleChange(Radio.feature)} value={Radio.feature} checked={value === Radio.feature}/>
                    <span className="radio__text">гэтую і ўсе наступныя</span>
                  </label>
                </span>
                  </li>
                  <li className="delete__item">
                <span className="delete__radio">
                  <label className="radio">
                    <input type="radio" className="radio__input" name="delete" onChange={()=> handleChange(Radio.period)} value={Radio.period} checked={value === Radio.period}/>
                    <span className="radio__text">выдаліць на вызначаны перыяд</span>
                  </label>
                </span>
                  </li>
                </ul>
              </>
            }

            {
              mass.days && value === Radio.period && <>
                <section className="delete__period">
                  <div className="delete__start">
                    <span className="delete__label">Пачатак</span>
                    <DateTimePicker onChange={(date) => setStartDate(date)} selected={startDate}/>
                  </div>
                  <div className="delete__end">
                    <span className="delete__label">Канец(уключна)</span>
                    <DateTimePicker onChange={(date) => setEndDate(date)} selected={endDate}/>
                  </div>
                </section>
              </>
            }
          </section>
        </section>

        <footer className="modal__footer">
          <button className="btn btn--empty" onClick={() => onClose()}>Адмена</button>
          <button className="btn" onClick={handleSubmit}>Выдаліць</button>
        </footer>
      </section>
    </Modal>
  </>
};

export default DeleteModal
