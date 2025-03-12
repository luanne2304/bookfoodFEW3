import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";

const Chatbox = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        height: 400,
        backgroundColor: "white",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <h6>Chat hỗ trợ</h6>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          height: 300,
          backgroundColor: "#f1f1f1",
          borderRadius: 5,
          padding: 5,
        }}
      >
        <p>User: Xin chào!</p>
        <p>Support: Chào bạn, tôi có thể giúp gì?</p>
      </div>
      <Form className="mt-2">
        <FormControl type="text" placeholder="Nhập tin nhắn..." className="me-2" />
        <Button variant="primary" className="mt-1 w-100">
          Gửi
        </Button>
      </Form>
    </div>
  );
};

export default Chatbox;
