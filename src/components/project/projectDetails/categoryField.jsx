import { useState, useEffect } from 'react';

export default function CategoryField(project) {

    const [categorie, setCategorie] = useState('');
    const [editingCategorie, setEditingCategorie] = useState(false);
    const [newCategorie, setNewCategorie] = useState(project.project.category_name || '');
    
    useEffect(() => {
        setCategorie(project.project.category_name);
    } , [project]);


    return (
        <p className="detail">Categorie: <span>{categorie}</span></p>
    )
}