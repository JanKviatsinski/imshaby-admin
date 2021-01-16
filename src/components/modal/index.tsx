import React, {useEffect, ReactNode, useRef} from 'react';
import './style.scss';

interface IProps {
  visible: boolean;
  children?: ReactNode;
  onClose: () => void;
}

const Modal = ({ visible, children, onClose }: IProps) => {
  const nodeRef = useRef(null);

  const handleClick = (e: MouseEvent) => {
    console.log('handle click');
    if (!(nodeRef.current! as any).contains(e.target)) {
      console.log('close popup');
      onClose();
    }
  }

  useEffect(() => {
    console.log('sssss');
    document.addEventListener('click', handleClick, false);
    return document.removeEventListener('click', handleClick, false)
  }, []);



  useEffect(() => {
    document.querySelector('body')?.classList.toggle('fixed', visible);
  }, [visible]);

  if (!visible) return <></>;
  return <>
    <section className="modal-wrapper">
      <section className="modal" ref={nodeRef}>
        { children }
      </section>
    </section>
  </>
};

export default Modal
