import React,{useState,useEffect} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import services from "../../utils/services";
import { useNavigate } from "react-router-dom";

const products = [1, 2, 3, 4];

const ProductList = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate(); 
  const goDetail=(id)=>{
    navigate(`/restaurant/${id}`)
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await services.getAllFoods();
        console.log(res);

        const formattedData = res.map((food) => ({
          id: food.id.toString(),
          name: food.name,
          price: parseInt(food.price),
          isVegan: food.isVegan,
          isGlutenFree: food.isGlutenFree,
          totalRatings:food.totalRatings,
          totalStars:food.totalStars,
          restaurantId:food.restaurantId,
          categoryId:food.categoryId,
        }));

        setFoods(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách món ăn:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <h4 className="mt-4">Mặt hàng phổ biến</h4>
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
