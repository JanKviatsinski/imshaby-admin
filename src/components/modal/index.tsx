import React, { useState, useEffect, ReactNode } from 'react';
import './style.scss';

interface IProps {
  visible: boolean;
  children?: ReactNode
}

const Modal = ({ visible, children}: IProps) => {

  useEffect(() => {
    document.querySelector('body').classList.toggle('fixed', visible);
  }, [visible]);

  if (!visible) return <></>;
  return <>
    <section className="modal-wrapper">
      { children }
    </section>
  </>
};

export default Modal
