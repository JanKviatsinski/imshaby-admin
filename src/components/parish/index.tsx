import React from 'react';
import { useStore } from 'effector-react';
import { useToasts } from 'react-toast-notifications';
import { formatDate } from '../../utils/formatDate';

import { LimitTimer } from '../limitTimer';
import Loading from '../loading';

import { approveSchedule } from '../../models/schedule';
import { $parish } from '../../models/parish';

import './style.scss';

export const Parish = () => {
  const parish = useStore($parish);
  const { addToast } = useToasts();

  const handleApprove = async () => {
    approveSchedule();
    addToast('Рассклад пацверджаны');
  };

  if (!parish) return <Loading />;
  return (
    <section className="parish">
      <aside className="parish__photo">
        <img src={`https://imsha.by/${parish.imgPath}`} alt={parish.name} className="parish__img" />
      </aside>
      <section className="parish__content">
        <div className="parishPeriod">
          <span className="parishPeriod__txt">Перыяд актуальнасці Імшаў</span>
          <span className="parishPeriod__value">{formatDate(parish.updatePeriodInDays)}</span>
        </div>
        <div className="parishPeriod">
          <span className="parishPeriod__txt">Прайшло</span>
          <span className="parishPeriod__value">
            <LimitTimer
              lastDate={parish.lastMassActualDate}
              limitDays={parish.updatePeriodInDays}
              attentionClass="parishPeriod__value--attention"
            />
          </span>
          <span className="parishPeriod__txt">з моманту пацверджання актуальнасці раскладу</span>
        </div>

        <div className="parishApprovePeriod">
          <button className="btn" onClick={handleApprove}>
            Пацвердзіць актуальнасць раскладу
          </button>
        </div>

      </section>
    </section>
  );
};
