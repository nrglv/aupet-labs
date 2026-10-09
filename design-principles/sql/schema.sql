CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL PRIMARY KEY,
    product_name VARCHAR(200)  NOT NULL CHECK (product_name <> ''),
    quantity     INTEGER       NOT NULL CHECK (quantity > 0),
    price        NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    total        NUMERIC(14,2) NOT NULL,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ
);
