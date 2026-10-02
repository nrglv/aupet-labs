-- Одна таблица на всю иерархию (Single Table Inheritance).
-- Поле type определяет, объект какого класса хранится в строке.
CREATE TABLE IF NOT EXISTS employees (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    position     VARCHAR(100)  NOT NULL,
    type         VARCHAR(10)   NOT NULL CHECK (type IN ('worker', 'manager')),
    hourly_rate  NUMERIC(12,2) CHECK (hourly_rate >= 0),
    hours_worked NUMERIC(8,2)  CHECK (hours_worked >= 0),
    fixed_salary NUMERIC(12,2) CHECK (fixed_salary >= 0),
    bonus        NUMERIC(12,2) CHECK (bonus >= 0),
    -- у рабочего заполнены ставка и часы, у менеджера - оклад и премия
    CONSTRAINT employee_fields_match_type CHECK (
        (type = 'worker'  AND hourly_rate  IS NOT NULL AND hours_worked IS NOT NULL
                          AND fixed_salary IS NULL     AND bonus        IS NULL)
     OR (type = 'manager' AND fixed_salary IS NOT NULL AND bonus        IS NOT NULL
                          AND hourly_rate  IS NULL     AND hours_worked IS NULL)
    )
);
