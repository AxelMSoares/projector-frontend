import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NewProjectForm({ jwt }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

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

    console.log (categories);

    return (
        <main>
            <form className="new-project-field" action="" method="POST">
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
                <button type="submit">Créer</button>
            </form>
        </main >
    )
}

export default NewProjectForm;
