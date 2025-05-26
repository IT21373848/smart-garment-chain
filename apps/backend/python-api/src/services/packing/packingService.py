import os
from dotenv import load_dotenv
import google.generativeai as genai
from services.packing.data import GARMENT_BOXES, CONTAINERS
from typing import List, Dict, Tuple, Any
import copy

load_dotenv()

# Get the API key from environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class Box:
    def __init__(self, material_id: str, size: Tuple[int, int, int], weight: int, 
                 max_weight_upright: int, max_weight_rotated: int, allow_rotation: bool = False):
        self.material_id = material_id
        self.original_size = size
        self.size = size
        self.weight = weight
        self.max_weight_upright = max_weight_upright
        self.max_weight_rotated = max_weight_rotated
        self.allow_rotation = allow_rotation
        self.is_rotated = False
        self.position = None
        self.boxes_on_top = []
        self.supporting_boxes = []
    
    def rotate(self):
        if self.allow_rotation and not self.is_rotated:
            # Rotate 90 degrees (swap width and depth)
            self.size = (self.size[1], self.size[0], self.size[2])
            self.is_rotated = True
            return True
        return False
    
    def can_support_weight(self, additional_weight: int) -> bool:
        current_weight_on_top = sum(box.weight for box in self.boxes_on_top)
        max_capacity = self.max_weight_upright if not self.is_rotated else self.max_weight_rotated
        return current_weight_on_top + additional_weight <= max_capacity

class PackingSpace:
    def __init__(self, container_size: Tuple[int, int, int], max_weight: int):
        self.container_size = container_size
        self.max_weight = max_weight
        self.placed_boxes = []
        self.occupied_spaces = []
        self.current_weight = 0
    
    def can_place_box(self, box: Box, position: Tuple[int, int, int]) -> bool:
        x, y, z = position
        w, d, h = box.size
        
        # Check if box fits within container boundaries
        if x + w > self.container_size[0] or y + d > self.container_size[1] or z + h > self.container_size[2]:
            return False
        
        # Check weight limit
        if self.current_weight + box.weight > self.max_weight:
            return False
        
        # Check for overlapping with existing boxes
        for placed_box in self.placed_boxes:
            if self._boxes_overlap(position, box.size, placed_box.position, placed_box.size):
                return False
        
        # Check if box has proper support (not floating in air)
        if z > 0 and not self._has_support(position, box.size):
            return False
        
        return True
    
    def _boxes_overlap(self, pos1: Tuple[int, int, int], size1: Tuple[int, int, int],
                      pos2: Tuple[int, int, int], size2: Tuple[int, int, int]) -> bool:
        x1, y1, z1 = pos1
        w1, d1, h1 = size1
        x2, y2, z2 = pos2
        w2, d2, h2 = size2
        
        return not (x1 + w1 <= x2 or x2 + w2 <= x1 or
                   y1 + d1 <= y2 or y2 + d2 <= y1 or
                   z1 + h1 <= z2 or z2 + h2 <= z1)
    
    def _has_support(self, position: Tuple[int, int, int], size: Tuple[int, int, int]) -> bool:
        x, y, z = position
        w, d, h = size
        
        # Find boxes that could provide support
        supporting_area = 0
        box_area = w * d
        
        for placed_box in self.placed_boxes:
            bx, by, bz = placed_box.position
            bw, bd, bh = placed_box.size
            
            # Check if this box is directly below and can provide support
            if bz + bh == z:  # Box is directly below
                # Calculate overlapping area
                overlap_x = max(0, min(x + w, bx + bw) - max(x, bx))
                overlap_y = max(0, min(y + d, by + bd) - max(y, by))
                overlap_area = overlap_x * overlap_y
                
                if overlap_area > 0:
                    supporting_area += overlap_area
        
        # Box needs at least 70% support
        return supporting_area >= 0.7 * box_area
    
    def place_box(self, box: Box, position: Tuple[int, int, int]) -> bool:
        if self.can_place_box(box, position):
            box.position = position
            self.placed_boxes.append(box)
            self.current_weight += box.weight
            self._update_support_relationships(box)
            return True
        return False
    
    def _update_support_relationships(self, new_box: Box):
        x, y, z = new_box.position
        w, d, h = new_box.size
        
        # Find boxes this new box is resting on
        for placed_box in self.placed_boxes[:-1]:  # Exclude the newly placed box
            bx, by, bz = placed_box.position
            bw, bd, bh = placed_box.size
            
            # Check if new box is resting on this box
            if bz + bh == z:
                overlap_x = max(0, min(x + w, bx + bw) - max(x, bx))
                overlap_y = max(0, min(y + d, by + bd) - max(y, by))
                if overlap_x > 0 and overlap_y > 0:
                    placed_box.boxes_on_top.append(new_box)
                    new_box.supporting_boxes.append(placed_box)

