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

1. Delete any code in the editor and replace it with the script provided in the `script.js` file of this repository.
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
