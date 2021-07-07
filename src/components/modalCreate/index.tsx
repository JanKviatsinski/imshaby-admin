import React, { ChangeEvent, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import fromUnixTime from 'date-fns/fromUnixTime';
import parse from 'date-fns/parse';

import DateTimePicker from '../datapicker';
import { CloseIcon, YoutubeIcon } from '../icons';
import Modal from '../modal';

import {
  $mass, $massMode, $massUpdated, resetMassMode, saveMass, updateMassStore, $massError
} from '../../models/mass';
import { Mass, MassMode } from '../../models/mass/types';

const TIME_REGEXP = '^([01]\\d|2[0-3]):([0-5]\\d\\b)';
const NOTES_LIMIT = 300;
const DEFAULT_LANG = 'беларуская';

const CreateModal = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>('');
  const [timeValid, setTimeValid] = useState<boolean>(false);
  const [days, setDays] = useState<number[]>([]);
  const [daysValid, setDaysValid] = useState<boolean>(true);
  const [startDateValid, setStartDateValid] = useState<boolean>(true);
  const [isMassPeriodic, setMassPeriodic] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(false);
  const [langCode, setLangCode] = useState<string>(DEFAULT_LANG);
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const mass = useStore($mass);
  const massMode = useStore($massMode);
  const massUpdated = useStore($massUpdated);
  const massError = useStore($massError);
  const visible = massMode !== MassMode.HIDDEN && !massUpdated;

  useEffect(() => {
    setSubmitted(false);
    if (!visible) resetForm();
  }, [visible]);

  useEffect(() => {
    if (!mass) {
      resetForm();
      return;
    }

    if (mass.singleStartTimestamp) {
      setStartDate(fromUnixTime(mass.singleStartTimestamp));
      setTime(format(fromUnixTime(mass.singleStartTimestamp), 'HH:mm'));
    } else if (mass.startDate) {
      setStartDate(parse(mass.startDate, 'MM/dd/yyyy', new Date()));
      setTime(mass.time || '');
    } else {
      setStartDate(null);
      setTime(mass.time || '');
    }
    setEndDate(mass.endDate ? new Date(mass.endDate) : null);
    setDays(mass.days ? mass.days : []);
    setMassPeriodic(!!mass.days?.length);
    setOnline(!!mass.online);
    setLangCode(mass.langCode || '');
    setNotes(mass.notes || '');
  }, [mass]);

  useEffect(() => {
    validate();
  }, [days, time, startDate]);

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setTime('');
    setDays([]);
    setMassPeriodic(false);
    setOnline(false);
    setLangCode(DEFAULT_LANG);
    setNotes('');
    setSubmitted(false);
  };

  const handleChangeStartDate = (date: Date | null) => {
    setStartDate(date);
  };
  const handleChangeEndDate = (date: Date | null) => {
    setEndDate(date);
  };
  const handleChangeTime = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regExp = /^[0-9:]+$/;
    if (value.match(regExp) && value.length <= 5 || value.length === 0) {
      setTime(value);
    }
  };
  const handleSelectDay = (day: number) => () => {
    const index = days.findIndex((i) => i === day);
    if (index === -1) {
      setDays([...days, day]);
    } else {
      days.splice(index, 1);
      setDays([...days]);
    }
  };

  const handleChangeNotes = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (NOTES_LIMIT - e.target.value.length >= 0) {
      setNotes(e.target.value);
    }
  };

  const validate = (): boolean => {
    const timeValid = new RegExp(TIME_REGEXP).test(time);
    const daysValid = isMassPeriodic ? !!days.length : true;
    const startDateForSingleMass = !isMassPeriodic ? !!startDate : true;

    setTimeValid(timeValid);
    setDaysValid(daysValid);
    setStartDateValid(startDateForSingleMass);

    return timeValid && daysValid && startDateForSingleMass;
  };

  const handleCreate = () => {
    setSubmitted(true);
    if (!validate()) return;

    if (!isMassPeriodic) {
      if (!startDate) return;

      const hourTime = time.split(':');
      let date = setHours(startDate, Number(hourTime[0]));
      date = setMinutes(date, Number(hourTime[1]));

      const data = {
        singleStartTimestamp: getTime(date) / 1000,
        notes,
        langCode,
        online,
        id: mass?.id,
      };

      updateMassStore(data);
      saveMass();
      return;
    }

    // periodic mass
    const data : Mass = {
      langCode,
      days,
      notes,
      time,
      online,
      id: mass?.id,
    };

    if (startDate) {
      data.startDate = format(startDate, 'MM/dd/yyyy');
    }
    if (endDate) {
      data.endDate = format(endDate, 'MM/dd/yyyy');
    }
    updateMassStore(data);
    saveMass();
  };

  return (
    <>
      <Modal visible={visible} onClose={() => resetMassMode()}>
        <section className="modal__section">
          <header className="modal__header">
            {
            massMode === MassMode.CREATE
              ? <span className="modal__title">Дадаць Імшу</span>
              : <span className="modal__title">Змяніць Імшу</span>
          }
            <button className="modal__header-close" onClick={() => resetMassMode()}>
              <CloseIcon className="modal__header-closeIcon" />
            </button>
          </header>

          <section className="modal__body">

            <section className="form">
              <section className="form__row form__row--column">
                <div className="form__col form__col--large">
                  <div className={`form__label ${!startDateValid && submitted ? 'form__label--invalid' : ''}`}>Дата</div>
                  <div className="form__field">
                    <DateTimePicker selected={startDate} onChange={handleChangeStartDate} minDate={new Date()} maxDate={endDate} />
                  </div>
                </div>
                <div className="form__col form__col--small">
                  <div className={`form__label ${!timeValid && submitted ? 'form__label--invalid' : ''}`}>Час</div>
                  <div className="from__field">
                    <input type="text" onChange={handleChangeTime} value={time} placeholder="09:00" />
                  </div>
                </div>
                {
                  massError.error && <>
                    <section className="modal__error">
                      <span className="modal__error-text">{massError.message}</span>
                    </section>
                  </>
                }
              </section>


              <section className="form__row">
                <div className="form__col">
                  <div className="form__label">Мова</div>
                  <div className="form__field">
                    <select onChange={(e) => setLangCode(e.target.value)} value={langCode}>
                      <option value="беларуская">беларуская</option>
                      <option value="польская">польская</option>
                      <option value="англійская">англійская</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="form__row form__row--no-margin">
                <div className="form__col">
                  <label className="form__label">Каментарый (неабавязковае поле)</label>
                  <div className="form__field">
                    <textarea
                  rows={2}
                  value={notes}
                  onChange={handleChangeNotes}
                />
                    <span className="form__hint form__hint--right">
                  Засталося {' '}
                    {NOTES_LIMIT - notes.length}
                  {' '}
                  знакаў
                  </span>
                  </div>
                </div>
              </section>

              <section className="form__row form__row--small-margin">
                <div className="form__col">
                  <div className="form__field">
                    <label className="checkbox">
                  <input type="checkbox" className="checkbox__input" checked={isMassPeriodic} onChange={() => setMassPeriodic(!isMassPeriodic)} />
                  <span className="checkbox__text">Паўтараць Імшу</span>
                </label>
                  </div>
                </div>
              </section>

              {
              isMassPeriodic && (
              <>
                <section className="form__row form__row--small-margin">
                  <div className="form__col">
                    <div className={`form__label ${!daysValid && submitted ? 'form__label--invalid' : ''}`}>Дні</div>
                    <div className="form__field">
                      <div className="days">
                        <ul className="days__list">
                          <li
                            className={`days__item ${days.includes(1) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(1)}
                          >
                            Пн
                          </li>
                          <li
                            className={`days__item ${days.includes(2) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(2)}
                          >
                            Ат
                          </li>
                          <li
                            className={`days__item ${days.includes(3) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(3)}
                          >
                            Ср
                          </li>
                          <li
                            className={`days__item ${days.includes(4) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(4)}
                          >
                            Чц
                          </li>
                          <li
                            className={`days__item ${days.includes(5) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(5)}
                          >
                            Пт
                          </li>
                          <li
                            className={`days__item ${days.includes(6) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(6)}
                          >
                            Сб
                          </li>
                          <li
                            className={`days__item ${days.includes(7) ? 'days__item--active' : ''}`}
                            onClick={handleSelectDay(7)}
                          >
                            Нд
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="form__row">
                  <div className="form__col">
                    <div className="form__label form__label--no-margin">Скончыць (неабавязковае поле)</div>
                    <span className="form__hint">Калі тэрмін дзеяння невядомы — пакіньце поле пустым</span>
                    <div className="form__field">
                      <DateTimePicker selected={endDate} onChange={handleChangeEndDate} minDate={startDate || new Date()} />
                    </div>
                  </div>
                </section>
              </>
              )
            }

              <section className="form__row form__row--small-margin">
                <div className="form__col">
                  <div className="form__field">
                    <label className="checkbox">
                  <input type="checkbox" className="checkbox__input" checked={online} onChange={() => setOnline(!online)} />
                  <span className="checkbox__text">
                      {' '}
                      Відэа трансляцыя
                      <YoutubeIcon className="checkbox__youtube" />
                    </span>
                </label>
                    <span className="form__hint form__hint--padding-left">Спасылка на трансляцыю ў раздзеле «Парафія»</span>
                  </div>
                </div>
              </section>

            </section>

          </section>

          <footer className="modal__footer">
            <button className="btn btn-empty" onClick={() => resetMassMode()}>Адмена</button>
            {
            massMode === MassMode.CREATE
              ? <button className="btn" onClick={handleCreate}>Дадаць Імшу</button>
              : <button className="btn" onClick={handleCreate}>Змяніць Імшу</button>
          }

          </footer>
        </section>
      </Modal>
    </>
  );
};

export default CreateModal;
