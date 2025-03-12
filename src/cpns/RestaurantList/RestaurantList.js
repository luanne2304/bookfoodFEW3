import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const restaurants = ["Nhà hàng A", "Nhà hàng B", "Nhà hàng C", "Nhà hàng D"];



const RestaurantList = () => {
  const navigate = useNavigate(); 
  const goDetail=(id)=>{
    navigate(`/restaurant/${id}`)
    console.log("a")
  }
  
  return (
    <>
      <h4 className="mt-4">Nhà hàng nổi bật</h4>
      <Row>
        {restaurants.map((name, index) => (
          <Col key={index} md={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>Địa chỉ: Thành phố XYZ</Card.Text>
                <Button variant="info" onClick={() => goDetail(index)}>Xem ngay</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RestaurantList;
