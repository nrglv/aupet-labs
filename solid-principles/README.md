# ЛР3. Принципы SOLID: SRP, OCP, ISP, DIP

TypeScript + PostgreSQL. Исправленные по принципам SOLID версии примеров из задания.

- `src/srp` - Invoice, InvoiceCalculator, InvoiceRepository (счета в PostgreSQL)
- `src/ocp` - DiscountPolicy и DiscountCalculator без ветвлений по типу клиента
- `src/isp` - интерфейсы Workable, Eatable, Sleepable вместо IWorker
- `src/dip` - Notification зависит от интерфейса MessageSender

```bash
npm install
docker compose up -d      # PostgreSQL 16 (lab/lab, база invoices)
npm start
npm test
```

`npm start` и `npm test` очищают таблицы `invoices` и `invoice_items`.
