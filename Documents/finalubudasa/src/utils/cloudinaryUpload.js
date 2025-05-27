// utils/cloudinaryUpload.js
import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const cloudName = 'deg5swakx'; // 🔁 Replace with your actual cloud name
  const uploadPreset = 'employee_preset'; // 🔁 Set this in your Cloudinary account (see step 4 below)

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
  return response.data.secure_url;
};
