// Set your Shopify API credentials
const SHOP_NAME = 'name';
const ACCESS_TOKEN = 'acces token';
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
