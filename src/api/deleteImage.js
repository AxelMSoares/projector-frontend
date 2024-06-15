export async function deleteImage(jwt, imageName) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload/${imageName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': jwt,
        'CSRF-Token': csrfToken
      }
    });

  // If the request is successful, return a message in the response
    if (response.ok) {
      return { message: 'Image deleted successfully' };
    }

  } catch (error) {
    console.log(error);
  }
}