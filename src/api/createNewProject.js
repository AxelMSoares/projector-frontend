export async function createNewProject(jwt, data) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(data)
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