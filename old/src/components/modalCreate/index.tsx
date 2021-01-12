import React, { useState, useEffect } from 'react';

import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import {CloseIcon} from "../icons";


import {IMassCreate} from "../../api/interfeces";
import Modal from "../modal";
import be from "date-fns/locale/be";

interface IProps {
  visible: boolean;
  onClose: Function;
  onSave: Function;
}

const TIME_REGEXP = '^([01]\\d|2[0-3]):([0-5]\\d\\b)';

const CreateModal = ({ visible, onClose, onSave }: IProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [timeValid, setTimeValid] = useState<boolean>(false);
  const [days, setDays] = useState<number[]>([]);
  const [daysValid, setDaysValid] = useState<boolean>(true);
  const [isMassPeriodic, setMassPeriodic] = useState<boolean>(false);
  const [langCode, setLangCode] = useState<string>('беларуская');
  const [notes, setNotes] = useState<string>('');

  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setDaysValid(!!days.length);
  }, [days]);

  useEffect(() => {
    const isValid = new RegExp(TIME_REGEXP).test(time);
    setTimeValid(isValid);
  }, [time]);

  const handleChangeStartDate = (date: Date) => {
    setStartDate(date)
  };
  const handleChangeEndDate = (date: Date) => {
    setEndDate(date)
  };
  const handleChangeTime = (e: React.FormEvent<HTMLInputElement>) => {
    setTime(e.currentTarget.value);
  };
  const handleSelectDay = (day) => () => {
    const index = days.findIndex((i) => i === day);
    if (index === -1) {
      setDays([...days, day])
    }else {
      days.splice(index, 1);
      setDays([...days]);
    }
  };
  const validate = (): boolean => {
    const timeValid = new RegExp(TIME_REGEXP).test(time);
    const daysValid = isMassPeriodic ? !!days.length : true;

    setTimeValid(timeValid);
    setDaysValid(daysValid);

    return timeValid && daysValid
  };

  const handleCreate = () => {
    setSubmitted(true);
    if (!validate()) return;

    if (!isMassPeriodic) {
      const hourTime = time.split(':');
      let date = setHours(startDate, Number(hourTime[0]));
      date = setMinutes(date, Number(hourTime[1]));

      const data = {
        singleStartTimestamp: getTime(date) / 1000,
        notes,
        langCode,
      };
      onSave(data);
      return;
    }

    // periodic mass
    const data : IMassCreate = {
      langCode,
      days,
      notes,
      time,
      startDate: format(startDate, 'MM/dd/yyyy'),
    };

    if (endDate) {
      data.endDate = format(endDate, 'MM/dd/yyyy');
    }

    onSave(data);
    return;
  };


  return <>
    <Modal visible={visible}>
      <section className="modal">
        <header className="modal__header">
          <span className="modal__title">Дадаць Імшу</span>
          <button className="modal__header-close" onClick={() => onClose()}>
            <CloseIcon className="modal__header-closeIcon"/>
          </button>
        </header>

        <section className="modal__body">

          <section className="form">
            <section className="form__row form__row--column">
              <div className="form__col form__col--large">
                <div className="form__label">Дата*</div>
                <div className="form__field">

{/*                  <DatePicker selected={startDate} onChange={date => setStartDate(date)} />*/}

                </div>
              </div>
              <div className="form__col form__col--small">
                <div className={`form__label ${!timeValid && submitted ? 'form__label--invalid' : ''}`}>Час*</div>
                <div className="from__field">
                  <input type="text" onChange={handleChangeTime} value={time} placeholder="18:00"/>
                </div>
              </div>
            </section>


            <section className="form__row">
              <div className="form__col">
                <div className="form__label">Мова*</div>
                <div className="form__field">
                  <select onChange={(e) => setLangCode(e.target.value)}>
                    <option value="беларуская">беларуская</option>
                    <option value="польская">польская</option>
                    <option value="англійская">англійская</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="form__row">
              <div className="form__col">
                <label className="form__label">Каментарый</label>
                <div className="form__field">
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}/>
                </div>
              </div>
            </section>

            <section className="form__row">
              <div className="form__col">
                <div className="form__field">
                  <label className="form__label checkbox">
                    <input type="checkbox" className="checkbox__input" checked={isMassPeriodic} onChange={() => setMassPeriodic(!isMassPeriodic)}/>
                    <span className="checkbox__text">Паўтараць Імшу ?</span>
                  </label>
                </div>
              </div>
            </section>

            {
              isMassPeriodic && <>
                <section className="form__row">
                  <div className="form__col">
                    <div className={`form__label ${!daysValid && submitted ? 'form__label--invalid' : ''}`}>Дні*</div>
                    <div className="form__field">
                      <div className="days">
                        <ul className="days__list">
                          <li className={`days__item ${days.includes(7) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(7)}>Нд
                          </li>
                          <li className={`days__item ${days.includes(1) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(1)}>Пн
                          </li>
                          <li className={`days__item ${days.includes(2) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(2)}>Ат
                          </li>
                          <li className={`days__item ${days.includes(3) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(3)}>Ср
                          </li>
                          <li className={`days__item ${days.includes(4) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(4)}>Чц
                          </li>
                          <li className={`days__item ${days.includes(5) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(5)}>Пт
                          </li>
                          <li className={`days__item ${days.includes(6) ? 'days__item--active' : ''}`}
                              onClick={handleSelectDay(6)}>Сб
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="form__row">
                  <div className="form__col">
                    <div className="form__label">Скончыць</div>
                    <div className="form__field">
                      {/*<DateTimePicker onChange={handleChangeEndDate} selected={endDate}/>*/}
                    </div>
                  </div>
                </section>
              </>
            }

            <section className="form__row">
              <div className="form__col">
                <span className="form__noticed">* — Поле, абавязковае для запаўнення</span>
              </div>
            </section>
          </section>

        </section>

        <footer className="modal__footer">
          <button className="btn btn--empty" onClick={() => onClose()}>Адмена</button>
          <button className="btn" onClick={handleCreate}>Дадаць</button>
        </footer>
      </section>
    </Modal>
  </>
};

export default CreateModal
