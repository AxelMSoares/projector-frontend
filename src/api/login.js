export async function login(loginData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.status !== 200) {
            window.alert('Utilisateur ou mot de passe incorrects');
            return;
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log("Une erreur est survenue lors de la connexion", error);
    }
}