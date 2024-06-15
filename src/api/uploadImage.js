export async function uploadImage(image, jwt, csrfToken) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': jwt,
        'CSRF-Token': csrfToken
      },
      body: formData,
      credentials: 'include'
    });

    if (response.ok) {
      return response.json();
    }

  } catch (error) {
    console.log(error);
  }
}