import React, { useState, useEffect, ReactNode } from 'react';
import './style.scss';
interface IProps {
  visible: boolean;
  children?: ReactNode
}



const Modal = ({ visible, children}: IProps) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(visible);
    document.querySelector('body').classList.toggle('fixed', visible);
  }, [visible]);

  if (!isVisible) return <></>;
  return <>
    <section className="modal-wrapper">
      { children }
    </section>
  </>
};

export default Modal
