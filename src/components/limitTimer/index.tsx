import React, { useEffect, useState } from "react";
import differenceInSeconds from "date-fns/differenceInSeconds";

interface props {
  lastDate: Date;
  limitDays: number;
  attentionClass?: string;
}

interface IDisplayDuration {
  days: string | number;
  hours: string | number;
  minutes: string | number;
  seconds: string | number;
}

const LimitTimer = ({ lastDate, limitDays, attentionClass } : props) => {
  const [duration, setDuration] = useState<IDisplayDuration | null>(null);
  const [attention, setAttention] = useState(false);

  useEffect(() => {
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculate = () => {
    const secondsBetween = Math.abs(differenceInSeconds(new Date(), lastDate));

    const days = Math.floor(secondsBetween / 3600 / 24);
    const hours = Math.floor(secondsBetween % (3600 * 24) / 3600);
    const minutes = Math.floor(secondsBetween % 3600 / 60);
    const seconds = Math.floor(secondsBetween % 60);

    setDuration({
      days: days > 9 ? days : '0' + days,
      hours: hours > 9 ? hours : '0' + hours,
      minutes: minutes > 9 ? minutes : '0' + minutes,
      seconds: seconds > 9 ? seconds : '0' + seconds,
    });
    setAttention(days >= limitDays);
  }


  if (!duration) return <></>
  return (
    <span className={attention ? attentionClass : ''}>
      {`${duration?.days} : ${duration?.hours} : ${duration?.minutes} : ${duration?.seconds}`}
    </span>
  );
}

export default LimitTimer;
