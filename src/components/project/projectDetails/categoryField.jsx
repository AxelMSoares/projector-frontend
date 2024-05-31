import { useState, useEffect } from 'react';
import { formatDateToYYYYMMDD } from '../../../helpers/functions';
import { getCategories } from '../../../api/getCategories';

export default function CategoryField({ project, jwt, onUpdate, userData }) {

    const [editingCategorie, setEditingCategorie] = useState(false);
    const [categoriesList, setCategoriesList] = useState('');
    const [categorieName, setCategorieName] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [newCategorie, setNewCategorie] = useState('');

    const data = {
        project_status_id: project.project_status_id,
        project_deadline: project.project_deadline ? formatDateToYYYYMMDD(project.project_deadline) : null,
        project_description: project.project_description
    }

    if (newCategorie) {
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
        const response = await getCategories(jwt);
        if (response) {
            setCategoriesList(response);
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
                <p className="detail">Categorie:</p>
                <select onChange={(e) => setNewCategorie(e.target.value)}>
                    {categoriesList.length > 0 && categoriesList.map((category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
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
                <p className="detail">Categorie: <span>{categorieName}</span></p>
                {(userData.username === project.username) ? <div><button className='cat-edit-btn' onClick={() => setEditingCategorie(true)} >Éditer</button></div> : null}
            </div>
        )
    )
}