# TODO: Create Order Report Detail Page

## Tasks

- [ ] Add new route in `src/router/index.js`: `/reports/order/:id` pointing to `OrderReportDetail.vue`
- [ ] Create `src/pages/OrderReportDetail.vue` component
  - [ ] Fetch data from `reports/order/:id` using `this.$route.params.id`
  - [ ] Display order header info (order_id, no_order, outlet_name, pic_name, tanggal, status, keterangan, updated_at)
  - [ ] Create table with columns: Product Name, Category, Ordered Qty, Provided Qty, Delivered Qty, Received Qty
  - [ ] Make each quantity cell clickable to open modal with segment details
  - [ ] Implement modal component for displaying segment details (pic, tanggal, updated_at, keterangan)
  - [ ] Add responsive design and styling
- [ ] Test fetching data and rendering table
- [ ] Verify modal functionality for segment details
- [ ] Ensure responsive design works on mobile
