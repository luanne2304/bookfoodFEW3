import React, { useState ,useEffect,useRef } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import services from "../../utils/services";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatWith, setChatWith] = useState("");

  const hasListener = useRef(false);
  const sendMessage =async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "Tôi", text: input }]);
    await services.chat(chatWith,input)
    setInput("");
  };


  useEffect(() => {
    if (!hasListener.current) { // Chỉ đăng ký một lần
      hasListener.current = true;
      services.listenForUpdateOrder((newMessage) => {
          setMessages((prevMessages) => [
              ...prevMessages,
              { sender: newMessage.sender, text: newMessage.message },
          ]);
      });
        services.listenForMessages((newMessage) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: newMessage.sender, text: newMessage.message },
            ]);
        });
    }
}, []);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        height: 450,
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h6 style={{ textAlign: "center", fontWeight: "bold" }}>💬 Chat </h6>

      {/* Ô chọn đối tượng hỗ trợ */}
      <span>TO:
      <FormControl
          type="text"
          placeholder="Nhắn với..."
          value={chatWith}
          onChange={(e) => setChatWith(e.target.value)}          
      />
      </span>


      {/* Khu vực hiển thị tin nhắn */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, index) => (
          <p key={index} style={{ marginBottom: 5 }}>
            <strong>{msg.sender === "user" ? "Bạn" : msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      {/* Ô nhập tin nhắn */}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        <FormControl
          type="text"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1, // Giữ input không bị to quá
            minWidth: 0, // Tránh input giãn rộng vô hạn
          }}
        />
        <Button variant="primary" type="submit" style={{ whiteSpace: "nowrap" }}>
          Gửi
        </Button>
      </Form>
    </div>
  );
};

export default Chatbox;
