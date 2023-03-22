// Generation de la date et l'heure local
function serverDate() {
    const date = new Date();
    const options = { timeZone: 'Africa/Libreville' };
    const dateGabon = date.toLocaleString('fr-FR', options);
    return dateGabon;
}

module.exports = serverDate;