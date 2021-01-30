import React from "react";
import { NavLink } from "react-router-dom";
import { LogoIcon, BulbIcon, ClockIcon, HomeIcon } from "../icons";

import './style.scss';

interface props {
  header: React.ReactNode;
  content: React.ReactNode;
}

const Section = ({ header, content } : props) => {
  return (
    <section className="block container">
      <header className="block__header">{ header }</header>
      <section className="block__content">{ content }</section>
    </section>
  );
}

export default Section;
