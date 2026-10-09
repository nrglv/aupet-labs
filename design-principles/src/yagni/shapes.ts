/**
 * YAGNI: в программе нет кода, который обрабатывал бы фигуры единообразно,
 * поэтому интерфейс IShape и классы не нужны - достаточно двух функций.
 * Общий тип появится тогда, когда появится реальная задача, которой он нужен.
 */
export function circleArea(radius: number): number {
  return Math.PI * radius * radius;
}

export function squareArea(side: number): number {
  return side * side;
}
