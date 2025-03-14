import pandas as pd

def rank_suppliers(item_name,item_suppliers, encoder, scaler, rf_model):

    if item_suppliers.empty:
        print(f"No suppliers found for item: {item_name}")
        return None

    # Encode the item name
    item_suppliers["Item_Encoded"] = encoder.transform(item_suppliers["Item Name"])

    # Manual encoding for Quality
    quality_mapping = {'Standard': 1, 'High': 2, 'Premium': 3}
    item_suppliers['Quality_Encoded'] = item_suppliers['Quality'].map(quality_mapping)

    # Convert dates
    item_suppliers["Required Date"] = pd.to_datetime(item_suppliers["Required Date"], errors='coerce')
    item_suppliers["Date of Receipt"] = pd.to_datetime(item_suppliers["Date of Receipt"], errors='coerce')

    # Calculate Delivery Time
    item_suppliers["DeliveryTime"] = (item_suppliers["Date of Receipt"] - item_suppliers["Required Date"]).dt.days
    # Remove invalid rows
    item_suppliers.dropna(subset=["Quality_Encoded", "Price (USD)", "DeliveryTime", "Defect Rates"], inplace=True)

    # Aggregate supplier data
    aggregated_suppliers = (
        item_suppliers.groupby("Supplier Name", as_index=False)
        .agg({
            "Item_Encoded": "first",
            "Quality_Encoded": "mean",
            "Price (USD)": "mean",
            "DeliveryTime": "mean",
            "Defect Rates": "mean"
        })
    )
    # Keep original column names when scaling
    aggregated_suppliers[["Quality_Encoded", "Price (USD)", "DeliveryTime", "Defect Rates"]] = scaler.transform(
        aggregated_suppliers[["Quality_Encoded", "Price (USD)", "DeliveryTime", "Defect Rates"]]
    )

    # Rename columns to match feature names used when fitting the scaler
    aggregated_suppliers.rename(columns={"Price (USD)": "Price", "Defect Rates": "DefectRate"}, inplace=True)

    # Prepare feature matrix for prediction
    X_test = aggregated_suppliers[["Item_Encoded", "Quality_Encoded", "Price", "DeliveryTime", "DefectRate"]]

    # Predict scores
    aggregated_suppliers["Predicted_Score"] = rf_model.predict(X_test)

    # Rank suppliers
    ranked_suppliers = aggregated_suppliers.sort_values(by="Predicted_Score", ascending=False)

    # Get top 5 supplier names
    top_5_supplier_names = ranked_suppliers["Supplier Name"].head(5).to_numpy().tolist()

    return top_5_supplier_names
