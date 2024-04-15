import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NewProjectForm({jwt}) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwt) {
            navigate('/connexion'); // If the user is not connected, redirect to the login page
        }
    }, [jwt, navigate]);
    
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
                    <select name="category" id="category"></select>
                </div>
                <fieldset>
                    <legend>Le projet sera:</legend>
                    <div className="radio-field">
                        <input type="radio" id="private" name="projectPrivacy" value="private" defaultChecked />
                        <label htmlFor="private" title="Le projet sera visible seulement par vous et les personnes à qui vous donnerez access">Privé</label>
                    </div>
                    <div className="radio-field">
                        <input type="radio" id="public" name="projectPrivacy" value="public" />
                        <label htmlFor="public" title="Le projet pourra être edité par n'importe quel autre utilisateur">Public</label>
                    </div>
                </fieldset>
                <button type="submit">Créer</button>
            </form>
        </main >
    )
}

export default NewProjectForm;