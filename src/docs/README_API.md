# API Docs Index

Last update: 2026-05-06

Dokumen API untuk project ini:

1. Referensi lengkap endpoint

- File: src/docs/API_FRONTEND_REFERENCE.md
- Isi: daftar endpoint, auth, payload, response, dan catatan integrasi frontend.

1. OpenAPI 3.0

- Status: belum tersedia pada folder docs saat ini.
- Gunakan API_FRONTEND_REFERENCE.md sebagai sumber utama spesifikasi endpoint.

1. Postman Collection

- File: src/docs/SlimBakery.postman_collection.json
- Isi: koleksi request siap import ke Postman.
- Catatan: request Login memiliki test script untuk otomatis menyimpan JWT ke collection variable token.

## Ringkasan Update Harga

- Field harga standar: `harga` (numeric, tidak negatif).
- Endpoint terdampak: product create/update, order item, delivery order item, receive summary/detail, dan reports.
- Untuk kompatibilitas data lama, backend product masih bisa melakukan fallback dari `harga_jual` ke `harga`.

## Catatan Migrasi Database

1. Server baru (fresh setup)

- Gunakan: `php database/migrations/migration_all.php`

1. Database existing (sudah ada data)

- Gunakan incremental migration: `php database/migrations/add_harga_to_products.php`

1. Migrasi lama

- `database/migrations/migrasinextall.php` sudah ditandai deprecated dan tidak direkomendasikan untuk setup server baru.

## Cara Pakai Cepat

### Import OpenAPI ke Swagger Editor

1. Buka <https://editor.swagger.io>
2. Jika file openapi.yaml sudah ditambahkan, import dari src/docs/openapi.yaml

### Import Postman Collection

1. Buka Postman
2. Import -> File -> pilih src/docs/SlimBakery.postman_collection.json
3. Set environment variable:

- `base_url = http://localhost/slim-eloquent-bakery/public`
- `token = JWT dari endpoint login`
