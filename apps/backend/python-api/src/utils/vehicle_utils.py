import joblib
import os
from data.vehicles import vehicles

# model = joblib.load('./model/vehicle_selector_model.pkl')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model", "vehicle_selector_model.pkl")

vehicle_costs_per_km = {v['name']: v['cost_per_km'] for v in vehicles}

def find_single_vehicle(volume, weight):
    suitable = sorted(
        [v for v in vehicles if v["max_volume"] >= volume and v["max_weight"] >= weight],
        key=lambda x: (x["cost_per_km"], x["max_volume"], x["max_weight"])
    )
    return suitable[0] if suitable else None

def allocate_multiple_vehicles(volume, weight):
    allocation = []
    remaining_volume = volume
    remaining_weight = weight

    sorted_vehicles = sorted(vehicles, key=lambda x: (x["max_volume"], x["max_weight"]), reverse=True)

    for veh in sorted_vehicles:
        while remaining_volume > 0 or remaining_weight > 0:
            if veh["max_volume"] <= remaining_volume or veh["max_weight"] <= remaining_weight:
                allocation.append(veh)
                remaining_volume -= min(veh["max_volume"], remaining_volume)
                remaining_weight -= min(veh["max_weight"], remaining_weight)
            else:
                break

    return allocation

def optimal_vehicle_strategy(volume, weight, distance):
    single_vehicle = find_single_vehicle(volume, weight)
    cost_single = single_vehicle["cost_per_km"] * distance if single_vehicle else float('inf')

    multiple_vehicles = allocate_multiple_vehicles(volume, weight)
    cost_multi = sum([veh["cost_per_km"] for veh in multiple_vehicles]) * distance if multiple_vehicles else float('inf')

    if cost_single <= cost_multi:
        return {
            "strategy": "Single Vehicle",
            "vehicles": [single_vehicle["name"]],
            "estimated_cost_LKR": cost_single
        }
    else:
        return {
            "strategy": "Multiple Vehicles",
            "vehicles": [v for v in [veh["name"] for veh in multiple_vehicles]],
            "estimated_cost_LKR": cost_multi
        }
