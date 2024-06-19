export async function getCSRFToken() {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/csrf-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        const data = await response.json();
        return data.csrfToken;
    } catch (error) {
        console.error('Erreur lors de la récupération du jeton CSRF', error);
        throw error;
    }
}