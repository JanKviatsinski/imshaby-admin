import React, {useState} from "react";
import { IParish } from "../../api/interfeces";

import './style.scss';
import {updateParishInfo} from "../../api";
import { useAuth0 } from "@auth0/auth0-react";
import {EmailIcon, LinkIcon, MarkerIcon, PhoneIcon} from "../icons";

interface props {
  parish: IParish;
}

const ParishEdit = ({ parish } : props) => {
  const { getAccessTokenSilently } = useAuth0();
  const [phone, setPhone] = useState(parish.phone || '');
  const [website, setWebsite] = useState(parish.website || '');
  const [email, setEmail] = useState(parish.email || '');
  const [broadcastUrl, setBroadcastUrl] = useState(parish.broadcastUrl || '');
  const [editMode, setEditMode] = useState(false);

  const saveParish = async () => {
    const data: IParish = {
      ...parish,
      phone,
      website,
      email,
      broadcastUrl,
    }
    const token = await getAccessTokenSilently();
    const res = await updateParishInfo(token, data.id, data)
    console.log(res);
  }

  const handleEdit = () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }
    saveParish();
    setEditMode(false);
  };
  const handleCloseEdit = () => {
    setPhone(parish.phone || '');
    setWebsite(parish.website || '');
    setEmail(parish.email || '');
    setBroadcastUrl(parish.broadcastUrl || '');
    setEditMode(false);
  };



  return (
    <section className="parishEdit">
      <aside className="parishEdit__photo">
        <img src={`https://imsha.by/${parish.imgPath}`} alt={parish.name} className="parishEdit__img"/>
      </aside>


      <section className="parishEdit__content">

        <section className={`parishInfo ${editMode ? 'parishInfo--editMode' : ''}`}>
          <ul className="parishInfo__list">
            <li className="parishInfo__item">
              <div className="parishInfo__name">
                <MarkerIcon className="parishInfo__icon"/> Адрас
              </div>
              <div className="parishInfo__field">
                <span className="parishInfo__address">{parish.address}</span>
              </div>
            </li>
            <li className="parishInfo__item">
              <div className="parishInfo__name">
                <PhoneIcon className="parishInfo__icon"/> Тэлефон
              </div>
              <div className="parishInfo__field">
                <span className="parishInfo__value">{phone}</span>
                <input type="text" className="parishInfo__input" value={phone} onChange={(e) => setPhone(e.target.value)}/>
              </div>
            </li>
            <li className="parishInfo__item">
              <div className="parishInfo__name">
                <PhoneIcon className="parishInfo__icon"/> Вэбсайт
              </div>
              <div className="parishInfo__field">
                <span className="parishInfo__value">{website}</span>
                <input type="text" className="parishInfo__input" value={website} onChange={(e) => setWebsite(e.target.value)}/>
              </div>
            </li>
            <li className="parishInfo__item">
              <div className="parishInfo__name">
                <EmailIcon className="parishInfo__icon"/> Эл. пошта
              </div>
              <div className="parishInfo__field">
                <span className="parishInfo__value">{email}</span>
                <input type="text" className="parishInfo__input" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </li>

            <li className="parishInfo__item">
              <div className="parishInfo__name">
                <LinkIcon className="parishInfo__icon"/> Спасылка на айлайн-трансляцыю
              </div>
              <div className="parishInfo__field">
                <span className="parishInfo__value">{broadcastUrl}</span>
                <input type="text" className="parishInfo__input" value={broadcastUrl} onChange={(e) => setBroadcastUrl(e.target.value)}/>
              </div>
            </li>
          </ul>

          <section className="parishInfo__footer">
            { editMode && <button className="btn btn-empty" onClick={handleCloseEdit}>Адмена</button> }
            <button className="btn" onClick={handleEdit}>Змяніць</button>
          </section>

        </section>

      </section>
    </section>
  );
}

export default ParishEdit;
