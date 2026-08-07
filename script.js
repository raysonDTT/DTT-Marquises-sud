const cards = document.getElementById("cards");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

const titreDemarche = document.getElementById("titreDemarche");
const listePieces = document.getElementById("listePieces");


// ========================================
// CARTES DES DOSSIERS PRINCIPAUX
// ========================================

demarches.forEach((demarche) => {

    const carte = document.createElement("div");

    carte.className = "card";

    carte.innerHTML = `

        <div class="icone">
            ${demarche.icone ? demarche.icone : "📄"}
        </div>

        <h3>${demarche.titre}</h3>

        <button>Consulter</button>

    `;


    const bouton = carte.querySelector("button");


    // Le bouton reste uniquement pour les dossiers principaux

    bouton.addEventListener("click", () => {

        ouvrirDossier(demarche);

    });


    cards.appendChild(carte);

});


// ========================================
// OUVERTURE D'UN DOSSIER
// ========================================

function ouvrirDossier(dossier){

    titreDemarche.textContent = dossier.titre;

    listePieces.innerHTML = "";


    // ====================================
    // SOUS-DOSSIERS
    // ====================================

    if(dossier.sousDossiers){

        dossier.sousDossiers.forEach((sous) => {

            const li = document.createElement("li");

            const bouton = document.createElement("button");


            // Le bouton affiche uniquement le nom du thème

            bouton.textContent = sous.titre;

            bouton.className = "sous-bouton";


            // Clic directement sur le thème

            bouton.onclick = () => {

                ouvrirDossier(sous);

            };


            li.appendChild(bouton);

            listePieces.appendChild(li);

        });

    }


    // ====================================
    // AFFICHAGE DES PIÈCES
    // ====================================

    else if(dossier.pieces){

        dossier.pieces.forEach((piece) => {

            const li = document.createElement("li");

            li.textContent = "✔ " + piece;

            listePieces.appendChild(li);

        });

    }


    modal.style.display = "block";

}


// ========================================
// FERMETURE AVEC LE X
// ========================================

closeBtn.onclick = () => {

    modal.style.display = "none";

};


// ========================================
// FERMETURE EN CLIQUANT À L'EXTÉRIEUR
// ========================================

window.onclick = (e) => {

    if(e.target === modal){

        modal.style.display = "none";

    }

};
