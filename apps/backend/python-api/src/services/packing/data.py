# data/storage.py

GARMENT_BOXES = [
    {
        "material_id": "1-small", 
        "material": "Cotton", 
        "size": (20, 15, 10), 
        "weight": 10, 
        "color": "red",
        "max_weight_upright": 50, 
        "max_weight_rotated": 30  
    },
    {
        "material_id": "1-medium", 
        "material": "Cotton", 
        "size": (30, 20, 15), 
        "weight": 12, 
        "color": "red",
        "max_weight_upright": 60, 
        "max_weight_rotated": 40  
    },
    {
        "material_id": "1-large", 
        "material": "Cotton", 
        "size": (40, 30, 20), 
        "weight": 15, 
        "color": "red",
        "max_weight_upright": 80, 
        "max_weight_rotated": 50  
    },
    
    {
        "material_id": "2-small", 
        "material": "Silk", 
        "size": (25, 20, 15), 
        "weight": 8, 
        "color": "blue",
        "max_weight_upright": 40, 
        "max_weight_rotated": 25  
    },
    {
        "material_id": "2-medium", 
        "material": "Silk", 
        "size": (35, 25, 20), 
        "weight": 10, 
        "color": "blue",
        "max_weight_upright": 50, 
        "max_weight_rotated": 30  
    },
    {
        "material_id": "2-large", 
        "material": "Silk", 
        "size": (45, 35, 25), 
        "weight": 13, 
        "color": "blue",
        "max_weight_upright": 70, 
        "max_weight_rotated": 40  
    },
    
    {
        "material_id": "3-small", 
        "material": "Denim", 
        "size": (30, 25, 20), 
        "weight": 12, 
        "color": "green",
        "max_weight_upright": 70, 
        "max_weight_rotated": 50  
    },
    {
        "material_id": "3-medium", 
        "material": "Denim", 
        "size": (40, 30, 25), 
        "weight": 14, 
        "color": "green",
        "max_weight_upright": 90, 
        "max_weight_rotated": 60  
    },
    {
        "material_id": "3-large", 
        "material": "Denim", 
        "size": (50, 40, 30), 
        "weight": 18, 
        "color": "green",
        "max_weight_upright": 120, 
        "max_weight_rotated": 80  
    }
]


CONTAINERS = [
    {"type": "Small", "size": (100, 100, 100), "max_weight": 100},
    {"type": "Medium", "size": (150, 150, 150), "max_weight": 200},
    {"type": "Large", "size": (200, 200, 200), "max_weight": 500}
]