import React, { useEffect,useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const RestaurantList = ({restaurants}) => {
  const navigate = useNavigate(); 
  const goDetail=(id)=>{
    navigate(`/restaurant/${id}`)
  }


  return (
    <>
      <h4 className="mt-4">Nhà hàng </h4>
      <Row>
      {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
          <Col key={restaurant.id} md={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{restaurant.name}</Card.Title>
                <Card.Text>Địa chỉ: {restaurant.district+", "+restaurant.city}</Card.Text>
                <Button variant="info" onClick={() => goDetail(restaurant.id)}>Xem ngay</Button>
              </Card.Body>
            </Card>
          </Col>
          ))
        ) : (
          <p>Đang tải danh sách nhà hàng...</p>
        )}
      </Row>
    </>
  );
};

export default RestaurantList;
