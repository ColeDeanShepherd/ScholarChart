// create the square
// move it to the right
// spin it

export function getElementYRelativeToContainer(element: HTMLElement, container: HTMLElement) {
  // Get the bounding rectangles of both the element and the container
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Calculate the Y position relative to the container
  const relativeY = elementRect.top - containerRect.top;

  return relativeY;
}