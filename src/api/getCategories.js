export async function getCategories(jwt, csrfToken) {
    try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                    'CSRF-Token': csrfToken
                },
                credentials: 'include'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors du chargement des catégories :', error);
        }
}