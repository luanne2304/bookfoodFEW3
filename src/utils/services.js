import Web3 from "web3";

const contractAddress = "0x6c6b2a056783ccdcdb0f8164774c6910f1d43aca";
const contractABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "num",
                    "type": "uint256"
                }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "retrieve",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
] 
const getContract = async () => {
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
};

export default services;