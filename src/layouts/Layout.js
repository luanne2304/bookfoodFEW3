import { Outlet } from "react-router-dom";
import React from 'react'
import HomeNavbar from "../cpns/HomeNavbar/HomeNavbar";
import Chatbox from "../cpns/Chatbox/Chatbox";
import { Container } from "react-bootstrap";

const Layout = () => {
  return (
  <>
  <HomeNavbar />
  <Container className="mt-3">
    <Outlet />
  </Container>    
  <Chatbox />
  </>
    )
  }

export default Layout