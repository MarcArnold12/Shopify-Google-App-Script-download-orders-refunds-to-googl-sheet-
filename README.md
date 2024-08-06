## Shopify Data Fetcher for Google Sheets

This script fetches order and refund data from your Shopify store and updates a Google Sheet with the information.

**Features:**

* Fetches orders and refunds from Shopify Admin API.
* Updates separate sheets for orders and refunds.
* Handles filtering out refunded orders from the orders sheet.
* Supports automatic updates with a time-based trigger (optional).

**Requirements:**

* A Google Workspace account with Google Sheets.
* A Shopify store with a configured Admin API access token.

**Setup:**

1. **Copy the Script:** Copy the entire script code provided.
2. **Create a New Script:** In your Google Sheet, go to **Tools > Script editor**.
3. **Paste the Script:** Paste the copied script code into the script editor.
4. **Configure Credentials:** Replace the following placeholders with your actual values:
    * `SHOP_NAME`: Your Shopify store name.
    * `ACCESS_TOKEN`: Your Shopify Admin API access token (obtainable from the Shopify Partners Dashboard).
    * `API_VERSION`: A recent, stable Shopify API version (e.g., "2023-07").
5. **Configure Sheet Names (Optional):** Change `ORDERS_SHEET_NAME` and `REFUNDS_SHEET_NAME` if you want different sheet names.
6. **Save the Script:** Click **File > Save**.

**Running the Script:**

* **Manual Run:** Click the **Run** button (triangle icon) in the script editor to manually fetch and update the sheets.
* **Automatic Run (Optional):** Uncomment the `setupTrigger` function call within the script to set up a trigger that automatically runs the `fetchShopifyData` function every 10 minutes. 

**Notes:**

* This script uses Google Apps Script and requires enabling the "Sheets API" and "Url Fetch API" services in the script editor.
* Ensure your Shopify API access token has appropriate permissions to access orders and refunds.
* Be cautious when modifying the script logic to avoid unintended behavior.

**Further Customization:**

* This script provides a basic example. You can modify it to fit your specific needs, such as fetching additional data fields or formatting the sheet differently.


**Disclaimer:**

This script is provided as-is without warranty of any kind. Use it at your own risk. Refer to the official Google Apps Script and Shopify API documentation for further details and advanced functionalities.
