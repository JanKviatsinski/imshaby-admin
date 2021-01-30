import React from "react";
import './style.scss';
import {CloseIcon} from "../icons";

interface IProps {
  appearance: string;
  children: React.ReactNode;
  onDismiss: () => void;
}

const Snackbar = ({ appearance, children, onDismiss, ...props }: IProps) => {

  const handleClose = () => {
    onDismiss();
  }

  return (
    <div className="snackbar">
      <div className="snackbar__content">
        <div className="snackbar__text">{children}</div>
        <button className="snackbar__close" onClick={handleClose}>
          <CloseIcon className="snackbar__icon"/>
        </button>
      </div>
    </div>
  );
}

export default Snackbar;
