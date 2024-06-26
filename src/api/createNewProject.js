export async function createNewProject(jwt, csrfToken, data) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (response.status === 201) {
            window.location.href = "/mes-projets"; // Correction de la redirection
        } else {
            setErrorMsg('Erreur lors de la création du projet');
        }
    } catch (error) {
        console.error('Erreur lors de la création du projet', error);
    }
}