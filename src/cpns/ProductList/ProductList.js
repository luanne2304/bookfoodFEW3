import React,{useState,useEffect} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import services from "../../utils/services";
import { useNavigate } from "react-router-dom";

const ProductList = ({foods}) => {
  const navigate = useNavigate(); 
  const goDetail=(id)=>{
    navigate(`/restaurant/${id}`)
  }
  

  return (
    <>
      <h4 className="mt-4">Mặt hàng </h4>
      <Row>
      {foods.length > 0 ? (
          foods.map((food) => (
          <Col key={food.id} md={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Mặt hàng {food.name}</Card.Title>
                <Card.Text>Giá: {food.price}</Card.Text>
                <Button variant="success"  onClick={() => goDetail(food.restaurantId)}>Xem ngay</Button>
              </Card.Body>
            </Card>
          </Col>
          ))
        ) : (
          <p>Đang tải danh sách món ăn...</p>
        )}
      </Row>
    </>
  );
};

export default ProductList;
