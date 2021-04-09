import React, { useEffect, ReactNode, useRef, MutableRefObject } from 'react';
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
    // @ts-ignore: Object is possibly 'null'
    if (!(nodeRef.current).contains(e.target)) { // @ts-ignore: Object is possibly 'null'.
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
