import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NewProjectForm({ jwt, userData }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!jwt) {
            navigate('/connexion'); // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        } else {
            getCategories(); // Charger les catégories si l'utilisateur est connecté
        }
    }, [jwt, navigate]);

    async function getCategories() {
        try {
            const response = await fetch('http://localhost:3000/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories :', error);
        }
    }

    async function newProject(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {
            project_name: formData.get('projectName'),
            user_uuid: userData.uuid,
            project_description: formData.get('projectDesc'),
            project_category_id: formData.get('category'),
            project_status_id: 1
        };

        const deadline = formData.get('deadline');
        if (deadline) {
            data.project_deadline = formData.get('deadline');
        }


        if (!data.project_name || !data.project_description || !data.project_category_id) {
            setErrorMsg('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify(data)
            });

            if (response.status === 400) {
                setErrorMsg('Ce projet existe déjà');
            } else if (response.status === 201) {
                window.location.href = "/mes-projets"; // Correction de la redirection
            } else {
                setErrorMsg('Erreur lors de la création du projet');
            }
        } catch (error) {
            console.error('Erreur lors de la création du projet', error);
            setErrorMsg('Erreur lors de la création du projet'); // Gestion de l'erreur par défaut
        }
    }

    return (
        <main>
            <form className="new-project-field" action="" method="POST" onSubmit={newProject}>
                <h2>Nouveau Projet</h2>
                <div>
                    <label htmlFor="projectName">Nom du Projet:<span className="required-field">*</span></label>
                    <input type="text" name="projectName" id="projectName" />
                </div>
                <div>
                    <label htmlFor="deadline">Date limite (optionnel):</label>
                    <input type="date" name="deadline" id="deadline" />
                </div>
                <div>
                    <label htmlFor="projectDesc">Description:<span className="required-field">*</span></label>
                    <textarea id="projectDesc" name="projectDesc"></textarea>
                </div>
                <div>
                    <label htmlFor="category">Choisir une categorie:<span className="required-field">*</span></label>
                    <select name="category" id="category">
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        ))}
                    </select>

                </div>
                <fieldset>
                    <legend>Le projet sera:</legend>
                    <div className="radio-field">
                        <input type="radio" id="private" name="projectPrivacy" value="private" defaultChecked />
                        <label htmlFor="private" title="Le projet sera visible seulement par vous et les personnes à qui vous donnerez access">Privé</label>
                    </div>
                    <div className="radio-field">
                        <input type="radio" id="public" name="projectPrivacy" value="public" />
                        <label htmlFor="public" title="Le projet pourra être édité par n'importe quel autre utilisateur">Public</label>
                    </div>
                </fieldset>
                {errorMsg && <p className="error-text">{errorMsg}</p>}
                <button type="submit">Créer</button>
            </form>
        </main >
    )
}

export default NewProjectForm;
