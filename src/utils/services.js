import Web3 from "web3";

const getContract = async () => {
    // Kiểm tra xem biến môi trường có tồn tại không
    if (!process.env.REACT_APP_CONTRACT_ADDRESS || !process.env.REACT_APP_CONTRACT_ABI) {
        console.error("Thiếu biến môi trường cho contract");
        throw new Error("Thiếu cấu hình contract");
    }
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    // Đảm bảo parse ABI một cách an toàn
    let contractABI;
    try {
        contractABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
    } catch (error) {
        console.error("Lỗi khi parse ABI:", error);
        throw new Error("ABI không hợp lệ");
    }
    
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

    getAllFoods: async () => {
        try {
            const { contract } = await getContract();
            const foods = await contract.methods.getAllFoods().call();
            return foods; // Trả về danh sách restaurant
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thức ăn:", error);
            return [];
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
};

export default services;