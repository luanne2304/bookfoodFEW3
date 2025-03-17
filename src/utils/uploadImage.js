import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./fire_base"; // Make sure the path is correct

const uploadImage = async (file) => {
    if (!file) return null;
    try {
        // Create a unique filename
        const uniqueFileName = `bookfood/${uuidv4()}_${file.name}`;
        
        // Create a reference to the file location in Firebase storage
        const storageRef = ref(storage, uniqueFileName);
        
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get and return the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Ảnh đã upload:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        return null;
    }
};

export default uploadImage;
