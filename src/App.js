import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home"
import "bootstrap/dist/css/bootstrap.min.css";
import Restaurant from "./pages/Restaurant/Restaurant";
import CreateRestaurant from "./pages/CreateRestaurant/CreateRestaurant";
import CreateCategory from "./pages/CreateCategory/CreateCategory";
import CreateFood from "./pages/CreateFood/CreateFood";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import OrderDetail from "./pages/OrderDetail/OrderDetail";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/CreateRestaurant" element={<CreateRestaurant />} />
          <Route path="/CreateCategory" element={<CreateCategory />} />
          <Route path="/CreateFood" element={<CreateFood />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/OrderDetail" element={<OrderDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
