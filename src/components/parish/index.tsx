import React from "react";
import { IParish } from "../../api/interfeces";
import LimitTimer from "../limitTimer";

import './style.scss';
import {approveSchedule} from "../../api";
import { useAuth0 } from "@auth0/auth0-react";

interface props {
  parish: IParish;
}

const Parish = ({ parish } : props) => {
  const { getAccessTokenSilently } = useAuth0();



  const handleApprove = async () => {
    if(!parish?.id) {
      return;
    }
    const token = await getAccessTokenSilently();
    const approve = await approveSchedule(token, parish.id)
  }

  return (
    <section className="parish">
      <aside className="parish__photo">
        <img src={`https://imsha.by/${parish.imgPath}`} alt={parish.name} className="parish__img"/>
      </aside>
      <section className="parish__content">
        <div className="parishPeriod">
          <span className="parishPeriod__txt">Перыяд актуальнасці Імшаў</span>
          <span className="parishPeriod__value">{`${parish.updatePeriodInDays} дзён`}</span>
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
}

export default Parish;
