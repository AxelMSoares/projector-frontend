function NewProjectForm() {
    return (
        <main>
            <form class="new-project-field" action="" method="POST">
                <h2>Nouveau Projet</h2>
                <div>
                    <label for="projectName">Nom du Projet:<span class="required-field">*</span></label>
                    <input type="text" name="projectName" id="projectName" />
                </div>
                <div>
                    <label for="deadline">Date limite (optionnel):</label>
                    <input type="date" name="deadline" id="deadline" />
                </div>
                <div>
                    <label for="projectDesc">Description:<span class="required-field">*</span></label>
                    <textarea id="projectDesc" name="projectDesc"></textarea>
                </div>
                <div>
                    <label for="category">Choisir une categorie:<span class="required-field">*</span></label>
                </div>
                <fieldset>
                    <legend>Le projet sera:</legend>
                    <div class="radio-field">
                        <input type="radio" id="private" name="projectPrivacy" value="private" checked />
                        <label for="private" title="Le projet sera visible seulement par vous et les personnes à qui vous donnerez access">Privé</label>
                    </div>
                    <div class="radio-field">
                        <input type="radio" id="public" name="projectPrivacy" value="public" />
                        <label for="public" title="Le projet pourra être edité par n'importe quel autre utilisateur">Public</label>
                    </div>
                </fieldset>
                <button type="submit">Créer</button>
            </form>
        </main >
    )
}

export default NewProjectForm;