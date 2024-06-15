export async function deleteProjectMessage(jwt, csrfToken, messageId) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/delete/${messageId}` , {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error);
    }
}