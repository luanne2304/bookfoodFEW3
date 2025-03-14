import React, { useState,useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import services from "../../utils/services";

const CreateFood = () => {
  const [food, setFood] = useState({
    name: "",
    restaurantId: "",
    category: 0, // Mặc định chọn Main Dish
    price: "",
    isVegan: false,
    isGlutenFree: false,
  });
  const [categories,setCategories]=useState([])
  const [restaurants,setRestaurants]=useState([])

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFood({
      ...food,
      [name]: type === "radio" ? value === "true" : value, // Convert string "true"/"false" thành boolean
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const result = await services.createFood(
        food.name,
        food.restaurantId,
        food.category,
        food.price,
        food.isVegan,
        food.isGlutenFree
      );
      console.log("Giao dịch hoàn tất:", result);
      alert("Món ăn đã được thêm vào blockchain!");
  } catch (error) {
      alert("Thêm Món ăn thất bại!");
  }
  };

    useEffect(()=>{
      const fetch=async()=>{
        const res= await services.getAllCategories();
        if(res.length===0) return
        const formattedData = res.map((item) => ({
          id: item.id.toString(),
          name: item.name,
        }));
        setFood((prev) => ({ ...prev, category: formattedData[0].id }));
        setCategories(formattedData)
      }
      fetch()

      const fetch2=async()=>{
        const res= await services.getAllRestaurants();
        if(res.length===0) return
        const formattedData = res.map((item) => ({
          id: item.id.toString(),
          name: item.name,
        }));
        setFood((prev) => ({ ...prev, restaurantId: formattedData[0].id }));
        setRestaurants(formattedData)
      }
      fetch2()
    },[])
  

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
          <Form.Label>Tên nhà hàng</Form.Label>
          <Form.Select name="restaurantId" value={food.restaurantId} disabled={restaurants.length === 0} onChange={handleChange}>
                    {restaurants.length > 0 ? (
                restaurants.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              ) : (
                <option>Đang tải...</option>
              )}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Loại món ăn</Form.Label>
          <Form.Select name="category" value={food.category} disabled={categories.length === 0} onChange={handleChange}>
                    {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option>Đang tải...</option>
              )}
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
              checked={food.isVegan === true}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Không"
              type="radio"
              name="isVegan"
              value="false"
              checked={food.isVegan === false}
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
              checked={food.isGlutenFree === true}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="Không"
              type="radio"
              name="isGlutenFree"
              value="false"
              checked={food.isGlutenFree === false}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Button variant="primary" onClick={(e)=>handleSubmit(e)}>
          Tạo Món Ăn
        </Button>
      </Form>
    </Container>
  );
};

export default CreateFood;
