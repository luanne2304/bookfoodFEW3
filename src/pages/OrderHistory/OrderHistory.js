import React, { useState,useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import services from "../../utils/services";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders,setOrders] = useState([
  ]);

  // Điều hướng đến trang chi tiết đơn hàng
  const viewOrderDetail = (orderId) => {
    navigate(`/OrderDetail/${orderId}`);
  };

  const payment=async(id,value)=>{
    try{
      const res = await services.payment(id,value);
      console.log("thanh toan thành công",res)
    }catch(e){
      console.log("thanh toán thất bại",e)
    }
  }

  useEffect(()=>{
    const fetch=async()=>{
      const res = await services.getOrderHistory();
      const formattedData = res.map((item) => ({
        id: item.id.toString(),
        discount: parseInt(item.discount),
        total: parseInt(item.totalPrice),
        payment: item.payment,
        status:item.status,
        isReviewed:item.isReviewed,
        isPay:item.isPay,
        note:item.note,
      }));
      console.log(res)
      setOrders(formattedData);
    }
    fetch()
  },[])

  return (
    <Container className="mt-4">
      <h2>📜 Lịch Sử Mua Hàng</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Giá Giảm (VNĐ)</th>
              <th>Thành Tiền (VNĐ)</th>
              <th>Ghi chú</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái đơn hàng</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>-{order.discount.toLocaleString()}</td>
                <td>{order.total.toLocaleString()}</td>
                <td>{order.note}</td>
                <td>  {order.payment == 0
                  ? `Ví điện tử (${order.isPay? ("Đã thanh toán") :("Chưa thanh toán")})` 
                  : order.payment == 1
                  ? "Tiền mặt"
                  : "N/A"}
                </td>
                <td><td>
                {order.status == 0
                  ? "Đang chờ xác nhận"
                  : order.status == 1
                  ? "Đang chuẩn bị món"
                  : "Đã giao"}
              </td></td>
                <td>
                {order.payment == 0 && !order.isPay && (
                    <Button variant="danger" onClick={()=>payment(order.id,order.total.toLocaleString())} >
                      Thanh toán
                    </Button>
                    )}
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
