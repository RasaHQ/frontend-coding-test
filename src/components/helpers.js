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
 * TODO: add test if considered unpredictable
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

/**
 * Change the text looping over the entities list and recursively check if their start and end locations are still relevant. If not, update to the new locations. The function returns the new entities list.
 * @param  {String} newText
 * @param  {String} oldText
 * @param  {oldEntities} list
 * @return {Array}
 */
export const updateEntitiesAfterTextChange = (newText, oldText, oldEntities) => {
  const entities = [];

  // update the entity boundaries
  oldEntities.forEach(oldEntity => {
    const oldSelection = oldText.substr(oldEntity.start, oldEntity.end - oldEntity.start);

    // TODO: for perf, move the function outside of the loop, preferably after it was tested properly.
    function findClosestStart(lastMatch) {
      if (lastMatch == null) {
        const index = newText.indexOf(oldSelection);
        if (index === -1) {
          return index;
        }
        return findClosestStart(index);
      }
      const from = lastMatch + oldSelection.length;
      const index = newText.indexOf(oldSelection, from);
      if (index === -1) {
        return lastMatch;
      }
      const prevDiff = Math.abs(oldEntity.start - lastMatch);
      const nextDiff = Math.abs(oldEntity.start - index);
      if (prevDiff < nextDiff) {
        return lastMatch;
      }
      return findClosestStart(index);
    }
    const start = findClosestStart();
    if (start === -1) {
      return;
    }

    entities.push({
      ...oldEntity,
      start,
      end: start + oldSelection.length,
    });
  });

  return entities
}