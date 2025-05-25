import os
from openai import OpenAI
from dotenv import load_dotenv
from services.packing.data import GARMENT_BOXES, CONTAINERS

load_dotenv()

# Get the API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def generate_packing_plan(box_data, container_type):
    container = next((c for c in CONTAINERS if c['type'] == container_type), None)
    if not container:
        return {"error": f"Container type {container_type} not found"}, 400

    container_size = container["size"]
    max_weight = container["max_weight"]

    packing_plan = []
    packed_box_quantity = {}
    packed_weight = 0
    step_number = 1
    current_position = {"x": 0, "y": 0, "z": 0}

    for item in box_data:
        material_id = item["material_id"]
        quantity = item["quantity"]
        allow_rotation = item.get("allow_rotation", False)

        box = next((b for b in GARMENT_BOXES if b['material_id'] == material_id), None)
        if not box:
            return {"error": f"Material {material_id} not found"}, 400

        box_size = box["size"]
        box_weight = box["weight"]
        type_name = f"Type-{material_id}"
        packed_box_quantity.setdefault(type_name, 0)

        grouped_step = {"stepNumber": step_number, "steps": []}

        for _ in range(quantity):
            if packed_weight + box_weight > max_weight:
                return {
                    "isAllPacked": False,
                    "packed_box_quantity": packed_box_quantity,
                    "plan": packing_plan
                }, 200

            prompt = (
                f"Create a friendly, clear, and humanized packing instruction for placing a box of type {type_name} "
                f"at position {tuple(current_position.values())}. The box dimensions are {box_size} and the box weight "
                f"is {box_weight}. Also, mention if the box should be placed next to others or any specific instructions for placement."
            )

            try:
                if client:
                    response = client.completion.create(
                        model="gpt-3.5-turbo",
                        prompt=prompt,
                        max_tokens=100,
                        temperature=0.7
                    )
                    instruction_text = response.choices[0].text.strip()
                else:
                    print("OpenAI API key not configured.")
                    instruction_text = f"Place the {type_name} box at position {tuple(current_position.values())}."

            except Exception as e:
                # In case of an API failure, use a default text
                print(f"OpenAI API call failed: {e}")
                instruction_text = f"Place the {type_name} box at position {tuple(current_position.values())}."

            grouped_step["steps"].append({
                "id": len(grouped_step["steps"]) + 1,
                "type": type_name,
                "position": current_position.copy(),
                "instruction": instruction_text
            })

            packed_box_quantity[type_name] += 1
            packed_weight += box_weight

            # Update position logic
            current_position["x"] += box_size[0]
            if current_position["x"] + box_size[0] > container_size[0]:
                current_position["x"] = 0
                current_position["y"] += box_size[1]
                if current_position["y"] + box_size[1] > container_size[1]:
                    current_position["y"] = 0
                    current_position["z"] += box_size[2]
                    if current_position["z"] + box_size[2] > container_size[2]:
                        return {
                            "isAllPacked": False,
                            "packed_box_quantity": packed_box_quantity,
                            "plan": packing_plan
                        }, 200

        packing_plan.append(grouped_step)
        step_number += 1

    return {
        "isAllPacked": True,
        "packed_box_quantity": packed_box_quantity,
        "plan": packing_plan
    }, 200
