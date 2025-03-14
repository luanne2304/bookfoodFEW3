import Web3 from "web3";
import contractData from "../contracts/Bookfood.json"

const abi = contractData.abi;

const getContract = async () => {
    // Kiểm tra xem biến môi trường có tồn tại không
    if (!process.env.REACT_APP_CONTRACT_ADDRESS) {
        console.error("Thiếu biến môi trường cho contract");
        throw new Error("Thiếu cấu hình contract");
    }
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    // Đảm bảo parse ABI một cách an toàn
    let contractABI=abi;    
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        return { web3, contract };
    } else {
        throw new Error("Metamask chưa được cài đặt!");
    }
};


const services = {
    createRestaurant: async (name, houseNumber, street, ward, district, city, ownerAddress) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
                .addRestaurant(name, houseNumber, street, ward, district, city, ownerAddress)
                .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi thêm nhà hàng:", error);
            throw error;
        }
    },

    createCategory: async (name) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
                .addCategory(name)
                .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi thêm phân loại:", error);
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            const { contract } = await getContract();
            const cate = await contract.methods.getAllCategory().call();
            return cate; // Trả về danh sách restaurant
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân loại thức ăn:", error);
            return [];
        }
    },

    getAllRestaurants: async () => {
        try {
            const { contract } = await getContract();
            const restaurants = await contract.methods.getAllRestaurants().call();
            return restaurants; // Trả về danh sách restaurant
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà hàng:", error);
            return [];
        }
    },


    getOrder: async (id) => {
        try {
            const { contract } = await getContract();
            const res = await contract.methods.orders(id).call();
            return res; 
        } catch (error) {
            console.error("test lỗi:", error);
            return [];
        }
    },

    getRes: async (id) => {
        try {
            const { contract } = await getContract();
            const res = await contract.methods.restaurants(id).call();
            return res;
        } catch (error) {
            console.error("test lỗi:", error);
            return [];
        }
    },

    getAllFoods: async () => {
        try {
            const { contract } = await getContract();
            const foods = await contract.methods.getAllFoods().call();
            return foods; 
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thức ăn:", error);
            return [];
        }
    },

    getAllOrders: async () => {
        try {
            const { contract } = await getContract();
            const res = await contract.methods.getAllOrders().call();
            return res; 
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            return [];
        }
    },
    
    getOrderHistory: async () => {
        try {
            const { web3,contract } = await getContract();
            const accounts = await web3.eth.getAccounts();
            const order = await contract.methods.getOrdersBySender().call({ from: accounts[0] });
            
            return order;
        } catch (error) {
            console.error("Lỗi khi lịch sử mua hàng:", error);
            return [];
        }
    },

    getOrderDetail: async (id) => {
        try {
            const { contract } = await getContract();
            const orderdetail = await contract.methods.getOrderDetails(id).call();
            
            return orderdetail;
        } catch (error) {
            console.error("Lỗi khi lịch sử mua hàng:", error);
            return [];
        }
    },
    
    updateOrderStatus: async (orderId,status) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
                .updateOrderStatus(orderId,status)
                .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            throw error;
        }
    },

    rating: async (id,reviews,star) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
            .addRating(
                id,reviews,star
              )
              .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi đánh giá:", error);
            throw error;
        }
    },


    createFood: async (name,idres,cate,price,isVegan,isGlutenFree) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
            .addFood(
                name,idres,cate,price,isVegan,isGlutenFree,0
              )
              .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi thêm món ăn:", error);
            throw error;
        }
    },

    createOrder: async (payment,_foodIds,_quantities,UsePoint,note) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();

            const tx = await contract.methods
            .placeOrder(
                payment,_foodIds,_quantities,UsePoint,note
              )
              .send({ from: accounts[0] });

            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi thêm món ăn:", error);
            throw error;
        }
    },


    searchFood: async (keyword) => {
        try {
            const { contract } = await getContract();
            const foods = await contract.methods
                .searchFood(keyword)
                .call()

            console.log("Giao dịch thành công:", foods);
            return foods;
        } catch (error) {
            console.error("Lỗi khi search:", error);
            return [];
        }
    },

    searchRestaurants: async (keyword) => {
        try {
            const { contract } = await getContract();

            const restaurants = await contract.methods
                .searchRestaurants(keyword)
                .call()

            console.log("Giao dịch thành công:", restaurants);
            return restaurants;
        } catch (error) {
            console.error("Lỗi khi search:", error);
            return [];
        }
    },
    // getRatingsForFood

    getRatingByID: async (id) => {
        try {
            const { contract } = await getContract();

            const res = await contract.methods
                .getRatingsForFood(id)
                .call()

            console.log("Giao dịch thành công:", res);
            return res;
        } catch (error) {
            console.error("Lỗi khi search:", error);
            return [];
        }
    },

    chat: async (to,mess) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();
            const tx = await contract.methods
                .sendMessage(to,mess)
                .send({ from: accounts[0] });
            
            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            throw error;
        }
    },

    payment: async (id,value) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();
            const tx = await contract.methods
                .processPayment(id)
                .send({ from: accounts[0],
                        value:  web3.utils.toWei(value.toString(), "ether")
                });
            
            console.log("Giao dịch thành công:", tx);
            return tx;
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            throw error;
        }
    },

    listenForMessages: async (callback) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();
            const currentAccount = accounts[0].toLowerCase(); // Định dạng địa chỉ chuẩn hóa
    
            contract.events.MessageSent()
                .on("data", (event) => {
                    const { receiver, sender, message } = event.returnValues;
                    
                    if (String(receiver).toLowerCase() === currentAccount) { // Chỉ xử lý nếu tin nhắn gửi đến tài khoản hiện tại
                        console.log("Tin nhắn nhận được:", { receiver, message });
                        callback({ sender, message });
                    }
                })
                .on("error", (error) => {
                    console.error("Lỗi khi lắng nghe tin nhắn:", error);
                });
        } catch (error) {
            console.error("Lỗi khi thiết lập listener:", error);
        }
    },

    listenForUpdateOrder: async (callback) => {
        try {
            const { web3, contract } = await getContract();
            const accounts = await web3.eth.getAccounts();
            const currentAccount = accounts[0].toLowerCase(); // Định dạng địa chỉ chuẩn hóa
    
            contract.events.OrderStatusUpdated()
                .on("data", (event) => {
                    const { orderId, customer, status } = event.returnValues;
                    
                    if (String(customer).toLowerCase() === currentAccount) { // Chỉ xử lý nếu tin nhắn gửi đến tài khoản hiện tại
                        let statusText = "";
                        switch (Number(status)) {
                            case 0:
                                statusText = "Đang chờ xác nhận";
                                break;
                            case 1:
                                statusText = "Đang chuẩn bị món";
                                break;
                            case 2:
                                statusText = "Đã giao";
                                break;
                            default:
                                statusText = "Trạng thái không xác định";
                        }
    
                        callback({ sender: "hệ thống", message:`Đơn hàng #${orderId} đã được cập nhật${statusText}` });
                    }
                })
                .on("error", (error) => {
                    console.error("Lỗi khi lắng nghe tin nhắn:", error);
                });
        } catch (error) {
            console.error("Lỗi khi thiết lập listener:", error);
        }
    },
    
};

export default services;
export { getContract };