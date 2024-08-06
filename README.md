Sure, here is a detailed `README.md` for your project:

```markdown
# Shopify to Google Sheets Automation

This script automates the process of fetching orders and refunds from Shopify and saving them to a Google Sheets document. The script is set to run every 10 minutes, ensuring that your Google Sheets document is always up-to-date with the latest Shopify data.

## Prerequisites

- A Google account with access to Google Sheets
- A Shopify store with API access
- Google Apps Script environment

## Setup Instructions

### 1. Create a new Google Sheets document

1. Go to [Google Sheets](https://sheets.google.com/).
2. Create a new spreadsheet.
3. Name the spreadsheet (e.g., "Shopify Automation").

### 2. Open Google Apps Script Editor

1. In your Google Sheets document, go to `Extensions` > `Apps Script`.
2. This will open the Google Apps Script editor.

### 3. Add the Script

1. Delete any code in the editor and replace it with the following script:

```javascript
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
```

2. Replace the placeholders `your_shopify_api_key`, `your_shopify_password`, and `your_shopify_store_name` with your actual Shopify API key, password, and store name.

### 4. Authorize and Run the Script

1. Click on the disk icon to save the script.
2. Select the `scheduleFetch` function from the dropdown menu next to the run button (triangle icon).
3. Click the run button to execute the function.
4. Authorize the script when prompted. You will need to grant permissions for the script to access your Google Sheets and make requests to external services (Shopify).

### 5. Verify the Triggers

1. Click on the clock icon to open the triggers menu.
2. Ensure that triggers for `fetchOrders` and `fetchRefunds` are set to run every 10 minutes.

## Usage

Once the script is set up and running, it will automatically fetch orders and refunds from your Shopify store and save them to the respective sheets in your Google Sheets document every 10 minutes. You can view and analyze the data directly in Google Sheets.

## Troubleshooting

- If the script fails to fetch data, ensure that your Shopify API key, password, and store name are correct.
- Check the permissions granted to the script and ensure it has access to the necessary resources.
- Verify the triggers are correctly set to run every 10 minutes.

## License

This project is licensed under the MIT License.
```

Copy and paste the above content into a file named `README.md` in your GitHub repository. This file provides detailed instructions on how to set up and use the script, ensuring that anyone who wants to use your project can do so easily.
