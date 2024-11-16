

/**
 * Récupère l'icône appropriée pour une condition météo donnée.
 * @param {string} condition - La description textuelle de la météo.
 * @returns {string} - Le chemin vers l'icône correspondant.
 */
export const getWeatherIcon = (condition) => {
  const conditionKey = condition.toLowerCase();

  // Gestion des conditions particulières non standard
  if (conditionKey.includes('nuageux')) return icon_nuageux;
  if (conditionKey.includes('couvert')) return icon_nuageux;
  if (conditionKey.includes('averse')) return icon_pluie;
  if (conditionKey.includes('éparse')) return icon_pluie_fine;
  if (conditionKey.includes('bruine')) return icon_pluie_fine;
  if (conditionKey.includes('soleil')) return icon_soleil;
  if (conditionKey.includes('clair')) return icon_nuit;

  
  return WeatherIcons[conditionKey] || icon_peu_soleil; 
};

export default WeatherIcons;
