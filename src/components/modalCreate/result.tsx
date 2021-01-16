import React, { useEffect, useState } from 'react';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import be from 'date-fns/locale/be';

import { IMassCreate } from "../../api/interfeces";

import Repeat from "../repeat";
///import InfinityIcon from '/assets/images/infinity.svg';
import Modal from "../modal";
import {YoutubeIcon, InfinityIcon} from "../icons";
import './style.scss';



interface IProps {
  visible: boolean;
  mass: IMassCreate | null;
  onClose: () => void;
}

const CreateModalResult = ({ mass, visible, onClose }: IProps) => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [period, setPeriod] = useState<string>('');

  useEffect(() => {
    if(!mass) return;


    if (!mass.days && mass.singleStartTimestamp) {
      const startDate = fromUnixTime(mass.singleStartTimestamp);
      setStartDate(startDate);
      setTitle(`Адзінкавая Імша ${format(startDate, 'dd.MM.yyyy')} дададзена!`);
      setPeriod('адзінкавая');
    }else {
      if (mass.startDate) {
        const startDate = parse(mass.startDate, 'MM/dd/yyyy', new Date());
        setStartDate(startDate);
        setTitle('Сталая Імша дададзена!');
      }
      if (mass.startDate && mass.endDate) {
        const endDate = parse(mass.endDate, 'MM/dd/yyyy', new Date());
        setPeriod(`${format(startDate, 'dd MMMM yyyy', {locale: be})} - ${format(endDate, 'dd MMMM yyyy', {locale: be})}`);
      }
    }
  }, [mass])

  if(!mass) return <></>
  return <>
    <Modal visible={visible} onClose={() => onClose()}>
      <section className="modal__section">
        <header className="modal__header">
          <span className="modal__title">{title}</span>
        </header>

        <section className="modal__body">
          <section className="success">
            <ul className="success__list">
              <li className="success__item">
                <div className="success__title">Дата</div>
                <div className="success__value">{format(startDate, 'dd MMMM yyyy, eeeeee', {locale: be})}</div>
              </li>
              <li className="success__item">
                <div className="success__title">Час</div>
                <div className="success__value">
                  {format(startDate, 'hh.mm')}
                  {mass.online && <YoutubeIcon className="success__youtube"/>}
                </div>
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
                    period ? period : <InfinityIcon className="success__infinity"/>
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
          <button className="btn btn-small" onClick={onClose}>Ok</button>
        </footer>
      </section>
    </Modal>

  </>
};

export default CreateModalResult
