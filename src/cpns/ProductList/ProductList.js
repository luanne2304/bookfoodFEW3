import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

const products = [1, 2, 3, 4];

const ProductList = () => {
  return (
    <>
      <h4 className="mt-4">Mặt hàng phổ biến</h4>
      <Row>
        {products.map((item) => (
          <Col key={item} md={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>Mặt hàng {item}</Card.Title>
                <Card.Text>Giá: {item * 10}.000đ</Card.Text>
                <Button variant="success">Xem ngay</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
