# TODO List

## Current Tasks

- [x] Implement close order functionality in DetailDeliveryOrder.vue
  - [x] Add status property to track order state
  - [x] Implement closeOrder method with API call to update status to 'closed'
  - [x] Update TableDeliveryOrders.vue to use status instead of receives_id for editability
  - [x] Update UI to show status and disable buttons if closed
  - [x] Test the flow: Create receive → Close order → Verify in list view
- [x] Enable direct updates to receives in DetailDeliveryOrder.vue
  - [x] Add existingReceive data property to track existing receives
  - [x] Modify fetchDeliveryOrderDetail to detect and pre-populate existing receive data
  - [x] Update button text to show "Create Receiver" or "Update Receiver" based on existing data
  - [x] Modify updateReceiver method to use PUT for updates and POST for new receives
  - [x] Refresh data after successful operations
- [x] Update close order endpoint to use POST /delivery-orders/{id}/close
