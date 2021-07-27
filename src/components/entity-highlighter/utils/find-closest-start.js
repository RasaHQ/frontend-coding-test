export const findClosestStart = (text, oldSelection, start, lastMatch = null) => {
  if (lastMatch == null) {
    const index = text.indexOf(oldSelection);
    if (index === -1) {
      return index;
    }
    return findClosestStart(text, oldSelection, start, index);
  }
  const from = lastMatch + oldSelection.length;
  const index = text.indexOf(oldSelection, from);
  if (index === -1) {
    return lastMatch;
  }
  const prevDiff = Math.abs(start - lastMatch);
  const nextDiff = Math.abs(start - index);
  if (prevDiff < nextDiff) {
    return lastMatch;
  }
  return findClosestStart(text, oldSelection, start, index);
}