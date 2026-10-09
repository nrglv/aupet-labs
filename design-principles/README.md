# ЛР2. Принципы DRY, KISS, YAGNI

TypeScript + PostgreSQL. Исправленные по принципам DRY, KISS и YAGNI версии примеров из задания.

- `src/dry` - OrderService (заказы в PostgreSQL) и базовый класс Vehicle
- `src/kiss` - функция add вместо IOperation/Calculator, функция вместо Singleton
- `src/yagni` - функции площади вместо IShape; add без параметра shouldLog

```bash
npm install
docker compose up -d      # PostgreSQL 16 (lab/lab, база orders)
npm start
npm test
```

`npm start` и `npm test` очищают таблицу `orders`.
