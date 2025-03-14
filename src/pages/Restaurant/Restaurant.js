import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import FoodlistOrder from "../../cpns/FoodlistOrder/FoodlistOrder";
import services from "../../utils/services";

const Restaurant = () => {
  const [cart, setCart] = useState([]);
  const { id } = useParams();
  const [ownerId,setOwnerId]=useState();
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [useRewardPoints, setUseRewardPoints] = useState(false); // Xài điểm thưởng
  const [orderNote, setOrderNote] = useState(""); // Ghi chú với bếp

  // Cập nhật số lượng món ăn trong giỏ
  const updateQuantity = (foodId, quantity) => {
    const newValue = Number(quantity) > 0 ? Number(quantity) : 1;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === foodId ? { ...item, quantity: Math.max(1, newValue) } : item
      )
    );
  };

  // Xóa món khỏi giỏ hàng
  const removeFromCart = (foodId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== foodId));
  };

  // Tính tổng thành tiền
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const confirmPayment = async () => {
    console.log(`Thanh toán thành công bằng: ${paymentMethod}`);
    console.log("Đơn hàng:", cart);
    console.log("Dùng điểm thưởng:", useRewardPoints);
    console.log("Ghi chú với bếp:", orderNote);

    const arrIdFood = cart.map(item => item.id);
    const arrQuantity = cart.map(item => item.quantity);

    try {
      const tx = await services.createOrder(paymentMethod, arrIdFood, arrQuantity, useRewardPoints, orderNote);
      console.log("Giao dịch hoàn tất:", tx);
      alert("Tạo đơn thành công!");
      setShowModal(false)
      setCart([])
    } catch (e) {
      alert("Tạo đơn thất bại!", e);
    }
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(()=>{
    const fetchChat =async()=>{
      const res = await services.getRes(id);
      setOwnerId(res.owner)
    }
    fetchChat();
  },[])

  return (
    <>
      <Container className="mt-4">
        <h4>Danh sách món ăn của nhà hàng</h4>
        <Button 
            variant="outline-primary" 
            size="xm" 
            className="ms-3"
            onClick={() => {
              navigator.clipboard.writeText(ownerId);

            }}
          >
            Nhắn tin với Bếp
          </Button>
        <FoodlistOrder restaurantId={id} setCart={setCart} />
      </Container>

      {cart.length > 0 && (
        <div className="mt-4">
          <h4>🛒 Giỏ Hàng</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()}₫</td>
                  <td>
                    <Button variant="danger" onClick={() => removeFromCart(item.id)}>
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Tổng thành tiền:</strong></td>
                <td><strong>{totalAmount.toLocaleString()}₫</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </Table>

          {/* Chọn sử dụng điểm thưởng */}
          <Form.Group controlId="useRewardPoints" className="mt-3">
            <Form.Check
              type="checkbox"
              label="🎁 Sử dụng điểm thưởng"
              checked={useRewardPoints}
              onChange={(e) => setUseRewardPoints(e.target.checked)}
            />
          </Form.Group>

          {/* Nhập ghi chú cho bếp */}
          <Form.Group controlId="orderNote" className="mt-3">
            <Form.Label>📝 Ghi chú với bếp:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập ghi chú tại đây..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleCheckout} className="mt-3">
            Thanh toán
          </Button>
        </div>
      )}

      {/* Modal Thanh toán */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn Phương Thức Thanh Toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="💵 Tiền mặt (Cash)"
              name="paymentMethod"
              value="2"
              checked={paymentMethod === 1}
              onChange={() => setPaymentMethod(1)}
            />
            <Form.Check
              type="radio"
              label="📱 Ví điện tử (E-wallet)"
              name="paymentMethod"
              value="1"
              checked={paymentMethod === 0}
              onChange={() => setPaymentMethod(0)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={confirmPayment}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Restaurant;
