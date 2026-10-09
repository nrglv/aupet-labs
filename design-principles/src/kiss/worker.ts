/**
 * KISS: вместо класса-одиночки (Singleton) - обычная функция модуля.
 * Модуль в Node.js загружается один раз, поэтому отдельный шаблон
 * для "единственного экземпляра" здесь не нужен.
 */
export function doSomething(): void {
  console.log('Doing something...');
}
