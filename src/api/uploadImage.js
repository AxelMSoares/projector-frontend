export async function uploadImage(image) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_UPLOAD_URL}`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      return response.json();
    }

  } catch (error) {
    console.log(error);
  }
}