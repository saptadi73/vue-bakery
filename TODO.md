# TODO: Add Action Column with Stock Input and Buttons to TableProductSummary.vue

## Steps to Complete

- [x] Add "Aksi" column header to the table's thead.
- [x] In each tbody row, add a td containing an input field (type="number") for stock quantity, "Tambahkan Stock" button, and "Kurangi Stock" button.
- [x] Add a new data property `stockUpdates: {}` to store input values per product ID.
- [x] Add methods `addStock(product)` and `reduceStock(product)` to handle API calls to `${BASE_URL}products/moving` with appropriate payloads (type: 'income' for add, 'outcome' for reduce).
- [x] Add success/error feedback handling (e.g., update status message or toast).
- [x] Style the new input and buttons to match the table design.
- [x] Test the functionality after implementation.
