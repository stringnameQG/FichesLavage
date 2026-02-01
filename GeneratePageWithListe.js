"use strict";
window.onload = (event) => {  
  // Remplir la liste déroulante des fiches
  const selectFiche = document.getElementById('ficheSelect');
  FicheData.fiches.forEach((fiche, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = fiche.description;
    selectFiche.appendChild(option);
  });

  // Fonction pour mettre à jour l'affichage en fonction de la fiche sélectionnée
  function updateDisplayForFiche(fiche) {

    // Remplir les listes déroulantes de départ et d’arrivée
    const selectDepart = document.getElementById('depart');
    const selectArrivee = document.getElementById('arrivee');
    selectDepart.innerHTML = '';
    selectArrivee.innerHTML = '';

    fiche.PointDePassages.forEach((point, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${index} ${point.nom}`;
      selectDepart.appendChild(option.cloneNode(true));
      selectArrivee.appendChild(option);
    });

    // Générer le tableau
    document.getElementById('tableauPoints').innerHTML = afficherTableau(fiche.PointDePassages);
  }

  // Fonction pour afficher le tableau
  function afficherTableau(points) {
    let tableauHTML = `
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Lien Google Maps</th>
          </tr>
        </thead>
        <tbody>
    `;

    points.forEach(point => {
      tableauHTML += `
        <tr>
          <td>${point.nom}</td>
          <td>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}&travelmode=driving&avoid=tolls" target="_blank">
              Itinéraire
            </a>
          </td>
        </tr>
      `;
    });

    tableauHTML += `
        </tbody>
      </table>
    `;

    return tableauHTML;
  }

  // Écouter le changement de fiche
  selectFiche.addEventListener('change', () => {
    const ficheId = parseInt(selectFiche.value);
    localStorage.setItem("lastFicheId", ficheId);
    const fiche = FicheData.fiches[ficheId];
    updateDisplayForFiche(fiche);
  });

  // Initialiser avec la première fiche


  if(localStorage.getItem("lastFicheId") == null || undefined ) {
    localStorage.setItem("lastFicheId", 0);
    updateDisplayForFiche(FicheData.fiches[0]);
  }
  else {
    const defaultValue = localStorage.getItem("lastFicheId");
    updateDisplayForFiche(FicheData.fiches[defaultValue]);
  }
  
  // Générer l’itinéraire personnalisé
  document.getElementById('genererItineraire').addEventListener('click', () => {
    const ficheId = parseInt(selectFiche.value);
    const fiche = FicheData.fiches.find(f => f.id === ficheId);
    const depart = parseInt(document.getElementById('depart').value);
    const arrivee = parseInt(document.getElementById('arrivee').value);

    if (depart >= arrivee) {
      alert("Le point de départ doit être avant le point d’arrivée.");
      return;
    }

    // Filtrer les points entre départ et arrivée (inclus)
    const pointsSelectionnes = fiche.PointDePassages.filter((element, index) => 
      index >= depart && index <= arrivee
    );
    
    // Récupére le point d'arrivée
    const pointArrivee = pointsSelectionnes.pop();

    // Construire le lien Google Maps avec waypoints
    const waypoints = pointsSelectionnes.map(point => `${point.latitude},${point.longitude}`).join('|');

    const lienItineraire = `https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&destination=${pointArrivee.latitude},${pointArrivee.longitude}&travelmode=driving&avoid=tolls`;

    // Afficher le lien
    document.getElementById('lienItineraire').innerHTML = `
      <a href="${lienItineraire}" target="_blank">
        Ouvrir l’itinéraire généré
      </a>
    `;
  });

  
};
