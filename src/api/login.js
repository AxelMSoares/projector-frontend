export async function login(loginData, csrfToken) {

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify(loginData),
            credentials: 'include'
        });

        if (response.status !== 200) {
            return ({ message: 'Login failed' });
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Une erreur est survenue lors de la connexion");
    }
}