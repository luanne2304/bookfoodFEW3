import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../utils/services";

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const copyAddress = (customerAddress) => {
    navigator.clipboard.writeText(customerAddress);
  };

  const updateStatus = async (order) => {
    const nextStatus = Number(order.status) + 1;
    if (nextStatus > 2) return alert("Không thể cập nhật thêm!");

    if (order.payment === 0 && !order.isPay) {
        return alert("Vui lòng thanh toán trước khi cập nhật trạng thái!");
    }

    try {
        await services.updateOrderStatus(Number(order.id), nextStatus);
        setOrders((prevOrders) =>
            prevOrders.map((o) =>
                o.id === order.id ? { ...o, status: nextStatus } : o
            )
        );
    } catch (error) {
        console.log(error)// Hiển thị chính xác lỗi từ Smart Contract
    }
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await services.getAllOrders();
        const formattedData = res.map((item) => ({
          id: item.id.toString(),
          customer: item.customer.toString(),
          discount: parseInt(item.discount),
          total: parseInt(item.totalPrice),
          payment: item.payment,
          status: item.status,
          isReviewed: item.isReviewed,
          isPay: item.isPay,
          note: item.note,
        }));
        setOrders(formattedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container className="mt-4">
      <h2>📦 Quản Lý Trạng Thái Đơn Hàng</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Giá Giảm (VNĐ)</th>
              <th>Thành Tiền (VNĐ)</th>
              <th>Ghi chú</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>-{order.discount.toLocaleString()}</td>
                <td>{order.total.toLocaleString()}</td>
                <td>{order.note}</td>
                <td>
                  {order.payment == 0
                    ? `Ví điện tử (${order.isPay ? "Đã thanh toán" : "Chưa thanh toán"})`
                    : order.payment == 1
                    ? "Tiền mặt"
                    : "N/A"}
                </td>
                <td>
                  {order.status == 0
                    ? "Đang chờ xác nhận"
                    : order.status == 1
                    ? "Đang chuẩn bị món"
                    : "Đã giao"}
                </td>
                <td>
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => copyAddress(order.customer)}
                  >
                    Nhắn tin 
                  </Button>
                  {order.status < 2 && (
                    <Button
                      variant="success"
                      onClick={() => updateStatus(order)}
                    >
                      Cập nhật trạng thái
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderManagement;
