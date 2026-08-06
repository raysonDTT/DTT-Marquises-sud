const cards = document.getElementById("cards");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

const titreDemarche = document.getElementById("titreDemarche");
const listePieces = document.getElementById("listePieces");


// Création des cartes principales

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


    bouton.addEventListener("click", () => {

        ouvrirDossier(demarche);

    });


    cards.appendChild(carte);


});





// Fonction ouverture dossier

function ouvrirDossier(dossier){


    titreDemarche.textContent = dossier.titre;


    listePieces.innerHTML = "";



    // Si le dossier contient des sous-dossiers

    if(dossier.sousDossiers){


        dossier.sousDossiers.forEach((sous) => {


            const li = document.createElement("li");


            const bouton = document.createElement("button");


            bouton.textContent = "Consulter : " + sous.titre;


            bouton.className = "sous-bouton";



            bouton.onclick = () => {


                ouvrirDossier(sous);


            };



            li.appendChild(bouton);


            listePieces.appendChild(li);


        });


    }



    // Si le dossier contient des pièces

    else if(dossier.pieces){



        dossier.pieces.forEach((piece)=>{


            const li = document.createElement("li");


            li.textContent = "✔ " + piece;


            listePieces.appendChild(li);


        });


    }



    modal.style.display = "block";


}





// Fermeture avec le X

closeBtn.onclick = () => {


    modal.style.display = "none";


};





// Fermeture en cliquant dehors

window.onclick = (e)=>{


    if(e.target === modal){


        modal.style.display = "none";


    }


};