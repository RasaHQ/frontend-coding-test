/**
 * delete entity form a list of entities by its start and end positions
 * @param  {Object} entity
 * @param  {Array} list
 * @return {Array}
 */
export const deleteEntity = (entity = {}, entities = [] ) => {
  const deleted = entities.findIndex(e => e.start === entity.start && e.end === entity.end && e.label === entity.label);
  return entities.filter((_, i) => i !== deleted)
}

/**
 * Converts a string to a 32bit integer (used to generate a random number in order to pick a random number from a list)
 * @param  {String} str
 * @return {Number}
 */
export function hashString(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash > 0 ? hash : -hash;
}