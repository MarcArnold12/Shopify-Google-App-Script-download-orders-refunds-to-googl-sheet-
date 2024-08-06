```markdown
# Shopify Data Fetcher

This script automates the process of fetching orders and refunds data from a Shopify store and updates corresponding Google Sheets. 

## Features

- Fetches orders and refunds data from Shopify.
- Updates Google Sheets with the fetched data.
- Sets up a time-based trigger to run the script every 10 minutes.

## Setup

1. **Google Script Properties**:
    - Set the `SHOP_NAME` and `ACCESS_TOKEN` in your Google Script properties. These are necessary for authentication and accessing your Shopify store's data.

2. **Google Sheets**:
    - Create a Google Sheet with two sheets named `Orders` and `Refunds`.
    - Ensure the first row of each sheet is reserved for headers.

3. **Google Apps Script**:
    - Copy and paste the following code into your Google Apps Script project.

## Script

```javascript
function getShopifyCredentials() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const shopName = scriptProperties.getProperty('SHOP_NAME');
  const accessToken = scriptProperties.getProperty('ACCESS_TOKEN');
  if (!shopName || !accessToken) {
    Logger.log('Error: SHOP_NAME or ACCESS_TOKEN is not defined in the project properties.');
    throw new Error('SHOP_NAME or ACCESS_TOKEN is not defined in the project properties.');
  }
  return {
    shopName: shopName,
    accessToken: accessToken
  };
}

function fetchShopifyData() {
  const credentials = getShopifyCredentials();
  const SHOP_NAME = credentials.shopName;
  const ACCESS_TOKEN = credentials.accessToken;
  const API_VERSION = '2023-07';

  Logger.log(`Using SHOP_NAME: ${SHOP_NAME} and ACCESS_TOKEN: ${ACCESS_TOKEN}`);

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = spreadsheet.getSheetByName('Orders');
  const refundsSheet = spreadsheet.getSheetByName('Refunds');
  
  const orders = getShopifyOrders(SHOP_NAME, ACCESS_TOKEN, API_VERSION);
  const refunds = getShopifyRefunds(SHOP_NAME, ACCESS_TOKEN, API_VERSION);
  
  updateRefundsSheet(refundsSheet, refunds);
  updateOrdersSheet(ordersSheet, orders, refunds);
}

function getShopifyOrders(SHOP_NAME, ACCESS_TOKEN, API_VERSION) {
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

function getShopifyRefunds(SHOP_NAME, ACCESS_TOKEN, API_VERSION) {
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
  if (sheet.getLastRow() <= 1) {
    sheet.appendRow(['Order ID', 'Order Number', 'Email', 'Total Price', 'Created At']);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const refundedOrderIds = new Set(refunds.map(refund => refund.id.toString()));
  const updatedData = data.filter(row => !refundedOrderIds.has(row[0].toString()));
  const existingOrderIds = new Set(updatedData.map(row => row[0].toString()));
  
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
  
  sheet.clear();
  sheet.appendRow(headers);
  sheet.getRange(2, 1, updatedData.length, headers.length).setValues(updatedData);
}

function updateRefundsSheet(sheet, refunds) {
  if (sheet.getLastRow() <= 1) {
    sheet.appendRow(['Order ID', 'Order Number', 'Email', 'Total Price', 'Created At']);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const existingRefundIds = new Set(data.map(row => row[0].toString()));
  
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

## Usage

1. **Set Up Script Properties**:
    - Navigate to `File > Project Properties > Script Properties` in the Google Apps Script editor.
    - Add properties for `SHOP_NAME` and `ACCESS_TOKEN` with your Shopify store's name and access token.

2. **Run the Script**:
    - Manually run the `setupTrigger` function to set up the time-based trigger.
    - The `fetchShopifyData` function will automatically run every 10 minutes to update your Google Sheets with the latest Shopify data.

## License

This project is licensed under the MIT License.
```
