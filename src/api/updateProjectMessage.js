export async function updateProjectMessage(jwt, csrfToken, messageId, newContent) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/update/${messageId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify({ message_content: newContent }),
            credentials: 'include'
        });
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour du message du projet');
    }
}