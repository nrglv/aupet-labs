CREATE TABLE IF NOT EXISTS invoices (
    id         SERIAL PRIMARY KEY,
    tax_rate   NUMERIC(5,4) NOT NULL CHECK (tax_rate >= 0 AND tax_rate < 1),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id         SERIAL PRIMARY KEY,
    invoice_id INTEGER       NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    name       VARCHAR(200)  NOT NULL CHECK (name <> ''),
    price      NUMERIC(12,2) NOT NULL CHECK (price >= 0)
);
