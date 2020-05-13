import axios from "axios";

export async function deleteImage(imageData) {
    let imageToDelete = imageData;
    imageToDelete = imageToDelete.split(",");

    try {
        await axios.post(`${process.env.REACT_APP_SERVER}/api/delete-image`, {
        id: imageToDelete[1]
        });
    } catch (err) {
        console.error(`Error Deleting Image =>`, err);
    }
}
