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
// NORMALISER LE TEXTE
// ========================================

function normaliser(texte) {

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


// ========================================
// RECHERCHER DANS LES DOSSIERS
// ========================================

function rechercherDossiers(texte) {

    const rechercheTexte = normaliser(texte);

    const resultats = [];


    demarches.forEach((demarche) => {

        // Le dossier principal correspond
        if (normaliser(demarche.titre).includes(rechercheTexte)) {

            resultats.push({
                dossier: demarche,
                parent: null
            });

        }


        // Recherche dans les sous-dossiers
        rechercherSousDossiers(
            demarche,
            demarche,
            resultats,
            rechercheTexte
        );

    });


    return resultats;

}


// ========================================
// RECHERCHE RÉCURSIVE DES SOUS-DOSSIERS
// ========================================

function rechercherSousDossiers(
    dossierPrincipal,
    dossier,
    resultats,
    rechercheTexte
) {

    if (!dossier.sousDossiers) {

        return;

    }


    dossier.sousDossiers.forEach((sous) => {

        if (normaliser(sous.titre).includes(rechercheTexte)) {

            resultats.push({
                dossier: sous,
                parent: dossierPrincipal
            });

        }


        // Chercher encore plus profondément
        rechercherSousDossiers(
            dossierPrincipal,
            sous,
            resultats,
            rechercheTexte
        );

    });

}


// ========================================
// AFFICHER LES RÉSULTATS DE RECHERCHE
// ========================================

function afficherResultatsRecherche(resultats) {

    cards.innerHTML = "";


    resultats.forEach((resultat) => {

        const carte = document.createElement("div");

        carte.className = "card";


        const dossier = resultat.dossier;


        carte.innerHTML = `
            <div class="icone">
                ${dossier.icone ? dossier.icone : "📄"}
            </div>

            <h3>${dossier.titre}</h3>

            <button type="button">Consulter</button>
        `;


        const bouton = carte.querySelector("button");


        bouton.onclick = function () {

            historique = [];


            // Si le résultat est un sous-dossier,
            // on mémorise son chemin jusqu'au dossier principal.

            if (resultat.parent) {

                construireHistorique(
                    resultat.parent,
                    dossier
                );

            }


            afficherDossier(dossier);

        };


        cards.appendChild(carte);

    });

}


// ========================================
// CONSTRUIRE L'HISTORIQUE
// ========================================

function construireHistorique(parent, dossierRecherche) {

    historique = [];


    // On retrouve le chemin depuis le dossier principal
    demarches.forEach((demarche) => {

        if (contientDossier(demarche, dossierRecherche)) {

            trouverChemin(
                demarche,
                dossierRecherche,
                []
            );

        }

    });

}


// ========================================
// TROUVER LE CHEMIN DU DOSSIER
// ========================================

function trouverChemin(
    dossier,
    cible,
    chemin
) {

    if (dossier === cible) {

        historique = chemin.slice();

        return true;

    }


    if (!dossier.sousDossiers) {

        return false;

    }


    for (const sous of dossier.sousDossiers) {

        if (
            trouverChemin(
                sous,
                cible,
                [...chemin, dossier]
            )
        ) {

            return true;

        }

    }


    return false;

}


// ========================================
// VÉRIFIER SI UN DOSSIER EST PRÉSENT
// ========================================

function contientDossier(dossier, cible) {

    if (dossier === cible) {

        return true;

    }


    if (!dossier.sousDossiers) {

        return false;

    }


    return dossier.sousDossiers.some(
        (sous) => contientDossier(sous, cible)
    );

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

        const texte = recherche.value.trim();


        if (texte === "") {

            afficherCartes(demarches);

            return;

        }


        const resultats = rechercherDossiers(texte);


        afficherResultatsRecherche(resultats);

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

                historique.push(dossier);

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
