import { useState, useEffect } from 'react';

export default function DescriptionField(project, userData, onUpdate) {
    const [description, setDescription] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState(project.project_description || '');

    useEffect(() => {
        setDescription(project.project.project_description);
    }, [project.project.project_description]);

    return (
        <p className="detail">Description: <span>{description}</span></p>
    )
}