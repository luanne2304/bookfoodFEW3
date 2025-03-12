import React, { useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();
  
  // Dữ liệu đơn hàng mẫu (Giả sử lấy từ API)
  const [orders] = useState([
    { id: 1, restaurantName: "Nhà Hàng Hoa", discount: 50000, total: 450000 },
    { id: 2, restaurantName: "Phở 24", discount: 30000, total: 220000 },
    { id: 3, restaurantName: "Bún Chả Hà Nội", discount: 20000, total: 180000 },
  ]);

  // Điều hướng đến trang chi tiết đơn hàng
  const viewOrderDetail = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <Container className="mt-4">
      <h2>📜 Lịch Sử Mua Hàng</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tên Nhà Hàng</th>
              <th>Giá Giảm (VNĐ)</th>
              <th>Thành Tiền (VNĐ)</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.restaurantName}</td>
                <td>-{order.discount.toLocaleString()}₫</td>
                <td>{order.total.toLocaleString()}₫</td>
                <td>
                  <Button variant="info" onClick={() => viewOrderDetail(order.id)}>
                    Xem chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistory;
