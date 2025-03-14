import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Form, Button } from "react-bootstrap";
import services from "../../utils/services";

const OrderDetail = () => {
  const { orderId } = useParams(); // Lấy ID đơn hàng từ URL

  // Dữ liệu đơn hàng mẫu (thay bằng API nếu có)
  const [orderDetail,setOrderDetail]=useState([])
  const [order,setOrder]=useState({
    id:"",
    discount:0,
    totalPrice:0,
    isReviewed:true,
    note:"",

  })
  const [foods,setFoods]=useState([])

  const handleSubmit=async()=>{
    const updatedorderDetail = orderDetail.map(item => ({
      ...item,
      review: item.review.trim() === "" ? "Không có đánh giá" : item.review
    }));
  
    // Tách dữ liệu thành hai mảng
    const ratings = updatedorderDetail.map(item => parseInt(item.rating)); // Mảng số sao
    const reviews = updatedorderDetail.map(item => item.review); // Mảng đánh giá
    try{
      const tx= await services.rating(parseInt(orderId),reviews,ratings)
      alert("Đánh giá đã được thêm vào blockchain!",tx);
    }catch(e){
      alert("Đánh giá thất bại!",e);
    }

  
  }

  const handleReviewChange = (id, field, value) => {
    setOrderDetail((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  

  const getFoodName = (foodId) => {
    const food = foods.find((item) => item.id === foodId.toString()); 
    return food ? food.name : "Không xác định";
  };

    useEffect(()=>{
      const fetchDataFoods = async () => {
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
  
      fetchDataFoods();
      const fetch=async()=>{
        const res = await services.getOrderDetail(orderId);
        const formattedData = res.map((item) => ({
          id: item.foodId.toString(),
          price: parseInt(item.price),
          quantity: parseInt(item.quantity),
          rating: 5,
          review:""
        }));
        setOrderDetail(formattedData);
        console.log(res)
      }
      fetch()

      const fetchOrder=async()=>{
        const res = await services.getOrder(orderId);
        setOrder({
          id:res.id,
          discount:res.discount,
          totalPrice:res.totalPrice,
          isReviewed:res.isReviewed,
          status:res.status,
          note:res.note,
        });
        console.log(res)
      }
      fetchOrder()
    },[])

  return (
    <Container className="mt-4">
      <h2>📝 Chi Tiết Đơn Hàng #{order.id}</h2>

      <Table striped bordered hover>
  <thead>
    <tr>
      <th>Tên Món</th>
      <th>Đơn Giá (VNĐ)</th>
      <th>Số Lượng</th>
      <th>Tổng (VNĐ)</th>
      {!order.isReviewed && order.status==2 && <th>Đánh Giá</th>}
      {!order.isReviewed && order.status==2 && <th>Nhận Xét</th>}
    </tr>
  </thead>
  <tbody>
    {orderDetail.map((item) => (
      <tr key={item.id}>
        <td>{getFoodName(item.id)}</td>
        <td>{item.price.toLocaleString()}</td>
        <td>{item.quantity}</td>
        <td>{(item.price * item.quantity).toLocaleString()}</td>
        {!order.isReviewed && order.status==2 && (
          <td>
            <Form.Select
              value={item.rating}
              onChange={(e) =>
                handleReviewChange(item.id, "rating", e.target.value)
              }
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} ⭐
                </option>
              ))}
            </Form.Select>
          </td>
        )}
        {!order.isReviewed && order.status==2 && (
          <td>
            <Form.Control
              type="text"
              value={item.review}
              onChange={(e) =>
                handleReviewChange(item.id, "review", e.target.value)
              }
              placeholder="Nhập đánh giá..."
            />
          </td>
        )}
      </tr>
    ))}
  </tbody>
</Table>

<div className="mt-3">
  <h5>Giá Giảm: {order.discount}</h5>
  <h4>Thành Tiền: {order.totalPrice}</h4>
</div>

{!order.isReviewed && (
  <Button variant="primary" className="mt-3" onClick={handleSubmit}>
    Gửi Đánh Giá
  </Button>
)}
    </Container>
  );
};

export default OrderDetail;