def find_best_positions(packing_space: PackingSpace, boxes: List[Box]) -> List[Tuple[Box, Tuple[int, int, int]]]:
    """Find optimal positions for boxes using improved algorithm"""
    placed_boxes = []
    
    # Sort boxes by volume (largest first) for better packing efficiency
    sorted_boxes = sorted(boxes, key=lambda b: b.size[0] * b.size[1] * b.size[2], reverse=True)
    
    for box in sorted_boxes:
        best_position = None
        best_score = float('inf')
        best_box = None
        
        # Try different orientations if rotation is allowed
        orientations = [copy.deepcopy(box)]
        if box.allow_rotation:
            rotated_box = copy.deepcopy(box)
            if rotated_box.rotate():
                orientations.append(rotated_box)
        
        for oriented_box in orientations:
            # Generate candidate positions more systematically
            candidate_positions = _generate_better_candidate_positions(packing_space, oriented_box)
            
            for position in candidate_positions:
                if packing_space.can_place_box(oriented_box, position):
                    score = _calculate_position_score(position, oriented_box, packing_space)
                    if score < best_score:
                        best_score = score
                        best_position = position
                        best_box = oriented_box
        
        if best_position and best_box:
            packing_space.place_box(best_box, best_position)
            placed_boxes.append((best_box, best_position))
        else:
            # Box couldn't be placed
            break
    
    return placed_boxes

def _generate_better_candidate_positions(packing_space: PackingSpace, box: Box) -> List[Tuple[int, int, int]]:
    """Generate smarter candidate positions for placing a box"""
    positions = set()
    
    # Always try origin first
    positions.add((0, 0, 0))
    
    # If no boxes placed yet, only return origin
    if not packing_space.placed_boxes:
        return [(0, 0, 0)]
    
    # Generate positions based on existing boxes
    for placed_box in packing_space.placed_boxes:
        bx, by, bz = placed_box.position
        bw, bd, bh = placed_box.size
        w, d, h = box.size
        
        # Positions adjacent to existing boxes (on same level)
        adjacent_positions = [
            (bx + bw, by, bz),      # Right of box
            (bx, by + bd, bz),      # Behind box
            (bx + bw, by + bd, bz), # Diagonal back-right
        ]
        
        # Position on top of existing box
        if placed_box.can_support_weight(box.weight):
            adjacent_positions.append((bx, by, bz + bh))
        
        # Add valid adjacent positions
        for pos in adjacent_positions:
            x, y, z = pos
            if (x >= 0 and y >= 0 and z >= 0 and 
                x + w <= packing_space.container_size[0] and
                y + d <= packing_space.container_size[1] and
                z + h <= packing_space.container_size[2]):
                positions.add(pos)
    
    # Convert to sorted list (prioritize lower positions)
    position_list = list(positions)
    position_list.sort(key=lambda p: (p[2], p[0] + p[1]))  # Sort by z first, then x+y
    
    return position_list

def _calculate_position_score(position: Tuple[int, int, int], box: Box, packing_space: PackingSpace) -> float:
    """Calculate a score for a position (lower is better)"""
    x, y, z = position
    
    # Prefer positions that are:
    # 1. Lower (minimize z)
    # 2. Closer to origin (minimize distance)
    # 3. Create more stable stacking
    
    distance_score = x + y + z * 2  # Weight z more heavily
    stability_score = 0
    
    # Bonus for being well-supported
    if z > 0:
        support_area = 0
        box_area = box.size[0] * box.size[1]
        
        for placed_box in packing_space.placed_boxes:
            bx, by, bz = placed_box.position
            bw, bd, bh = placed_box.size
            
            if bz + bh == z:  # Box directly below
                overlap_x = max(0, min(x + box.size[0], bx + bw) - max(x, bx))
                overlap_y = max(0, min(y + box.size[1], by + bd) - max(y, by))
                support_area += overlap_x * overlap_y
        
        stability_score = -support_area / box_area  # Negative because lower score is better
    
    return distance_score + stability_score * 100

