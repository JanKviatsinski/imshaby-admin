import React from 'react';
import Modal from "../modal";
import './style.scss';


interface IProps {
  visible: boolean;
  onClose: () => void;
}

const ApproveModalResult = ({ visible, onClose }: IProps) => {

  return <>
    <Modal visible={visible}>
      <section className="modal">
        <header className="modal__header">
          <span className="modal__title">Расклад пацверджаны</span>
        </header>

        <section className="modal__body">
          {/*<section className="success">
            <div className="success__title">Мова</div>
          </section>*/}
        </section>

        <footer className="modal__footer modal__footer--center">
          <button className="btn" onClick={onClose}>Ok</button>
        </footer>
      </section>
    </Modal>
  </>
};

export default ApproveModalResult
