import React, { useEffect,useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../utils/services";


const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); 
  const goDetail=(id)=>{
    navigate(`/restaurant/${id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await services.getAllRestaurants();
        console.log(res);

        const formattedData = res.map((restaurant) => ({
          id: restaurant.id.toString(),
          name: restaurant.name,
          houseNumber: restaurant.houseNumber,
          street: restaurant.street,
          ward: restaurant.ward,
          district: restaurant.district,
          city: restaurant.city,
          owner: restaurant.owner,
        }));

        setRestaurants(formattedData); // Cập nhật state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà hàng:", error);
      }
    };

    fetchData();
  }, []);

  
  return (
    <>
      <h4 className="mt-4">Nhà hàng nổi bật</h4>
      <Row>
      {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
          <Col key={restaurant.id} md={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{restaurant.name}</Card.Title>
                <Card.Text>Địa chỉ: {restaurant.district+", "+restaurant.city}</Card.Text>
                <Button variant="info" onClick={() => goDetail(restaurant.id)}>Xem ngay</Button>
              </Card.Body>
            </Card>
          </Col>
          ))
        ) : (
          <p>Đang tải danh sách nhà hàng...</p>
        )}
      </Row>
    </>
  );
};

export default RestaurantList;
