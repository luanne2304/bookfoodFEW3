import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductList = ({ foods }) => {
  const navigate = useNavigate();

  const goDetail = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <>
      <h4 className="mt-4">Mặt hàng</h4>
      <Row>
        {foods.length > 0 ? (
          foods.map((food) => {
            // ✅ Tính trung bình số sao
            const totalStars = Number(food.totalStars) || 0;
            const totalRatings = Number(food.totalRatings) || 0;
            const averageRating = totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : "Chưa có";
            
            return (
              <Col key={food.id} md={3} className="mb-3">
                <Card>
                  <Card.Img
                    variant="top"
                    src={food.img || "https://via.placeholder.com/150"}
                    alt={food.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{food.name}</Card.Title>
                    <Card.Text>Giá: {food.price} VNĐ</Card.Text>
                    
                    {/* ⭐ Hiển thị số sao trung bình */}
                    <Card.Text>
                      {averageRating} ⭐ ({totalRatings})
                    </Card.Text>

                    <Button variant="success" onClick={() => goDetail(food.restaurantId)}>
                      Xem ngay
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p>Đang tải danh sách món ăn...</p>
        )}
      </Row>
    </>
  );
};

export default ProductList;
