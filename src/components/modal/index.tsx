import React, { useEffect, ReactNode, useRef } from 'react';
import { useOutsideClick } from '../../utils/useClickOutside';

import './style.scss';

interface IProps {
  visible: boolean;
  children?: ReactNode;
  onClose: () => void;
}

const Modal = ({ visible, children, onClose }: IProps) => {
  const nodeRef = useRef(null);

  useOutsideClick(nodeRef, () => {
    onClose();
  });

  const handleClick = (e: MouseEvent) => {
    if (!(nodeRef.current! as any).contains(e.target)) {
      console.log('close popup');
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick, false);
    return document.removeEventListener('click', handleClick, false);
  }, []);

  useEffect(() => {
    document.querySelector('body')?.classList.toggle('fixed', visible);
  }, [visible]);

  if (!visible) return <></>;
  return (
    <>
      <section className="modal-wrapper">
        <section className="modal" ref={nodeRef}>
          { children }
        </section>
      </section>
    </>
  );
};

export default Modal;
