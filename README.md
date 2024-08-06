# Shopify Google Sheets Integration

This script allows you to fetch and update Shopify orders and refunds in a Google Sheets spreadsheet. It uses Shopify's API to retrieve the data and updates the specified sheets in your Google Spreadsheet.

## Prerequisites

- A Shopify store with API access.
- A Google Sheets document with two sheets named "Orders" and "Refunds".
- Google Apps Script editor access to your Google Sheets document.

## Setup

1. **Set Up API Credentials**

   Replace the placeholder values with your actual Shopify store credentials and API version.

   ```javascript
   const SHOP_NAME = 'your_shop_name';
   const ACCESS_TOKEN = 'your_access_token';
   const API_VERSION = '2023-07';
   ```

2. **Set Up Sheet Names**

   Ensure your Google Sheets document has sheets named "Orders" and "Refunds". If your sheet names are different, update the constants accordingly.

   ```javascript
   const ORDERS_SHEET_NAME = 'Orders';
   const REFUNDS_SHEET_NAME = 'Refunds';
   ```

3. **Copy the Script**

   Copy the entire script into the Google Apps Script editor in your Google Sheets document.

## Functions

- **fetchShopifyData()**
  
  This function fetches orders and refunds from Shopify and updates the respective sheets in the Google Spreadsheet.

- **getShopifyOrders()**

  This helper function fetches all orders from Shopify.

- **getShopifyRefunds()**

  This helper function fetches all refunded orders from Shopify.

- **updateOrdersSheet(sheet, orders, refunds)**

  This helper function updates the orders sheet, removing refunded orders.

- **updateRefundsSheet(sheet, refunds)**

  This helper function updates the refunds sheet with new refunded orders.

- **setupTrigger()**

  This function sets up a trigger to run the `fetchShopifyData` function every 10 minutes.

## Usage

1. **Initial Run**

   Run the `fetchShopifyData` function manually to ensure everything is working correctly.

2. **Set Up Trigger**

   Run the `setupTrigger` function to set up an automatic trigger that updates the sheets every 10 minutes.

## Example Code

```javascript
// Set your Shopify API credentials
const SHOP_NAME = 'your_shop_name';
const ACCESS_TOKEN = 'your_access_token';
const API_VERSION = '2023-07'; // Using a recent, stable version

// Set the names of your sheets
const ORDERS_SHEET_NAME = 'Orders';
const REFUNDS_SHEET_NAME = 'Refunds';

function fetchShopifyData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = spreadsheet.getSheetByName(ORDERS_SHEET_NAME);
  const refundsSheet = spreadsheet.getSheetByName(REFUNDS_SHEET_NAME);
  
  // Fetch orders and refunds
  const orders = getShopifyOrders();
  const refunds = getShopifyRefunds();
  
  // Update refunds first
  updateRefundsSheet(refundsSheet, refunds);
  
  // Then update orders, removing any that have been refunded
  updateOrdersSheet(ordersSheet, orders, refunds);
}

function getShopifyOrders() {
  const url = `https://${SHOP_NAME}.myshopify.com/admin/api/${API_VERSION}/orders.json?status=any`;
  const options = {
    method: 'get',
    headers: {
      'X-Shopify-Access-Token': ACCESS_TOKEN
    }
  };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText()).orders;
}

function getShopifyRefunds() {
  const url = `https://${SHOP_NAME}.myshopify.com/admin/api/${API_VERSION}/orders.json?status=any&financial_status=refunded`;
  const options = {
    method: 'get',
    headers: {
      'X-Shopify-Access-Token': ACCESS_TOKEN
    }
  };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText()).orders;
}

function updateOrdersSheet(sheet, orders, refunds) {
  // Check if the sheet is empty
  if (sheet.getLastRow() <= 1) {
    // If empty, add headers
    sheet.appendRow(['Order ID', 'Order Number', 'Email', 'Total Price', 'Created At']);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove and store headers
  
  // Create a set of refunded order IDs for quick lookup
  const refundedOrderIds = new Set(refunds.map(refund => refund.id.toString()));
  
  // Filter out refunded orders and prepare new orders data
  const updatedData = data.filter(row => !refundedOrderIds.has(row[0].toString()));
  const existingOrderIds = new Set(updatedData.map(row => row[0].toString()));
  
  // Add new orders
  orders.forEach(order => {
    if (!existingOrderIds.has(order.id.toString()) && !refundedOrderIds.has(order.id.toString())) {
      updatedData.push([
        order.id,
        order.order_number,
        order.email,
        order.total_price,
        order.created_at
      ]);
    }
  });
  
  // Clear the sheet and rewrite with updated data
  sheet.clear();
  sheet.appendRow(headers);
  sheet.getRange(2, 1, updatedData.length, headers.length).setValues(updatedData);
}

function updateRefundsSheet(sheet, refunds) {
  // Check if the sheet is empty
  if (sheet.getLastRow() <= 1) {
    // If empty, add headers
    sheet.appendRow(['Order ID', 'Order Number', 'Email', 'Total Price', 'Created At']);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove and store headers
  
  const existingRefundIds = new Set(data.map(row => row[0].toString()));
  
  // Add new refunds
  refunds.forEach(refund => {
    if (!existingRefundIds.has(refund.id.toString())) {
      data.push([
        refund.id,
        refund.order_number,
        refund.email,
        refund.total_price,
        refund.created_at
      ]);
    }
  });
  
  // Clear the sheet and rewrite with updated data
  sheet.clear();
  sheet.appendRow(headers);
  sheet.getRange(2, 1, data.length, headers.length).setValues(data);
}

function setupTrigger() {
  ScriptApp.newTrigger('fetchShopifyData')
    .timeBased()
    .everyMinutes(10)
    .create();
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
