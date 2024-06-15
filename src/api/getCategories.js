export async function getCategories(jwt) {
    try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                    'CSRF-Token': csrfToken
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors du chargement des catégories :', error);
        }
}