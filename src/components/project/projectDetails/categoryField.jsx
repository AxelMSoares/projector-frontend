import { useState, useEffect } from 'react';
import { formatDateToYYYYMMDD } from '../../../helpers/functions';

export default function CategoryField({ project, jwt, onUpdate, userData }) {

    const [editingCategorie, setEditingCategorie] = useState(false);
    const [categoriesList, setCategoriesList] = useState('');
    const [categorieName, setCategorieName] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [newCategorie, setNewCategorie] = useState('');

    const data = {
        project_status_id: project.project_status_id,
        project_deadline: formatDateToYYYYMMDD(project.project_deadline),
        project_description: project.project_description
    }

    if (newCategorie){
        data.project_category_id = newCategorie;
    } else {
        data.project_category_id = 1;
    }

    useEffect(() => {
        setCategorieId(project.project_category_id
        );
        setCategorieName(project.category_name);
        getCategoriesList();
    }, [project]);

    async function getCategoriesList() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCategoriesList(data);
            } else {
                console.error('Erreur lors de la récupération des catégories:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error.message);
        }
    }

    async function updateProjectCategorie(data) {
        // Send the updated data to the server
        onUpdate(data);
        // Close the editing field
        setEditingCategorie(false);
        // Reinit the newCategorie state after the update
        setNewCategorie('');
    }


    return (
        editingCategorie ? (
            <div className='project-categorie-field'>
                <select onChange={(e) => setNewCategorie(e.target.value)}>
                    {categoriesList.map((category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    )))}
                </select>
                <button className='cat-edit-btn' onClick={() => updateProjectCategorie(data)} >Valider</button>
                <button className='cat-edit-btn' onClick={() => {
                    setEditingCategorie(false);
                    setNewCategorie(categorieId);
                }} >Annuler</button>
            </div >
        ) : (
        <div className='project-categorie-field'>
            <p className="detail">Categorie: <span>{categorieName}</span></p>
            { (userData.username === project.username) ? <div><button className='cat-edit-btn' onClick={() => setEditingCategorie(true)} >Éditer</button></div> : null}
        </div>
    )
    )
}