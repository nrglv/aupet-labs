# ЛР1. Система учета сотрудников

TypeScript + PostgreSQL. Базовый класс `Employee`, наследники `Worker` и `Manager`.

## Запуск

```bash
npm install
docker compose up -d      # PostgreSQL 16 (lab/lab, база employees)
npm start                 # демонстрация: добавление сотрудников и ведомость
npm test                  # модульные и интеграционные тесты
```

Строка подключения берется из переменной `DATABASE_URL`
(по умолчанию `postgres://lab:lab@localhost:5432/employees`).
Таблица создается автоматически из `sql/schema.sql`.
Внимание: `npm start` и `npm test` очищают таблицу `employees`.
