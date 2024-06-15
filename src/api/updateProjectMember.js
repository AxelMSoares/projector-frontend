export async function UpdateProjectMember(jwt, memberId, newRole) {
    try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/update/${memberId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt,
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Une erreur est survenue lors de la mise à jour du rôle du membre", data.error);
            } 

        } catch (error) {
            console.log("Une erreur est survenue lors de la mise à jour du rôle du membre", error);
        }
}