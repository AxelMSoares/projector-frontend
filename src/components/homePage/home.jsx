import React from 'react';

function Home() {

    return (
        <>
            <main>
                <div className="background">
                    <div className="content-wrapper">
                        <div className="slogan">
                            <div className="projector-image1"><img src="/images/sketching.jpg" alt="photo sketch"/></div>
                            <div className="side-text">
                                <h1>Projector pour la gestion de vos projets</h1>
                                <p className="description">Projector est un outil conçu pour vous aider à gérer vos projets. Vous pouvez créer un nouveau projet, ajouter des taches, attribuer des membres au projet, attribuer des taches aux membres, changer le status de chaque tache et de chaque projet, rajouter une limite de temps par projet... Multiples possibilitées s'offrent à vous.</p>
                            </div>
                        </div>
                        <div className="desc-text">
                            <p className="description"><span>Avantages: </span>Projector vous aide en vous proposant une manière efficace, simples et rapide de gérer vos projets. Vous pourrez suivre le progrès de vos projets et collaborer en équipe pour la réalisation et l'avancé de ceux ci.</p>
                            <div className="projector-image2"><img src="/images/framework.jpg" alt="photo framework"/></div>
                            <p className="description"><span>Travail en équipe ou en solo: </span> Vous pourrez travailler seul, en équipe ou avoir l'aide de la communauté dans vos projets. </p>
                            <div className="projector-image3"><img src="/images/architect.jpg" alt="photo architecte"/></div>
                            <p className="description"><span>Flexibilité et personnalisation: </span> Créez vos propres tâches et attribuez les aux differents membres de vos projets. Suivez l'avancé des tâches en équipe.</p>
                            <div className="projector-image4"><img src="/images/teamwork.jpg" alt="photo travail equipe"/></div>
                            <p className="description"><span>Envie de participer à la réalisation des projets de la communauté? </span> Bientôt on integrera une fonction qui vous permettra de postuler à un projet public et de proposer des tâches et solutions. Vous pourrez ainsi aider d'autres personnes à avancer dans leur projet.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;