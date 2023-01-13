import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

import CreateNewButton from "./CreateNewButton";
import NavDropDown from "./DropDown";
import FuntoNavbar from "./Nav";
import SearchForm from "./SearchForm";
import useStickyHeader from "./StickyHeader";

export default function Header() {
  const brandLogo = "img/core-img/logo.png";
  const darkLogo = "img/core-img/logo-white.png";

  let [check] = useState(true);
  const sticky = useStickyHeader(10);
  const stickyClass = `${sticky && check ? "sticky-on" : ""}`;

  return (
    <header className={`header-area ${stickyClass} `}>
      <Navbar expand="lg">
        <Container>
          {/* Navbar Brand */}
          <Link className="navbar-brand" to="/">
            {/* <img
              className="light-logo"
              src={`${process.env.PUBLIC_URL}/${brandLogo}`}
              alt="Light"
            />
            <img
              className="dark-logo"
              src={`${process.env.PUBLIC_URL}/${darkLogo}`}
              alt="Dark"
            /> */}
            <h1 className="text-white">DecentiVize</h1>
          </Link>

          {/* Navbar Toggler */}
          <Navbar.Toggle className="navbar-toggler" aria-controls="funtoNav" />

          {/* Navbar */}
          <Navbar.Collapse id="funtoNav">
            {/* Navbar List */}
            <FuntoNavbar />

            {/* Header Meta */}
            <div className="header-meta d-flex align-items-center ms-lg-auto">
              <SearchForm />

              {/* Create New Button */}
              <CreateNewButton
                buttonColor="btn-warning"
                buttonURL="/connect-wallet"
                buttonText="Create New"
              />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
