/**
 * Switches the location of two items
 * in an array
 */
export function switchItemLocations(
  items: any[],
  previousIndex: number,
  currentIndex: number
) {
  const itemOne = items[previousIndex];
  const itemTwo = items[currentIndex];

  items[currentIndex] = itemOne;
  items[previousIndex] = itemTwo;
}
