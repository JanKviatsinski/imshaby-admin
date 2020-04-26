import React, { useEffect, useState } from 'react';
//import { fromUnixTime, format, parse } from 'date-fns';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import be from 'date-fns/locale/be';

import { IMassCreate } from "../../api/interfeces";

import Repeat from "../repeat";
import InfinityIcon from '/assets/images/infinity.svg';
import Modal from "../modal";

import './style.scss';


interface IProps {
  visible: boolean;
  mass: IMassCreate;
  onClose: (boolean) => void;
}

const CreateModalResult = ({ mass, visible, onClose }: IProps) => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [period, setPeriod] = useState<string>('');

  useEffect(() => {
    if(!mass) return;

    if (!mass.days) {
      const startDate = fromUnixTime(mass.singleStartTimestamp);
      setTitle(`Імша ${format(startDate, 'dd.MM.yyyy')} дададзена!`);
      setStartDate(format(startDate, 'dd MMMM yyyy, eeeeee', {locale: be}));
      setPeriod('адзінкавая');
    }else {
      setTitle('Сталая Імша дададзена!');
      const date = parse(mass.startDate, 'MM/dd/yyyy', new Date());
      setStartDate(format(date, 'dd MMMM yyyy, eeeeee', {locale: be}));

      if (mass.startDate && mass.endDate) {
        const endDate = parse(mass.endDate, 'MM/dd/yyyy', new Date());
        setPeriod(`${format(date, 'dd MMMM yyyy', {locale: be})} - ${format(endDate, 'dd MMMM yyyy', {locale: be})}`);
      }
    }
  }, [mass])

  if(!mass) return <></>
  return <>
    <Modal visible={visible}>
      <section className="modal">
        <header className="modal__header">
          <span className="modal__title">{title}</span>
        </header>

        <section className="modal__body">
          <section className="success">
            <ul className="success__list">
              <li className="success__item">
                <div className="success__title">Дата</div>
                <div className="success__value">{startDate}</div>
              </li>
              <li className="success__item">
                <div className="success__title">Мова</div>
                <div className="success__value">{mass.langCode}</div>
              </li>
              <li className="success__item">
                <div className="success__title">Каментарый</div>
                <div className="success__value">{mass.notes}</div>
              </li>
              <li className="success__item">
                <div className="success__title">Тэрмін дзеяння</div>
                <div className="success__value">
                  {
                    period ? period : <InfinityIcon />
                  }
                </div>
              </li>
              {
                mass.days && <>
                  <li className="success__item">
                    <div className="success__title">Паўтор</div>
                    <div className="success__value">
                      <Repeat week={mass.days} />
                    </div>
                  </li>
                </>
              }
            </ul>
          </section>
        </section>

        <footer className="modal__footer modal__footer--center">
          <button className="btn" onClick={onClose}>Ok</button>
        </footer>
      </section>
    </Modal>

  </>
};

export default CreateModalResult
