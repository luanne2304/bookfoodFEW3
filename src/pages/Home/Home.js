import React,{useState, useEffect} from "react";
import RestaurantList from "../../cpns/RestaurantList/RestaurantList";
import ProductList from "../../cpns/ProductList/ProductList";
import { Button,FormControl,Form ,Modal} from "react-bootstrap";
import services from "../../utils/services";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [tempFoods, setTempFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]); // Danh sách categories từ API
  const [minRating, setMinRating] = useState(0);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await services.searchFood(searchQuery);

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
      console.log(formattedData)
      setFoods(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
    try {
      const res = await services.searchRestaurants(searchQuery);
      console.log(res+"aaaa");

      const formattedData = res.map((restaurant) => ({
        id: restaurant.id.toString(),
        name: restaurant.name,
        houseNumber: restaurant.houseNumber,
        street: restaurant.street,
        ward: restaurant.ward,
        district: restaurant.district,
        city: restaurant.city,
        owner: restaurant.owner,
      }));

      setRestaurants(formattedData); // Cập nhật state
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà hàng:", error);
    }
  };

  const handleFilter = () => {
    setFoods(
      tempFoods.filter(
        (food) =>
          (!minPrice || food.price >= minPrice) &&
          (!maxPrice || food.price <= maxPrice) &&
          (!selectedCategory || food.categoryId == selectedCategory) &&
          food.totalStars / food.totalRatings >= minRating &&
          (!filterVegan || food.isVegan) &&
          (!filterGlutenFree || food.isGlutenFree)
      )
    );
    setShowFilterModal(false);
  };
  

  useEffect(() => {  
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
      setTempFoods(formattedData)
      setFoods(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách món ăn:", error);
    }
  };
    fetchDataFoods();
    const fetchDataRes = async () => {
      try {
        const res = await services.getAllRestaurants();
        console.log(res+"aa");

        const formattedData = res.map((restaurant) => ({
          id: restaurant.id.toString(),
          name: restaurant.name,
          houseNumber: restaurant.houseNumber,
          street: restaurant.street,
          ward: restaurant.ward,
          district: restaurant.district,
          city: restaurant.city,
          owner: restaurant.owner,
        }));

        setRestaurants(formattedData); // Cập nhật state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà hàng:", error);
      }
    };

    fetchDataRes();

      const fetchCategories = async () => {
        try {
          const res = await services.getAllCategories();
          setCategories(res);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách danh mục:", error);
        }
      };
    
      fetchCategories();
    }, []);


    return(
    <>
<Form className="d-flex">
  <FormControl
    type="search"
    placeholder="Tìm kiếm..."
    className="me-2"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <Button variant="primary" onClick={handleSearch}>Tìm kiếm</Button>
  <Button variant="secondary" className="ms-2" onClick={() => setShowFilterModal(true)}>Lọc</Button>
</Form>
      <ProductList foods={foods} />
      <RestaurantList restaurants={restaurants}/>
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Bộ lọc</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Min & Max Price */}
      <Form.Group className="mb-3">
        <Form.Label>💰 Khoảng giá:</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="number"
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="me-2"
          />
          <Form.Control
            type="number"
            placeholder="Giá tối đa"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </Form.Group>

      {/* Dropdown chọn Category */}
      <Form.Group className="mb-3">
        <Form.Label>🍽 Danh mục món ăn:</Form.Label>
        <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Min Rating */}
      <Form.Group className="mb-3">
        <Form.Label>⭐ Điểm đánh giá tối thiểu:</Form.Label>
        <Form.Select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          {[0,1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>{rating} ⭐</option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Checkboxes */}
      <Form.Check
        type="checkbox"
        label="🌱 Chỉ hiển thị món chay"
        checked={filterVegan}
        onChange={(e) => setFilterVegan(e.target.checked)}
      />
      <Form.Check
        type="checkbox"
        label="🚫 Không chứa gluten"
        checked={filterGlutenFree}
        onChange={(e) => setFilterGlutenFree(e.target.checked)}
      />
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
      Đóng
    </Button>
    <Button variant="success" onClick={handleFilter}>
      Áp dụng
    </Button>
  </Modal.Footer>
</Modal>

  </>)
};

export default Home;