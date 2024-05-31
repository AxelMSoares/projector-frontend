import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../api/getCategories";
import { createNewProject } from "../../../api/createNewProject";
import { cleanString } from "../../../helpers/functions";

function NewProjectForm({ jwt, userData }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!jwt) {
            navigate('/connexion'); // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        }

        fetchCategories();
    }, [jwt, navigate]);

    async function fetchCategories() {
        try {
            const data = await getCategories(jwt);
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


        if (!cleanString(data.project_name) || !cleanString(data.project_description) || !data.project_category_id) {
            setErrorMsg('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const response = await createNewProject(jwt, data);
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
