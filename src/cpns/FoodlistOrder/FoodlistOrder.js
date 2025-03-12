import React,{useState} from "react";
import { Row, Col, Card, Button,Form } from "react-bootstrap";

const FoodlistOrder = ({ restaurantId,setCart }) => {
    const [quantities, setQuantities] = useState({});
    const products = [
        { id: 1, name: "Phở Bò", price: 50000 },
        { id: 2, name: "Bún Chả", price: 45000 },
        { id: 3, name: "Cơm Tấm", price: 40000 },
        { id: 4, name: "Gỏi Cuốn", price: 30000 },
      ];
    const handleChange=(item, quantity)=>{
        const newValue = Number(quantity) > 0 ? Number(quantity) : 1;
        setQuantities((prev) => ({
          ...prev,
          [item]: newValue,
        }));
    }

    const addFood=(item)=>{
        if (!quantities[item.id] || quantities[item.id] <= 0) {
            quantities[item.id]=1;
          }
      
          setCart((prevCart) => {
            // Tìm xem món ăn này đã có trong giỏ hàng chưa
            const existingItem = prevCart.find((food) => food.id === item.id);
        
            if (existingItem) {
              // Nếu có, cập nhật số lượng
              return prevCart.map((food) =>
                food.id === item.id
                  ? { ...food, quantity: quantities[item.id]  }
                  : food
              );
            } else {
              // Nếu chưa có, thêm món mới
              return [...prevCart, { ...item, quantity:quantities[item.id]  }];
            }
          });
          console.log(`Đã thêm món ${item} với số lượng:`, quantities[item]);
    }

  return (
    <Row>
     {products.map((item) => (
        <Col  md={3} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>Giá: {item.price}</Card.Text>
              <Form.Group className="mb-2">
                <Form.Control
                  type="number"
                  value={quantities[item.id] || 1}
                  min="0"
                  onChange={(e) => handleChange(item.id, e.target.value)}
                />
              </Form.Group>

              <Button  variant="success" onClick={()=>addFood(item)}>Thêm món</Button>
            </Card.Body>
          </Card>   
        </Col>
      ))}
    </Row>
  );
};

export default FoodlistOrder;