def generate_step_plan(placed_by_material: Dict[str, List[Tuple[Box, Tuple[int, int, int]]]], 
                      container_type: str) -> List[Dict]:
    """Generate step plan in the required format using single API call"""
    
    if not placed_by_material:
        return []
    
    # Collect all box information for the prompt
    all_box_info = []
    for material_id, boxes_positions in placed_by_material.items():
        for i, (box, position) in enumerate(boxes_positions, 1):
            x, y, z = position
            type_name = f"Type-{material_id}"
            
            # Determine placement context
            context_info = {
                'type': type_name,
                'position': position,
                'size': box.size,
                'rotated': box.is_rotated,
                'material_id': material_id,
                'box_number': i
            }
            all_box_info.append(context_info)
    
    # Create single comprehensive prompt
    prompt = f"""
You are creating packing instructions for a {container_type}. 
Generate individual, clear packing instructions for each box placement below.

Container size: Medium Truck (500cm x 200cm x 200cm)

Box placements to create instructions for:
"""
    
    for idx, box_info in enumerate(all_box_info, 1):
        x, y, z = box_info['position']
        type_name = box_info['type']
        
        # Add context for each box
        placement_context = ""
        if z == 0:
            if x == 0 and y == 0:
                placement_context = "front-left corner on the floor"
            elif x == 0:
                placement_context = "left wall on the floor"  
            elif y == 0:
                placement_context = "front wall on the floor"
            else:
                placement_context = "on the floor"
        else:
            placement_context = f"stacked on top at {z}cm height"
        
        if box_info['rotated']:
            placement_context += " (rotated 90 degrees)"
        
        prompt += f"""
{idx}. {type_name} box at position ({x}, {y}, {z}) - {placement_context}
"""
    
    prompt += f"""

For each box above, create ONE simple instruction like:
"Place the [box type] in the [natural location description]."

Provide exactly {len(all_box_info)} instructions, one per line, in the same order as listed.
Use simple, clear language. Convert coordinates to natural descriptions.
"""
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        instructions_text = response.text.strip()
        
        # Split into individual instructions
        instruction_lines = [line.strip() for line in instructions_text.split('\n') if line.strip()]
        
        # Clean up instructions
        clean_instructions = []
        for line in instruction_lines:
            if line and any(keyword in line.lower() for keyword in ['place', 'put', 'position', 'stack']):
                # Remove numbering and clean up
                clean_line = line
                # Remove common prefixes
                for prefix in ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.']:
                    if clean_line.startswith(prefix):
                        clean_line = clean_line[len(prefix):].strip()
                        break
                clean_instructions.append(clean_line)
        
        # Ensure we have enough instructions
        while len(clean_instructions) < len(all_box_info):
            clean_instructions.append("Place the box in the container.")
        
        individual_instructions = clean_instructions[:len(all_box_info)]
        
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        # Fallback instructions
        individual_instructions = []
        for box_info in all_box_info:
            x, y, z = box_info['position']
            type_name = box_info['type']
            if z == 0:
                if x == 0 and y == 0:
                    instr = f"Place the {type_name} in the front-left corner of the container."
                else:
                    instr = f"Place the {type_name} on the container floor."
            else:
                instr = f"Stack the {type_name} on top of the previously placed boxes."
            individual_instructions.append(instr)
    
    # Build the step plan grouped by material
    plan = []
    step_number = 1
    instruction_index = 0
    
    for material_id, boxes_positions in placed_by_material.items():
        type_name = f"Type-{material_id}"
        
        grouped_step = {
            "stepNumber": step_number,
            "steps": []
        }
        
        for i, (box, position) in enumerate(boxes_positions, 1):
            x, y, z = position
            
            # Get corresponding instruction
            instruction = individual_instructions[instruction_index] if instruction_index < len(individual_instructions) else f"Place the {type_name} in the container."
            
            step_detail = {
                "id": i,
                "type": type_name,
                "position": {"x": x, "y": y, "z": z},
                "instruction": instruction
            }
            
            grouped_step["steps"].append(step_detail)
            instruction_index += 1
        
        plan.append(grouped_step)
        step_number += 1
    
    return plan

def _parse_instructions(instructions_text: str, expected_count: int) -> List[str]:
    """Parse the API response into individual instructions"""
    lines = instructions_text.strip().split('\n')
    instructions = []
    
    for line in lines:
        line = line.strip()
        if line and ('step' in line.lower() or 'place' in line.lower()):
            # Clean up the instruction
            if line.startswith(('Step', 'step', '**Step', '**step')):
                # Remove step numbering and formatting
                instruction = line
                instruction = instruction.replace('**', '')  # Remove bold formatting
                instructions.append(instruction)
            elif 'place' in line.lower():
                instructions.append(line)
    
    # If we didn't get enough instructions, pad with basic ones
    while len(instructions) < expected_count:
        instructions.append(f"Place the box in the container.")
    
    return instructions[:expected_count]

