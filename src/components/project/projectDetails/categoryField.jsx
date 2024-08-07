import { useState, useEffect } from 'react';
import { formatDateToYYYYMMDD } from '../../../helpers/functions';
import { getCategories } from '../../../api/getCategories';
import { useCSRFToken } from '../../../context/CSRFTokenContext';
import DOMPurify from 'dompurify';

export default function CategoryField({ project, jwt, onUpdate, userData }) {

    const [editingCategorie, setEditingCategorie] = useState(false);
    const [categoriesList, setCategoriesList] = useState('');
    const [categorieName, setCategorieName] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [newCategorie, setNewCategorie] = useState('');
    const csrfToken = useCSRFToken();

    const data = {
        project_status_id: project.project_status_id,
        project_deadline: project.project_deadline ? formatDateToYYYYMMDD(project.project_deadline) : null,
        project_description: project.project_description
    }

    if (newCategorie) {
        data.project_category_id = newCategorie;
    } else {
        data.project_category_id = project.project_category_id;
    }

    useEffect(() => {
        setCategorieId(project.project_category_id);
        setCategorieName(project.category_name);
        if (csrfToken && jwt) {
            getCategoriesList();
        }
    }, [project]);

    async function getCategoriesList() {
        const response = await getCategories(jwt, csrfToken);
        if (response) {
            setCategoriesList(response);
        }

    }

    async function updateProjectCategorie(data) {
        // Send the updated data to the server
        onUpdate(data);
        // Reinit the newCategorie state after the update
        setNewCategorie('');
        // Close the editing field
        setEditingCategorie(false);
    }


    return (
        editingCategorie ? (
            <div className='project-categorie-field'>
                <p className="detail">Categorie:</p>
                <select onChange={(e) => setNewCategorie(e.target.value)}>
                    <option value="" disabled selected>Choisir une Catégorie</option>
                    {categoriesList.length > 0 && categoriesList.map((category => (
                        <option key={category.id} value={category.id}>{DOMPurify.sanitize(category.category_name)}</option>
                    )))}
                </select>
                <button className='category-confirm-btn' onClick={() => updateProjectCategorie(data)} >Valider</button>
                <button className='category-cancel-btn' onClick={() => {
                    setEditingCategorie(false);
                    setNewCategorie(categorieId);
                }} >Annuler</button>
            </div >
        ) : (
            <div className='project-categorie-field'>
                <p className="detail">Categorie: <span>{DOMPurify.sanitize(categorieName)}</span></p>
                {(userData.username === project.username) ? <div><button className='cat-edit-btn' onClick={() => setEditingCategorie(true)} >Éditer</button></div> : null}
            </div>
        )
    )
}