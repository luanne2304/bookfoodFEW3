import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Form, Button } from "react-bootstrap";

const OrderDetail = () => {
  const { orderId } = useParams(); // Lấy ID đơn hàng từ URL

  // Dữ liệu đơn hàng mẫu (thay bằng API nếu có)
  const orderData = {
    id: orderId,
    restaurantName: "Nhà Hàng Hoa",
    discount: 50000,
    total: 450000,
    items: [
      { id: 1, name: "Phở Bò", price: 50000, quantity: 2 },
      { id: 2, name: "Bún Chả", price: 45000, quantity: 1 },
      { id: 3, name: "Gỏi Cuốn", price: 30000, quantity: 3 },
    ],
  };

  // State lưu đánh giá của từng món
  const [reviews, setReviews] = useState(
    orderData.items.reduce((acc, item) => {
      acc[item.id] = { rating: 5, comment: "" };
      return acc;
    }, {})
  );

  // Xử lý thay đổi số sao hoặc đánh giá
  const handleReviewChange = (itemId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  // Tổng tiền sau khi áp dụng giảm giá
  const finalTotal =
    orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) -
    orderData.discount;

  return (
    <Container className="mt-4">
      <h2>📝 Chi Tiết Đơn Hàng #{orderId}</h2>
      <h4>Nhà hàng: {orderData.restaurantName}</h4>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên Món</th>
            <th>Đơn Giá (VNĐ)</th>
            <th>Số Lượng</th>
            <th>Tổng (VNĐ)</th>
            <th>Đánh Giá</th>
            <th>Nhận Xét</th>
          </tr>
        </thead>
        <tbody>
          {orderData.items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString()}₫</td>
              <td>
                <Form.Select
                  value={reviews[item.id].rating}
                  onChange={(e) => handleReviewChange(item.id, "rating", e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star} ⭐
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={reviews[item.id].comment}
                  onChange={(e) => handleReviewChange(item.id, "comment", e.target.value)}
                  placeholder="Nhập đánh giá..."
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3">
        <h5>Giá Giảm: -{orderData.discount.toLocaleString()}₫</h5>
        <h4>Thành Tiền: {finalTotal.toLocaleString()}₫</h4>
      </div>

      <Button variant="primary" className="mt-3">
        Gửi Đánh Giá
      </Button>
    </Container>
  );
};

export default OrderDetail;
