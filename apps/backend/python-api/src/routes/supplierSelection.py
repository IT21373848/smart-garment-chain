from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import pandas as pd
import os
import joblib
from services.rankSuppliers import rank_suppliers

supplierSelection = Blueprint('supplierSelection', __name__)

@supplierSelection.route('/supplier-prediction', methods=['POST'])
def handle_supplier_selection():
    try:

        Item_Name = request.json.get('Item_Name')
        if not Item_Name:
            return jsonify({"error": "No input data provided"}), 400
        
        # Connect to MongoDB
        MONGO_URI = os.getenv("MONGO_URI","mongodb+srv://Nimsara:%3Cpassword%3E@cluster0.9ednv0z.mongodb.net/supply-chain?retryWrites=true&w=majority")
        client = MongoClient(MONGO_URI)
        db = client["supply-chain"]

        # Access collections
        orders_collection = db["orders"]
        suppliers_collection = db["suppliers"]
        transactions_collection = db["transactions"]

        # Fetch data from each collection
        orders = pd.DataFrame(list(orders_collection.find()))
        suppliers = pd.DataFrame(list(suppliers_collection.find()))
        transactions = pd.DataFrame(list(transactions_collection.find()))

        # Clean up DataFrame _id fields
        orders = orders.rename(columns={'_id': 'Order_Id'})
        suppliers = suppliers.rename(columns={'_id': 'Supplier_Id'})

        # Convert join keys to string for consistent merging
        orders['Order_Id'] = orders['Order_Id'].astype(str)
        orders['Supplier_Id'] = orders['Supplier_Id'].astype(str)
        suppliers['Supplier_Id'] = suppliers['Supplier_Id'].astype(str)
        transactions['Order_Id'] = transactions['Order_Id'].astype(str)

        # --- Step 1: Identify suppliers that carry the item ---
        item_name = Item_Name

        # Function to check if supplier has the item
        def supplier_has_item(item_list, item_name):
            return isinstance(item_list, list) and any(item.get('itemName') == item_name for item in item_list)

        # Filter suppliers based on whether they supply the item
        suppliers_with_item = suppliers[suppliers['items'].apply(lambda x: supplier_has_item(x, item_name))]

        # Get the Supplier_Id list for suppliers who carry this item
        supplier_ids_with_item = suppliers_with_item['Supplier_Id'].tolist()

        # --- Step 2: Find Orders from These Suppliers ---
        orders_with_item = orders[orders['Supplier_Id'].isin(supplier_ids_with_item)]

        # --- Step 3: Merge orders with suppliers and transactions ---
        merged_data = pd.merge(orders_with_item, suppliers, on='Supplier_Id', how='left')
        final_data = pd.merge(merged_data, transactions, on='Order_Id', how='left')

        # Select and rename columns for final structure
        final_data = final_data[[
            'Supplier_Name', 'Item_Name', 'Quality', 
            'Price', 'Quantity', 'Required_Date',
            'Date_of_Receipt', 'Defect_Rates', 'Supplier_Id'
        ]].rename(columns={
            'Supplier_Name': 'Supplier Name',
            'Item_Name': 'Item Name',
            'Required_Date': 'Required Date',
            'Date_of_Receipt': 'Date of Receipt',
            'Defect_Rates': 'Defect Rates',
            'Price': 'Price (USD)'
        })

        # Suppliers who have a recorded transaction (non-null "Date of Receipt")
        suppliers_with_transactions_df = final_data[final_data['Date of Receipt'].notnull()]
        suppliers_with_transactions_ids = suppliers_with_transactions_df['Supplier_Id'].unique()

        # Suppliers without transactions (who supplied the item but had no recorded transactions)
        suppliers_without_transactions = suppliers_with_item[~suppliers_with_item['Supplier_Id'].isin(suppliers_with_transactions_ids)]

        # Get unique supplier lists to avoid duplicates
        unique_suppliers_without = suppliers_without_transactions[['Supplier_Name']].drop_duplicates().to_numpy().tolist()

        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir,"..","services","models","supplier_selection",'supplier_ranking_model.pkl')
        encoder_path = os.path.join(current_dir,"..","services","models","supplier_selection", 'item_encoder.pkl')
        scaler_path = os.path.join(current_dir,"..","services","models","supplier_selection", 'feature_scaler.pkl')
        rf_model = joblib.load(model_path)
        encoder = joblib.load(encoder_path)
        scaler = joblib.load(scaler_path)

        ranked_suppliers = rank_suppliers(Item_Name,suppliers_with_transactions_df,encoder,scaler,rf_model)

        return jsonify({"ranked_suppliers": ranked_suppliers,"new_suppliers":unique_suppliers_without})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
