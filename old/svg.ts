const NAMESPACE = 'http://www.w3.org/2000/svg';

export function assign<T extends SVGElement>(element: T, attributes: {[key: string]: any}): T {
  Object.keys(attributes).forEach((key: string) => element.setAttribute(key, attributes[key]));
  return element;
}

export function rect(attributes: {x: number, y: number, width: number, height: number, [key: string]: any}): SVGRectElement {
  return assign(document.createElementNS(NAMESPACE, 'rect'), attributes);
}

export function circle(attributes: {cx: number, cy: number, r: number, [key: string]: any}): SVGCircleElement {
  return assign(document.createElementNS(NAMESPACE, 'circle'), attributes);
}

export function ellipse(attributes: {cx: number, cy: number, rx: number, ry: number, [key: string]: any}): SVGEllipseElement {
  return assign(document.createElementNS(NAMESPACE, 'ellipse'), attributes);
}

export function line(attributes: {x1: number, y1: number, x2: number, y2: number, [key: string]: any}): SVGLineElement {
  return assign(document.createElementNS(NAMESPACE, 'line'), attributes);
}
