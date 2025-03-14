import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate(); 
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">BookFood</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={()=> navigate(`/home`)} >Trang chủ</Nav.Link>
            <Nav.Link onClick={()=> navigate(`/OrderHistory`)}>Lịch sử mua</Nav.Link>
            <Nav.Link onClick={()=> navigate(`/CreateRestaurant`)} >Tạo nhà hàng</Nav.Link>
            <Nav.Link onClick={()=> navigate(`/CreateCategory`)}>Tạo phân loại thức ăn</Nav.Link>
            <Nav.Link onClick={()=> navigate(`/CreateFood`)}>Tạo Món ăn</Nav.Link>
            <Nav.Link onClick={()=> navigate(`/OrderManagement`)}>Quản lý danh sách đơn hàng</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HomeNavbar;
