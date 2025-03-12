import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { Container,Table,Button,Form,Modal } from "react-bootstrap";
import FoodlistOrder from "../../cpns/FoodlistOrder/FoodlistOrder";

const Restaurant = () => {
const [cart,setCart]= useState([])
const { id } = useParams();
const [showModal, setShowModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState("cash");
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

  const confirmPayment = () => {
    console.log(`Thanh toán thành công bằng: ${paymentMethod}`);
    console.log("Đơn hàng:", cart);
    setShowModal(false);
    setCart([]); // Xóa giỏ hàng sau khi thanh toán
  };

useEffect(()=>{
    console.log(cart)
},[cart])
  return (<>
    <Container className="mt-4">
      <h2>Nha Hang Hoa</h2>
      <p> 55 Gia P3 Q6 THCM</p>
      <h4>Danh sách món ăn</h4>
      <FoodlistOrder restaurantId={id} setCart={setCart}/>
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
        </div>
      )}        <Button variant="primary" onClick={handleCheckout}>
      Thanh toán
    </Button>
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
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="📱 Ví điện tử (E-wallet)"
              name="paymentMethod"
              value="ewallet"
              checked={paymentMethod === "ewallet"}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
