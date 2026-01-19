window.onload = (event) => {
  // 1. Remplir la liste déroulante des fiches
  const selectFiche = document.getElementById('ficheSelect');
  FicheData.fiches.forEach(fiche => {
    const option = document.createElement('option');
    option.value = fiche.id;
    option.textContent = fiche.description;
    selectFiche.appendChild(option);
  });

  // 2. Fonction pour mettre à jour l'affichage en fonction de la fiche sélectionnée
  function updateDisplayForFiche(fiche) {
    // Trier les points de passage par ordre croissant
    fiche.PointDePassages.sort((a, b) => a.ordre - b.ordre);

    // Afficher la description de la fiche
    document.getElementById('ficheDescription').textContent = fiche.description;

    // Remplir les listes déroulantes de départ et d’arrivée
    const selectDepart = document.getElementById('depart');
    const selectArrivee = document.getElementById('arrivee');
    selectDepart.innerHTML = '';
    selectArrivee.innerHTML = '';

    fiche.PointDePassages.forEach(point => {
      const option = document.createElement('option');
      option.value = point.ordre;
      option.textContent = `Point ${point.ordre} (${point.nom})`;
      selectDepart.appendChild(option.cloneNode(true));
      selectArrivee.appendChild(option);
    });

    // Générer le tableau
    document.getElementById('tableauPoints').innerHTML = afficherTableau(fiche.PointDePassages);
  }

  // 3. Fonction pour afficher le tableau
  function afficherTableau(points) {
    let tableauHTML = `
      <table>
        <thead>
          <tr>
            <th>Ordre</th>
            <th>Nom</th>
            <th>Lien Google Maps</th>
          </tr>
        </thead>
        <tbody>
    `;

    points.forEach(point => {
      tableauHTML += `
        <tr>
          <td>${point.ordre}</td>
          <td>${point.nom}</td>
          <td>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}&travelmode=driving&avoid=tolls" target="_blank">
              Itinéraire vers ce point
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

  // 4. Écouter le changement de fiche
  selectFiche.addEventListener('change', () => {
    const ficheId = parseInt(selectFiche.value);
    const fiche = FicheData.fiches.find(f => f.id === ficheId);
    updateDisplayForFiche(fiche);
  });

  // 5. Initialiser avec la première fiche
  updateDisplayForFiche(FicheData.fiches[0]);

  // 6. Générer l’itinéraire personnalisé
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
    const pointsSelectionnes = fiche.PointDePassages.filter(
      point => point.ordre >= depart && point.ordre <= arrivee
    );

    // Construire le lien Google Maps avec waypoints
    let waypoints = pointsSelectionnes.map(point => `${point.latitude},${point.longitude}`).join('|');
    const lienItineraire = `https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&destination=${pointsSelectionnes[pointsSelectionnes.length - 1].latitude},${pointsSelectionnes[pointsSelectionnes.length - 1].longitude}&travelmode=driving&avoid=tolls`;

    // Afficher le lien
    document.getElementById('lienItineraire').innerHTML = `
      <a href="${lienItineraire}" target="_blank">
        Ouvrir l’itinéraire dans Google Maps (passant par les points ${depart} à ${arrivee})
      </a>
    `;
  });

  
};
