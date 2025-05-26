# data/storage.py

GARMENT_BOXES = [
    {
        "material_id": "cotton-small",
        "material": "Cotton",
        "size": (60, 40, 30),
        "weight": 4,
        "color": "red",
        "max_weight_upright": 25,
        "max_weight_rotated": 15
    },
    {
        "material_id": "cotton-medium",
        "material": "Cotton",
        "size": (70, 50, 40),
        "weight": 5,
        "color": "red",
        "max_weight_upright": 35,
        "max_weight_rotated": 20
    },
    {
        "material_id": "cotton-large",
        "material": "Cotton",
        "size": (80, 60, 50),
        "weight": 6,
        "color": "red",
        "max_weight_upright": 45,
        "max_weight_rotated": 25
    },
    {
        "material_id": "silk-small",
        "material": "Silk",
        "size": (60, 40, 30),
        "weight": 3,
        "color": "blue",
        "max_weight_upright": 20,
        "max_weight_rotated": 12
    },
    {
        "material_id": "silk-medium",
        "material": "Silk",
        "size": (70, 50, 40),
        "weight": 4,
        "color": "blue",
        "max_weight_upright": 30,
        "max_weight_rotated": 18
    },
    {
        "material_id": "silk-large",
        "material": "Silk",
        "size": (80, 60, 50),
        "weight": 5,
        "color": "blue",
        "max_weight_upright": 40,
        "max_weight_rotated": 22
    },
    {
        "material_id": "denim-small",
        "material": "Denim",
        "size": (60, 40, 30),
        "weight": 5,
        "color": "green",
        "max_weight_upright": 35,
        "max_weight_rotated": 20
    },
    {
        "material_id": "denim-medium",
        "material": "Denim",
        "size": (70, 50, 40),
        "weight": 6,
        "color": "green",
        "max_weight_upright": 45,
        "max_weight_rotated": 28
    },
    {
        "material_id": "denim-large",
        "material": "Denim",
        "size": (80, 60, 50),
        "weight": 7,
        "color": "green",
        "max_weight_upright": 60,
        "max_weight_rotated": 35
    }
]

CONTAINERS = [
    {
        "type": "Small Truck",
        "size": (320, 170, 170),
        "max_weight": 1000
    },
    {
        "type": "Medium Truck",
        "size": (500, 200, 200),
        "max_weight": 2000
    },
    {
        "type": "20ft Container",
        "size": (589, 235, 239),
        "max_weight": 28000
    }
]
