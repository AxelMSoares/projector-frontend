import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectList({ jwt }) {

    const navigate = useNavigate();

    useEffect(() => {
        if (!jwt) {
            navigate('/connexion'); // If the user is not connected, redirect to the login page
        }
    }, [jwt, navigate]);

    return (
        <main>
            { jwt ? (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    <p className="no-project">Vous n'avez pas de projets en cours</p>
                </div>
            ) : (null)}
        </main>
    );
}


export default ProjectList;