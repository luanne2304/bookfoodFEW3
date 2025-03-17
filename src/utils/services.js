import Web3 from "web3";
import contractData from "../contracts/Bookfood.json"

const abi = contractData.abi;
const contractAddress = "0x38dda5a302b6b882d1550bd8a4fefc628320bba0";

const initContract = async (useWebsocket = false) => {
    // URL cho HTTP provider
    const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    // URL cho WebSocket provider (BSC Testnet WebSocket)
    const wsURL = "wss://bsc-testnet.publicnode.com";

    // Chọn provider theo yêu cầu
    const web3 = useWebsocket 
        ? new Web3(new Web3.providers.WebsocketProvider(wsURL))
        : new Web3(new Web3.providers.HttpProvider(rpcURL));
    
    // Tạo tài khoản từ private key
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
        throw new Error("Private Key chưa được nhập!");
    }
    const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
    web3.eth.accounts.wallet.add(account);
    
    // Khởi tạo contract
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    return { web3, contract, account };
};

const sendTransaction = async (methodName, ...params) => {
    try {
        const { web3, contract, account } = await initContract();
        const method = methodName(...params);
        const gas = await method.estimateGas({ from: account.address });
        const gasWithBuffer = gas * 12n / 10n;
        const txData = await method.send({ from: account.address, gas: gasWithBuffer });
        console.log("Giao dịch thành công:", txData);
        return txData;
    } catch (error) {
        console.error("Lỗi giao dịch:", error);
        throw error;    
    }
};

const services = {
    createRestaurant: async (name, houseNumber, street, ward, district, city, ownerAddress) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.addRestaurant, name, houseNumber, street, ward, district, city, ownerAddress);
    },

    createCategory: async (name) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.addCategory, name);
    },

    getAllCategories: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllCategory().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân loại:", error);
            return [];
        }
    },

    getAllRestaurants: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllRestaurants().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà hàng:", error);
            return [];
        }
    },

    getOrder: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.orders(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
            return [];
        }
    },

    getRes: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.restaurants(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy nhà hàng:", error);
            return [];
        }
    },

    getAllFoods: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllFoods().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thức ăn:", error);
            return [];
        }
    },

    getAllOrders: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllOrders().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            return [];
        }
    },

    getOrderHistory: async () => {
        const { contract, account } = await initContract();
        try {
            return await contract.methods.getOrdersBySender().call({ from: account.address });
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            return [];
        }
    },

    getOrderDetail: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getOrderDetails(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            return [];
        }
    },

    updateOrderStatus: async (orderId, status) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.updateOrderStatus, orderId, status);
    },

    rating: async (id, reviews, star) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.addRating, id, reviews, star);
    },

    createFood: async (name, idres, cate, price, isVegan, isGlutenFree,img) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.addFood, name, idres, cate, price, isVegan, isGlutenFree,img);
    },

    createOrder: async (payment, _foodIds, _quantities, UsePoint, note) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.placeOrder, payment, _foodIds, _quantities, UsePoint, note);
    },

    searchFood: async (keyword) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.searchFood(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm món ăn:", error);
            return [];
        }
    },

    searchRestaurants: async (keyword) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.searchRestaurants(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm nhà hàng:", error);
            return [];
        }
    },

    getRatingByID: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getRatingsForFood(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", error);
            return [];
        }
    },

    chat: async (to, mess) => {
        const { contract } = await initContract();
        return sendTransaction(contract.methods.sendMessage, to, mess);
    },

    payment: async (id, value) => {
        const { web3, contract, account } = await initContract();
        
        try {
            const formattedValue = (parseFloat(value) / 1000).toString();
            const weiValue = web3.utils.toWei(formattedValue, "ether");
            const method = contract.methods.processPayment(id);
            const gas = await method.estimateGas({ 
                from: account.address, 
                value: weiValue 
            });
            
            const txData = await method.send({ 
                from: account.address, 
                gas: gas * 12n / 10n, 
                value: weiValue 
            });
            
            console.log("Giao dịch thanh toán thành công:", txData);
            return txData;
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            throw error;
        }
    },

    listenForMessages: async (callback) => {
        try {
            // Sử dụng WebSocket provider cho events
            const { contract, account } = await initContract(true);
            
            if (!contract || !account) {
                console.error("Lỗi: Contract hoặc account chưa được khởi tạo.");
                return;
            }
            
            console.log("Đang lắng nghe tin nhắn cho địa chỉ:", account.address);
            
            contract.events.MessageSent()
            .on("data", (event) => {
                console.log("📩 Nhận được sự kiện tin nhắn:", event);

                const { receiver, sender, message } = event.returnValues;
                console.log(`💬 Gửi từ ${sender} đến ${receiver}: ${message}`);

                if (receiver.toLowerCase() === account.address.toLowerCase()) {
                    console.log("✅ Tin nhắn đến đúng người nhận:", { sender, message });
                    callback({ sender, message });
                }
            })
            .on("error", (error) => {
                console.error("🚨 Lỗi khi lắng nghe sự kiện tin nhắn:", error);
            });
        } catch (error) {
            console.error("Lỗi khi thiết lập listener tin nhắn:", error);
        }
    },

    listenForUpdateOrder: async (callback) => {
        try {
            // Bắt buộc dùng WebSocket Provider
            const { contract, account } = await initContract(true);
            if (!contract || !account) {
                console.error("Lỗi: Contract hoặc account chưa được khởi tạo.");
                return;
            }
    
            console.log("📡 Đang lắng nghe cập nhật đơn hàng cho địa chỉ:", account.address);
    
            contract.events.OrderStatusUpdated()
                .on("data", (event) => {
                    console.log("📩 Nhận được sự kiện cập nhật đơn hàng:", event);
    
                    const { orderId, customer, status } = event.returnValues;
                    console.log(`📦 Đơn hàng ${orderId} của ${customer} -> Trạng thái: ${status}`);
    
                    if (customer.toLowerCase() === account.address.toLowerCase()) {
                        let statusText = {
                            "0": "Đang chờ xác nhận",
                            "1": "Đang chuẩn bị món",
                            "2": "Đã giao"
                        }[status] || "Không xác định";
    
                        console.log("✅ Đơn hàng cập nhật:", { orderId, statusText });
    
                        callback({ sender: "Hệ thống", message: `📦 Đơn hàng #${orderId} đã được cập nhật: ${statusText}` });
                    }
                })
                .on("error", (error) => {
                    console.error("🚨 Lỗi khi lắng nghe sự kiện cập nhật đơn hàng:", error);
                });
        } catch (error) {
            console.error("🚨 Lỗi khi thiết lập listener đơn hàng:", error);
        }
    },
    
};

export default services;