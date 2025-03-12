import React from "react";
import RestaurantList from "../../cpns/RestaurantList/RestaurantList";
import ProductList from "../../cpns/ProductList/ProductList";
import { Button,FormControl,Form } from "react-bootstrap";

const Home = () => {
    return(
    <>
    <Form className="d-flex">
      <FormControl type="search" placeholder="Tìm kiếm..." className="me-2" />
      <Button variant="primary">Tìm kiếm</Button>
     </Form>
      <ProductList />
      <RestaurantList />
  </>)
};

export default Home;