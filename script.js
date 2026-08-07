// ========================================
// SCRIPT.JS
// ========================================

alert("SCRIPT.JS EST BIEN CHARGÉ");


// ========================================
// ÉLÉMENTS HTML
// ========================================

const cards = document.getElementById("cards");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const retourBtn = document.getElementById("retour");
const titreDemarche = document.getElementById("titreDemarche");
const listePieces = document.getElementById("listePieces");
const recherche = document.getElementById("recherche");


// ========================================
// HISTORIQUE
// ========================================

let historique = [];


// ========================================
// AFFICHER LES CARTES
// ========================================

function afficherCartes(liste) {

    cards.innerHTML = "";

    liste.forEach(function(demarche) {

        const carte = document.createElement("div");

        carte.className = "card";

        carte.innerHTML = `
            <div class="icone">
                ${demarche.icone || "📄"}
            </div>

            <h3>${demarche.titre}</h3>

            <button type="button">
                Consulter
            </button>
        `;

        const bouton = carte.querySelector("button");

        bouton.addEventListener("click", function() {

            historique = [];

            afficherDossier(demarche);

        });

        cards.appendChild(carte);

    });

}


// ========================================
// NORMALISER
// ========================================

function normaliser(texte) {

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


// ========================================
// RECHERCHE
// ========================================

function rechercherDossiers(texte) {

    const rechercheTexte = normaliser(texte);

    const resultats = [];

    demarches.forEach(function(demarche) {

        if (
            normaliser(demarche.titre)
                .includes(rechercheTexte)
        ) {

            resultats.push({
                dossier: demarche
            });

        }

        rechercherSousDossiers(
            demarche,
            resultats,
            rechercheTexte
        );

    });

    return resultats;

}


// ========================================
// RECHERCHE SOUS-DOSSIERS
// ========================================

function rechercherSousDossiers(
    dossier,
    resultats,
    rechercheTexte
) {

    if (!dossier.sousDossiers) {
        return;
    }

    dossier.sousDossiers.forEach(function(sous) {

        if (
            normaliser(sous.titre)
                .includes(rechercheTexte)
        ) {

            resultats.push({
                dossier: sous
            });

        }

        rechercherSousDossiers(
            sous,
            resultats,
            rechercheTexte
        );

    });

}


// ========================================
// AFFICHER RÉSULTATS
// ========================================

function afficherResultatsRecherche(resultats) {

    cards.innerHTML = "";

    resultats.forEach(function(resultat) {

        const dossier = resultat.dossier;

        const carte = document.createElement("div");

        carte.className = "card";

        carte.innerHTML = `
            <div class="icone">
                ${dossier.icone || "📄"}
            </div>

            <h3>${dossier.titre}</h3>

            <button type="button">
                Consulter
            </button>
        `;

        carte.querySelector("button")
            .addEventListener("click", function() {

                historique = [];

                afficherDossier(dossier);

            });

        cards.appendChild(carte);

    });

}


// ========================================
// AFFICHER UN DOSSIER
// ========================================

function afficherDossier(dossier) {

    titreDemarche.textContent = dossier.titre;

    // IMPORTANT :
    // On vide complètement l'ancienne liste.
    listePieces.innerHTML = "";


// ========================================
// SOUS-DOSSIERS
// ========================================

    if (dossier.sousDossiers) {

        dossier.sousDossiers.forEach(function(sous) {

            const li = document.createElement("li");

            const bouton = document.createElement("button");

            bouton.type = "button";

            bouton.className = "sous-bouton";

            bouton.textContent = sous.titre;

            bouton.addEventListener("click", function() {

                historique.push(dossier);

                afficherDossier(sous);

            });

            li.appendChild(bouton);

            listePieces.appendChild(li);

        });

    }


// ========================================
// PIÈCES
// ========================================

    if (dossier.pieces) {

        dossier.pieces.forEach(function(piece) {

            const li = document.createElement("li");

            // On enlève toute ancienne présentation
            li.innerHTML = "";

            const label = document.createElement("label");

            label.className = "piece-label";

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.className =
                "piece-checkbox";

            const texte =
                document.createElement("span");

            texte.textContent = piece;

            label.appendChild(checkbox);

            label.appendChild(texte);

            li.appendChild(label);

            listePieces.appendChild(li);

        });

    }


// ========================================
// BOUTON RETOUR
// ========================================

    if (historique.length > 0) {

        retourBtn.style.display = "inline-block";

    } else {

        retourBtn.style.display = "none";

    }


// ========================================
// OUVRIR LA FENÊTRE
// ========================================

    modal.style.display = "block";

}


// ========================================
// BOUTON RETOUR
// ========================================

retourBtn.addEventListener("click", function() {

    if (historique.length === 0) {
        return;
    }

    const precedent = historique.pop();

    afficherDossier(precedent);

});


// ========================================
// CROIX
// ========================================

closeBtn.addEventListener("click", function() {

    modal.style.display = "none";

    historique = [];

    retourBtn.style.display = "none";

});


// ========================================
// CLIC EN DEHORS
// ========================================

window.addEventListener("click", function(e) {

    if (e.target === modal) {

        modal.style.display = "none";

        historique = [];

        retourBtn.style.display = "none";

    }

});


// ========================================
// RECHERCHE
// ========================================

if (recherche) {

    recherche.addEventListener("input", function() {

        const texte = recherche.value.trim();

        if (texte === "") {

            afficherCartes(demarches);

            return;

        }

        const resultats =
            rechercherDossiers(texte);

        afficherResultatsRecherche(resultats);

    });

}


// ========================================
// AFFICHAGE INITIAL
// ========================================

afficherCartes(demarches);
