// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

contract Bookfood {

    constructor(address payable  _beneficiary){
       beneficiary= _beneficiary;
    }

    enum OrderStatus { Pending, Preparing, Delivered }
    enum Payment  { Ewallet,Cash, CreditCard }

    struct FoodCategory {
        uint id;
        string name;
    }
    
    struct Restaurant {
        uint id;
        string name;
        string houseNumber;
        string street;
        string ward;
        string district;
        string city;
        address owner;
    }

    struct Food {
        uint id;
        string name;
        string img;
        uint restaurantId;
        uint categoryId;
        uint price;
        bool isVegan;
        bool isGlutenFree;
        uint totalStars;
        uint totalRatings;
    }

    struct Rating {
        uint id;
        uint foodId;
        address user;
        string review;
        uint stars;
    }

    struct Order {
        uint id;
        uint restaurantId;
        address customer;
        uint discount;
        uint totalPrice;
        OrderStatus status;
        Payment payment;
        bool isReviewed;
        bool isPay;
        string note;
    }

    struct DetailOrder {
        uint foodId;
        uint quantity;
        uint price;
    }

    mapping(uint => Restaurant) public restaurants;
    mapping(uint => Food) public foods;
    mapping(uint => mapping(uint => Rating)) public ratings;
    mapping(uint => uint) public ratingCountPerFood; 
    mapping(uint => Order) public orders;
    mapping(uint => mapping(uint => DetailOrder)) public orderDetails; 
    mapping(uint => uint) public orderDetailCount;
    mapping(uint => FoodCategory) public categories; 
    mapping(address => uint) public points;

    address payable public beneficiary;
    uint restaurantCount;
    uint foodCount;
    uint orderCount;
    uint categoryCount;

    event OrderStatusUpdated(uint orderId, address indexed customer, OrderStatus status);
    event MessageSent(address indexed sender, address indexed receiver, string message);

    function processPayment(uint _orderId) public payable {
        Order storage order = orders[_orderId];
        require(order.customer == msg.sender, "Only order owner can pay");
        
        uint amountToPay = order.totalPrice;
        require((msg.value *1000) >= amountToPay, "Insufficient payment");
        
        beneficiary.transfer(msg.value);
        order.isPay=true;
    }
    
    function addRestaurant(
        string memory _name, 
        string memory _houseNumber, 
        string memory _street, 
        string memory _ward, 
        string memory _district, 
        string memory _city, 
        address _owner
        
    ) public {
         require(_owner != address(0), "Owner address cannot be zero");
        restaurantCount++;
        restaurants[restaurantCount] = Restaurant(
            restaurantCount, 
            _name, 
            _houseNumber, 
            _street, 
            _ward, 
            _district, 
            _city, 
            _owner
        );
    }

    function addCategory(string memory _name) public {
        categoryCount++;
        categories[categoryCount] = FoodCategory(categoryCount, _name);
    }
    function addFood(
        string memory _name, uint _restaurantId, uint _categoryId,
        uint _price, bool _isVegan, bool _isGlutenFree, string memory img
    ) public {
        require(restaurants[_restaurantId].id != 0, "Restaurant does not exist");
        foodCount++;
        foods[foodCount] = Food(
            foodCount, _name,img, _restaurantId, _categoryId,
            _price, _isVegan, _isGlutenFree, 0, 0
        );
    }

function addRating(uint _idOrder, string[] memory _reviews, uint[] memory _stars) public {
    require(_reviews.length == _stars.length, "Mismatched array lengths");   
    require(orders[_idOrder].customer == msg.sender, "Only the buyer can add a rating");
    require(orders[_idOrder].isReviewed == false, "Only the buyer can add a rating");
    

    for (uint i = 0; i < orderDetailCount[_idOrder]; i++) {
        uint foodId = orderDetails[_idOrder][i+1].foodId; // Lấy foodId từ orderDetails
        require(foodId != 0, "DetailOrder does not exist"); // Kiểm tra xem orderDetail có tồn tại không
        require(_stars[i] >= 1 && _stars[i] <= 5, "Stars must be between 1 and 5");
        
        ratingCountPerFood[foodId]++;
        uint newRatingId = ratingCountPerFood[foodId];
        ratings[foodId][newRatingId] = Rating(newRatingId, foodId, msg.sender, _reviews[i], _stars[i]);

        // Cập nhật tổng điểm đánh giá
        foods[foodId].totalStars += _stars[i];
        foods[foodId].totalRatings++;
    }
    orders[_idOrder].isReviewed = true;
}

    
    function placeOrder(Payment _payment,uint[] memory _foodIds, uint[] memory _quantities, bool UsePoint,string memory note) 
    public {
        require(_foodIds.length > 0, "Order must contain at least one food item");
        require(_foodIds.length == _quantities.length, "Mismatched array lengths");

        uint totalPrice = 0;
        orderCount++;
        uint temp_resId=0;


        for (uint i = 0; i < _foodIds.length; i++) {
            require(foods[_foodIds[i]].id != 0, "Food does not exist");
            if(temp_resId==0){
                temp_resId=foods[_foodIds[i]].restaurantId;
            }
            require(temp_resId==foods[_foodIds[i]].restaurantId, "food not from the same restaurant");
            // Tính tổng giá tiền
            uint itemPrice = foods[_foodIds[i]].price * _quantities[i];
            totalPrice += itemPrice;
            orderDetailCount[orderCount]++;
            uint itemIndex = orderDetailCount[orderCount];
            orderDetails[orderCount][itemIndex] = DetailOrder(_foodIds[i], _quantities[i], itemPrice);
        }

        // Áp dụng điểm thưởng nếu có
        uint discount = 0;
        if (UsePoint) {
            uint availablePoints = points[msg.sender] ;
            if(availablePoints>50) availablePoints=50;
            discount = totalPrice * availablePoints / 100; // Giảm tối đa 50%

            points[msg.sender] -= availablePoints; 
        }
        orders[orderCount] = Order(orderCount,temp_resId, msg.sender,discount, totalPrice-discount, 
        OrderStatus.Pending,_payment,false,false,note);
        points[msg.sender] += 1; 
    }

    function updateOrderStatus(uint _orderId, OrderStatus _status) public {
        require(orders[_orderId].id != 0, "Order does not exist");
        require(uint(_status) > uint(orders[_orderId].status), "Invalid status transition");

        address restaurantOwner = restaurants[orders[_orderId].restaurantId].owner;
        require(msg.sender == restaurantOwner || msg.sender == beneficiary, "Only restaurant owner or beneficiary can update status");
        
        // Nếu phương thức thanh toán là Ewallet thì phải kiểm tra isPay
        if (orders[_orderId].payment == Payment.Ewallet) {
            require(orders[_orderId].isPay, "Payment must be completed for Ewallet orders");
        }
        
        orders[_orderId].status = _status;
        emit OrderStatusUpdated(_orderId,  orders[_orderId].customer,_status);
    }

    
    function sendMessage(address _receiver, string memory _message) public {
        emit MessageSent(msg.sender, _receiver, _message);
    }
    
    function getAllRestaurants() public view returns (Restaurant[] memory) {
        Restaurant[] memory allRestaurants = new Restaurant[](restaurantCount);
        for (uint i = 1; i <= restaurantCount; i++) {
            allRestaurants[i - 1] = restaurants[i];
        }
        return allRestaurants;
    }

    function getAllFoods() public view returns (Food[] memory) {
        Food[] memory allFoods = new Food[](foodCount);
        for (uint i = 1; i <= foodCount; i++) {
            allFoods[i - 1] = foods[i];
        }
        return allFoods;
    }

    
    function getAllCategory() public view returns (FoodCategory[] memory) {
        FoodCategory[] memory allCate = new FoodCategory[](categoryCount);
        for (uint i = 1; i <= categoryCount; i++) {
            allCate[i - 1] = categories[i];
        }
        return allCate;
    }


function getOrdersBySender() public view returns (Order[] memory) {

        uint count = 0;

        // Đếm số lượng đơn hàng của sender
        for (uint i = 1; i <= orderCount; i++) {
            if (orders[i].customer == msg.sender) {
                count++;
            }
        }

        // Tạo mảng kết quả
        Order[] memory senderOrders = new Order[](count);
        uint index = 0;
        for (uint i = 1; i <= orderCount; i++) {
            if (orders[i].customer == msg.sender) {
                senderOrders[index] = orders[i];
                index++;
            }
        }

        return senderOrders;
    }


    function getOrderDetails(uint _orderId) public view returns (DetailOrder[] memory) {
        uint itemCount = orderDetailCount[_orderId];
        DetailOrder[] memory items = new DetailOrder[](itemCount);

        for (uint i = 0; i < itemCount; i++) {
            items[i] = orderDetails[_orderId][i+1];
        }

        return items;
    }

    function getRatingsForFood(uint _foodId) public view returns (Rating[] memory) {
        require(foods[_foodId].id != 0, "Food does not exist");

        uint count = ratingCountPerFood[_foodId];
        Rating[] memory foodRatings = new Rating[](count);
        
        for (uint i = 0; i < count; i++) {
            foodRatings[i] = ratings[_foodId][i+1];
        }
        
        return foodRatings;
    }

    function searchRestaurants(
        string memory _keyword
    ) public view returns (Restaurant[] memory) {
        Restaurant[] memory tempResults = new Restaurant[](restaurantCount);
        uint count = 0;

        for (uint i = 1; i <= restaurantCount; i++) {
            string memory fullLocation = string(
                abi.encodePacked(
                    restaurants[i].street, " ", 
                    restaurants[i].ward, " ", 
                    restaurants[i].district, " ", 
                    restaurants[i].city
                )
            );

            if (
                (_contains(restaurants[i].name, _keyword) ||
                _contains(fullLocation, _keyword))
            ) {
                tempResults[count] = restaurants[i];
                count++;
            }
        }

        // Tạo một mảng đúng kích thước để trả về
        Restaurant[] memory results = new Restaurant[](count);
        for (uint j = 0; j < count; j++) {
            results[j] = tempResults[j];
        }
        return results;
    }

    function searchFood(
        string memory _keyword
    ) public view returns (Food[] memory) {
        Food[] memory tempResults = new Food[](foodCount);
        uint count = 0;

        for (uint i = 1; i <= foodCount; i++) {
            if (
                (_contains(foods[i].name, _keyword) ||
                _contains(categories[foods[i].categoryId].name, _keyword))
            ) {
                tempResults[count] = foods[i];
                count++;
            }
        }

        // Tạo một mảng đúng kích thước để trả về
        Food[] memory results = new Food[](count);
        for (uint j = 0; j < count; j++) {
            results[j] = tempResults[j];
        }
        return results;
    }

    function _contains(string memory _str, string memory _keyword) internal pure returns (bool) {
        bytes memory strBytes = bytes(_str);
        bytes memory keywordBytes = bytes(_keyword);
        
        if (keywordBytes.length > strBytes.length) return false;

        for (uint i = 0; i <= strBytes.length - keywordBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < keywordBytes.length; j++) {
                if (strBytes[i + j] != keywordBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }

    function getAllOrders() public view returns (Order[] memory) {
    Order[] memory allOrders = new Order[](orderCount);
    for (uint i = 1; i <= orderCount; i++) {
        allOrders[i - 1] = orders[i];
    }
    return allOrders;

    // function filterFoods(
    //     uint _minPrice, 
    //     uint _maxPrice, 
    //     uint _categoryId, 
    //     uint _minRating, 
    //     bool _isVegan, 
    //     bool _isGlutenFree
    // ) public view returns (Food[] memory) {
    //     Food[] memory tempFoods = new Food[](foodCount);
    //     uint count = 0;

    //     for (uint i = 1; i <= foodCount; i++) {
    //         Food storage food = foods[i];
    //         uint avgRating = (food.totalRatings > 0) ? (food.totalStars / food.totalRatings) : 0;

    //         // Kiểm tra điều kiện lọc
    //         bool matchesCategory = (_categoryId == 0 || food.categoryId == _categoryId);
    //         bool matchesPrice = (food.price >= _minPrice && food.price <= _maxPrice);
    //         bool matchesRating = (avgRating >= _minRating);
    //         bool matchesVegan = (!_isVegan || food.isVegan);
    //         bool matchesGlutenFree = (!_isGlutenFree || food.isGlutenFree);

    //         if (matchesCategory && matchesPrice && matchesRating && matchesVegan && matchesGlutenFree) {
    //             tempFoods[count] = food;
    //             count++;
    //         }
    //     }

    //     // Tạo mảng kết quả có kích thước đúng
    //     Food[] memory filteredFoods = new Food[](count);
    //     for (uint j = 0; j < count; j++) {
    //         filteredFoods[j] = tempFoods[j];
    //     }

    //     return filteredFoods;
    // }

}

}