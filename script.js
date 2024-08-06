// Your Shopify API keys (replace with your actual keys)
const SHOPIFY_API_KEY = 'your_shopify_api_key';
const SHOPIFY_PASSWORD = 'your_shopify_password';
const SHOPIFY_STORE_NAME = 'your_shopify_store_name';  // Only the store name

// Function to fetch orders from Shopify and save them to Google Sheets
function fetchOrders() {
  // URL to Shopify API for orders
  const url = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-04/orders.json`;

  // Request options
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(SHOPIFY_API_KEY + ':' + SHOPIFY_PASSWORD),
      'Content-Type': 'application/json'
    }
  };

  // Make the request to Shopify API
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  // Get the whole Google Sheets spreadsheet named 'Shopify Automation'
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the 'Orders' sheet, or create a new one if it doesn't exist
  let ordersSheet = spreadsheet.getSheetByName('Orders');
  if (!ordersSheet) {
    ordersSheet = spreadsheet.insertSheet('Orders');
  }

  // Get the last row with data
  const lastRow = ordersSheet.getLastRow();

  const orders = json.orders; // List of orders

  // Column headers, added only if the sheet is empty
  if (lastRow === 0) {
    const headers = ['Order ID', 'Email', 'Total Price', 'Created At'];
    ordersSheet.appendRow(headers);
  }

  // Add order data to the sheet
  orders.forEach(order => {
    ordersSheet.appendRow([order.id, order.email, order.total_price, order.created_at]);
  });
}

// Function to fetch refunds from Shopify and save them to Google Sheets
function fetchRefunds() {
  // URL to Shopify API for refunds
  const url = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2023-04/refunds.json`;

  // Request options
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(SHOPIFY_API_KEY + ':' + SHOPIFY_PASSWORD),
      'Content-Type': 'application/json'
    }
  };

  // Make the request to Shopify API
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  // Get the whole Google Sheets spreadsheet named 'Shopify Automation'
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the 'Refunds' sheet, or create a new one if it doesn't exist
  let refundsSheet = spreadsheet.getSheetByName('Refunds');
  if (!refundsSheet) {
    refundsSheet = spreadsheet.insertSheet('Refunds');
  }

  // Get the last row with data
  const lastRow = refundsSheet.getLastRow();

  const refunds = json.refunds; // List of refunds

  // Column headers, added only if the sheet is empty
  if (lastRow === 0) {
    const headers = ['Refund ID', 'Order ID', 'Refunded At', 'Total Amount'];
    refundsSheet.appendRow(headers);
  }

  // Add refund data to the sheet
  refunds.forEach(refund => {
    refundsSheet.appendRow([refund.id, refund.order_id, refund.processed_at, refund.transactions[0].amount]);
  });
}

// Function to set up the schedule for fetching data
function scheduleFetch() {
  // Remove existing triggers for fetchOrders and fetchRefunds
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    const funcName = trigger.getHandlerFunction();
    if (funcName === 'fetchOrders' || funcName === 'fetchRefunds') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Set up the schedule to fetch orders every 10 minutes
  ScriptApp.newTrigger('fetchOrders')
    .timeBased()
    .everyMinutes(10)
    .create();

  // Set up the schedule to fetch refunds every 10 minutes
  ScriptApp.newTrigger('fetchRefunds')
    .timeBased()
    .everyMinutes(10)
    .create();
}

// Call the scheduleFetch function to set up the schedule
scheduleFetch();
