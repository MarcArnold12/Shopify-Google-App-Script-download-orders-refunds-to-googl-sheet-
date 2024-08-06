# Shopify Data Fetcher

This Google Apps Script automates the process of fetching orders and refunds data from a Shopify store and updates corresponding Google Sheets.

## Features

- Fetches orders and refunds data from Shopify API
- Updates Google Sheets with the latest data
- Automatically runs every 10 minutes using time-based triggers

## Prerequisites

- A Shopify store with API access
- Google account with access to Google Sheets and Google Apps Script
- Shopify API credentials (store name and access token)

## Setup

1. **Google Sheets Setup**
   - Create a new Google Sheet
   - Add two sheets named `Orders` and `Refunds`

2. **Google Apps Script Setup**
   - Open the Google Sheet
   - Go to `Extensions > Apps Script`
   - Copy and paste the provided script into the editor
   - Save the project

3. **Configure Shopify Credentials**
   - In the Apps Script editor, go to `File > Project Properties > Script Properties`
   - Add the following properties:
     - `SHOP_NAME`: Your Shopify store name
     - `ACCESS_TOKEN`: Your Shopify API access token

## Usage

1. **Initial Setup**
   - In the Apps Script editor, run the `setupTrigger` function to create the time-based trigger

2. **Manual Execution**
   - To run the script manually, execute the `fetchShopifyData` function

3. **Automated Updates**
   - The script will automatically run every 10 minutes, updating your Google Sheets with the latest Shopify data

## Script Overview

The script consists of several functions:

- `getShopifyCredentials()`: Retrieves Shopify credentials from script properties
- `fetchShopifyData()`: Main function that orchestrates data fetching and sheet updates
- `getShopifyOrders()`: Fetches order data from Shopify API
- `getShopifyRefunds()`: Fetches refund data from Shopify API
- `updateOrdersSheet()`: Updates the Orders sheet with new data
- `updateRefundsSheet()`: Updates the Refunds sheet with new data
- `setupTrigger()`: Creates a time-based trigger to run the script every 10 minutes

## Customization

- To modify the API version, update the `API_VERSION` constant in the `fetchShopifyData` function
- To change the update frequency, modify the `everyMinutes()` value in the `setupTrigger` function

## Troubleshooting

- If you encounter authentication errors, double-check your Shopify API credentials in the script properties
- Ensure your Shopify access token has the necessary permissions to fetch orders and refunds data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