def _generate_fallback_instruction_list(placed_by_material: Dict[str, List[Tuple[Box, Tuple[int, int, int]]]]) -> List[str]:
    """Generate fallback instructions if API fails"""
    instructions = []
    
    for material_id, boxes_positions in placed_by_material.items():
        type_name = f"Type-{material_id}"
        
        for i, (box, position) in enumerate(boxes_positions, 1):
            x, y, z = position
            
            if z == 0:
                if x == 0 and y == 0:
                    instruction = f"Step 1: Place the {type_name} box in the front-left corner of the container."
                elif x == 0:
                    instruction = f"Step 1: Place the {type_name} box along the left wall of the container."
                elif y == 0:
                    instruction = f"Step 1: Place the {type_name} box along the front wall of the container."
                else:
                    instruction = f"Step 1: Place the {type_name} box on the container floor."
            else:
                instruction = f"Step 1: Stack the {type_name} box on top of the previously placed boxes."
            
            if box.is_rotated:
                instruction += " (Rotate the box 90 degrees before placing.)"
            
            instructions.append(instruction)
    
    return instructions

def generate_packing_plan(box_data: List[Dict], container_type: str) -> Tuple[Dict, int]:
    """Main function to generate optimized packing plan"""
    
    # Find container
    container = next((c for c in CONTAINERS if c['type'] == container_type), None)
    if not container:
        return {"error": f"Container type {container_type} not found"}, 400
    
    # Create packing space
    packing_space = PackingSpace(container["size"], container["max_weight"])
    
    # Create box objects grouped by material for step organization
    material_boxes = {}
    for item in box_data:
        material_id = item["material_id"]
        quantity = item["quantity"]
        allow_rotation = item.get("allow_rotation", False)
        
        # Find box data
        box_data_entry = next((b for b in GARMENT_BOXES if b['material_id'] == material_id), None)
        if not box_data_entry:
            return {"error": f"Material {material_id} not found"}, 400
        
        # Create box instances for this material
        material_boxes[material_id] = []
        for _ in range(quantity):
            box = Box(
                material_id=material_id,
                size=box_data_entry["size"],
                weight=box_data_entry["weight"],
                max_weight_upright=box_data_entry["max_weight_upright"],
                max_weight_rotated=box_data_entry["max_weight_rotated"],
                allow_rotation=allow_rotation
            )
            material_boxes[material_id].append(box)
    
    # Find optimal packing arrangement for all boxes
    all_boxes = [box for boxes in material_boxes.values() for box in boxes]
    placed_boxes = find_best_positions(packing_space, all_boxes)
    
    # Group placed boxes back by material for step organization
    placed_by_material = {}
    for box, position in placed_boxes:
        if box.material_id not in placed_by_material:
            placed_by_material[box.material_id] = []
        placed_by_material[box.material_id].append((box, position))
    
    # Count packed quantities by material
    packed_quantities = {}
    for box, _ in placed_boxes:
        type_name = f"Type-{box.material_id}"
        packed_quantities[type_name] = packed_quantities.get(type_name, 0) + 1
    
    # Generate instructions using single API call
    plan = generate_step_plan(placed_by_material, container_type)
    
    # Check if all boxes were packed
    all_packed = len(placed_boxes) == len(all_boxes)
    
    # Create response in your exact format
    response = {
        "isAllPacked": all_packed,
        "packed_box_quantity": packed_quantities,
        "plan": plan
    }
    
    return response, 200

def _calculate_volume_utilization(placed_boxes: List[Tuple[Box, Tuple[int, int, int]]], 
                                container_size: Tuple[int, int, int]) -> float:
    """Calculate volume utilization percentage"""
    total_box_volume = sum(box.size[0] * box.size[1] * box.size[2] for box, _ in placed_boxes)
    container_volume = container_size[0] * container_size[1] * container_size[2]
    return (total_box_volume / container_volume) * 100 if container_volume > 0 else 0

# Example usage function for testing
def test_packing_service():
    """Test function to demonstrate the packing service"""
    test_request = {
        "container_type": "Medium Truck",
        "box_data": [
            {
                "material_id": "cotton-small",
                "quantity": 3,
                "allow_rotation": False
            },
            {
                "material_id": "cotton-large",
                "quantity": 2,
                "allow_rotation": True
            }
        ]
    }
    
    result, status_code = generate_packing_plan(test_request["box_data"], test_request["container_type"])
    return result, status_code