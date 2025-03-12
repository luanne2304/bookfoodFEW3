import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import services from "../../utils/services";

const CreateRestaurant = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    houseNumber: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    ownerId: "",
  });

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit =async  (e) => {
    e.preventDefault();
    try {
        const result = await services.createRestaurant(
          restaurant.name,
          restaurant.houseNumber,
          restaurant.street,
          restaurant.ward,
          restaurant.district,
          restaurant.city,
          restaurant.ownerId
        );
        console.log("Giao dịch hoàn tất:", result);
        alert("Nhà hàng đã được thêm vào blockchain!");
    } catch (error) {
        alert("Thêm nhà hàng thất bại!");
    }
  };

  return (
    <>
      <h2>🛠️ Tạo Nhà Hàng</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên nhà hàng</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số nhà</Form.Label>
          <Form.Control
            type="text"
            name="houseNumber"
            value={restaurant.houseNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đường</Form.Label>
          <Form.Control
            type="text"
            name="street"
            value={restaurant.street}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phường</Form.Label>
          <Form.Control
            type="text"
            name="ward"
            value={restaurant.ward}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quận</Form.Label>
          <Form.Control
            type="text"
            name="district"
            value={restaurant.district}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thành phố</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={restaurant.city}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ID Chủ Nhà Hàng</Form.Label>
          <Form.Control
            type="text"
            name="ownerId"
            value={restaurant.ownerId}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Tạo Nhà Hàng
        </Button>
      </Form>
    </>
  );
};

export default CreateRestaurant;
