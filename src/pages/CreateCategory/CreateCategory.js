import React, { useState,useEffect } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import services from "../../utils/services";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  // Xử lý thêm loại thức ăn
  const handleAddCategory = async(e) => {
    if (categoryName.trim() === "") {
      alert("Vui lòng nhập tên loại thức ăn!");
      return;
    }
    e.preventDefault();
      try {
        const result = await services.createCategory(
          categoryName
        );
        console.log("Giao dịch hoàn tất:", result);
        alert("phân loại đã được thêm vào blockchain!");
    } catch (error) {
        alert("Thêm phân loại thất bại!");
    }
    setCategories([...categories, categoryName]); // Thêm vào danh sách
    setCategoryName(""); // Reset input
  };

  return (
    <Container className="mt-4">
      <h3>Thêm loại thức ăn</h3>

      {/* Form nhập tên loại thức ăn */}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tên loại thức ăn</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên loại thức ăn"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAddCategory}>
          Thêm loại
        </Button>
      </Form>

      {/* Hiển thị danh sách loại thức ăn đã thêm */}
      {categories.length > 0 && (
        <>
          <h4 className="mt-4">Danh sách loại thức ăn</h4>
          <ListGroup>
            {categories.map((category, index) => (
              <ListGroup.Item key={index}>{category}</ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </Container>
  );
};

export default CreateCategory;
