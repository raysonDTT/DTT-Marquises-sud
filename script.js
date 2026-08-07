const cards = document.getElementById("cards");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const retourBtn = document.getElementById("retour");

const titreDemarche = document.getElementById("titreDemarche");
const listePieces = document.getElementById("listePieces");

const recherche = document.getElementById("recherche");


// ========================================
// HISTORIQUE DES DOSSIERS
// ========================================

let historique = [];


// ========================================
// AFFICHER LES DOSSIERS PRINCIPAUX
// ========================================

function afficherCartes(liste) {

    cards.innerHTML = "";


    liste.forEach((demarche) => {

        const carte = document.createElement("div");

        carte.className = "card";


        carte.innerHTML = `
            <div class="icone">
                ${demarche.icone ? demarche.icone : "📄"}
            </div>

            <h3>${demarche.titre}</h3>

            <button type="button">Consulter</button>
        `;


        const bouton = carte.querySelector("button");


        bouton.onclick = function () {

            historique = [];

            afficherDossier(demarche);

        };


        cards.appendChild(carte);

    });

}


// ========================================
// AFFICHAGE INITIAL
// ========================================

afficherCartes(demarches);


// ========================================
// RECHERCHE
// ========================================

if (recherche) {

    recherche.addEventListener("input", function () {

        const texte = recherche.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();


        // Si la recherche est vide,
        // on affiche tous les dossiers
        if (texte === "") {

            afficherCartes(demarches);

            return;

        }


        // Recherche uniquement dans les dossiers principaux
        const resultats = demarches.filter((demarche) => {

            const titre = demarche.titre
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");


            return titre.includes(texte);

        });


        afficherCartes(resultats);

    });

}


// ========================================
// AFFICHER UN DOSSIER
// ========================================

function afficherDossier(dossier) {

    titreDemarche.textContent = dossier.titre;

    listePieces.innerHTML = "";


    // ====================================
    // SOUS-DOSSIERS
    // ====================================

    if (dossier.sousDossiers) {

        dossier.sousDossiers.forEach((sous) => {

            const li = document.createElement("li");

            const bouton = document.createElement("button");

            bouton.type = "button";

            bouton.className = "sous-bouton";

            bouton.textContent = sous.titre;


            bouton.onclick = function () {

                // On mémorise le dossier actuel
                historique.push(dossier);

                // On ouvre le sous-dossier
                afficherDossier(sous);

            };


            li.appendChild(bouton);

            listePieces.appendChild(li);

        });

    }


    // ====================================
    // PIÈCES
    // ====================================

    if (dossier.pieces) {

        dossier.pieces.forEach((piece) => {

            const li = document.createElement("li");

            li.textContent = "✔ " + piece;

            listePieces.appendChild(li);

        });

    }


    // ====================================
    // BOUTON RETOUR
    // ====================================

    if (historique.length > 0) {

        retourBtn.style.display = "inline-block";

    } else {

        retourBtn.style.display = "none";

    }


    // ====================================
    // OUVRIR LA FENÊTRE
    // ====================================

    modal.style.display = "block";

}


// ========================================
// BOUTON RETOUR
// ========================================

retourBtn.onclick = function () {

    if (historique.length === 0) {

        return;

    }


    const dossierPrecedent = historique.pop();


    afficherDossier(dossierPrecedent);

};


// ========================================
// CROIX
// ========================================

closeBtn.onclick = function () {

    modal.style.display = "none";

    historique = [];

    retourBtn.style.display = "none";

};


// ========================================
// CLIQUER EN DEHORS DE LA FENÊTRE
// ========================================

window.onclick = function (e) {

    if (e.target === modal) {

        modal.style.display = "none";

        historique = [];

        retourBtn.style.display = "none";

    }

};
