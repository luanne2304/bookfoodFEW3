import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import services from "../../utils/services";

const FoodlistOrder = ({ restaurantId, setCart }) => {
  const [quantities, setQuantities] = useState({});
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [listRating, setListRating] = useState([]); // State để lưu danh sách đánh giá

  const handleChange = (item, quantity) => {
    const newValue = Number(quantity) > 0 ? Number(quantity) : 1;
    setQuantities((prev) => ({
      ...prev,
      [item]: newValue,
    }));
  };

  const addFood = (item) => {
    if (!quantities[item.id] || quantities[item.id] <= 0) {
      quantities[item.id] = 1;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((food) => food.id === item.id);
      if (existingItem) {
        return prevCart.map((food) =>
          food.id === item.id ? { ...food, quantity: quantities[item.id] } : food
        );
      } else {
        return [...prevCart, { ...item, quantity: quantities[item.id] }];
      }
    });
    console.log(`Đã thêm món ${item.name} với số lượng:`, quantities[item.id]);
  };

  const handleShowModal = async (id) => {
    try {
      const res = await services.getRatingByID(id);
      console.log("Danh sách đánh giá:", res);

      setListRating(res); // Cập nhật danh sách đánh giá vào state
      setSelectedFood(foods.find((food) => food.id === id));
      setShowModal(true);
    } catch (e) {
      console.error("Lỗi khi lấy danh sách đánh giá:", e);
    }
  };

  useEffect(() => {
    const fetchDataFoods = async () => {
      try {
        const res = await services.getAllFoods();
        const filteredData = res
          .filter((food) => food.restaurantId == restaurantId)
          .map((food) => ({
            id: food.id.toString(),
            name: food.name,
            price: parseInt(food.price),
            isVegan: food.isVegan,
            isGlutenFree: food.isGlutenFree,
            totalRatings: food.totalRatings,
            totalStars: food.totalStars,
            restaurantId: food.restaurantId,
            categoryId: food.categoryId,
          }));

        setFoods(filteredData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách món ăn:", error);
      }
    };

    fetchDataFoods();
  }, [restaurantId]);

  return (
    <>
      <Row>
        {foods.map((item) => (
          <Col md={3} className="mb-3" key={item.id}>
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Giá: {item.price} VNĐ</Card.Text>
                <Form.Group className="mb-2">
                  <Form.Control
                    type="number"
                    value={quantities[item.id] || 1}
                    min="0"
                    onChange={(e) => handleChange(item.id, e.target.value)}
                  />
                </Form.Group>

                <Button variant="success" onClick={() => addFood(item)}>Thêm món</Button>
                <Button variant="warning" className="ms-2" onClick={() => handleShowModal(item.id)}>
                  Xem đánh giá
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal hiển thị đánh giá */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá món ăn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFood ? (
            <>
              <h5>{selectedFood.name}</h5>
              {listRating.length > 0 ? (
        (() => {
          const totalStars = listRating.reduce((sum, r) => sum + Number(r.stars), 0); // Chuyển về số thường
          const averageRating = totalStars / listRating.length;
          const formattedRating = averageRating % 1 === 0 ? averageRating.toFixed(0) : averageRating.toFixed(1);
          return (
            <p><strong>Điểm đánh giá:</strong> {formattedRating}⭐ ({listRating.length} đánh giá)</p>
          );
        })()
      ) : (
        <p><strong>Điểm đánh giá:</strong> Chưa có đánh giá</p>
      )}

              <h6>Danh sách đánh giá:</h6>
              {listRating.length > 0 ? (
                <ul>
                  {listRating.map((review, index) => (
                    <li key={index}>
                      <p><strong>User:</strong> {review.user}</p>
                      <p><strong>Rating:</strong> {review.stars}⭐</p>
                      <p><strong>Nhận xét:</strong> {review.review}</p>
                      <hr />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}
            </>
          ) : (
            <p>Không có thông tin đánh giá.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FoodlistOrder;
