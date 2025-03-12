import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import services from "../../utils/services";

const CreateFood = () => {
  const [food, setFood] = useState({
    name: "",
    restaurantId: "",
    category: "Main Dish", // Mặc định chọn Main Dish
    price: "",
    isVegan: "false",
    isGlutenFree: "false",
  });

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const result = await services.createFood(
        food.name,
        food.restaurantId,
        1,
        food.price,
        food.isVegan,
        food.isGlutenFree
      );
      console.log("Giao dịch hoàn tất:", result);
      alert("Món ăn đã được thêm vào blockchain!");
  } catch (error) {
      alert("Thêm Món ăn thất bại!");
  }
    setFood({
      name: "",
      restaurantId: "",
      category: "Main Dish",
      price: "",
      isVegan: "false",
      isGlutenFree: "false",
    });
  };

  return (
    <Container className="mt-4">
      <h2>🍽️ Tạo Món Ăn</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên món ăn</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={food.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ID Nhà Hàng</Form.Label>
          <Form.Control
            type="text"
            name="restaurantId"
            value={food.restaurantId}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Loại món ăn</Form.Label>
          <Form.Select name="category" value={food.category} onChange={handleChange}>
            <option value="Main Dish">Món chính</option>
            <option value="Appetizer">Khai vị</option>
            <option value="Dessert">Tráng miệng</option>
            <option value="Drink">Đồ uống</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá (VNĐ)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={food.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thuần chay</Form.Label>
          <div>
            <Form.Check
              inline
              label="Có"
              type="radio"
              name="isVegan"
              value="true"
              checked={food.isVegan === "true"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Không"
              type="radio"
              name="isVegan"
              value="false"
              checked={food.isVegan === "false"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Chứa Gluten-Free</Form.Label>
          <div>
            <Form.Check
              inline
              label="Có"
              type="radio"
              name="isGlutenFree"
              value="true"
              checked={food.isGlutenFree === "true"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Không"
              type="radio"
              name="isGlutenFree"
              value="false"
              checked={food.isGlutenFree === "false"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Tạo Món Ăn
        </Button>
      </Form>
    </Container>
  );
};

export default CreateFood;
