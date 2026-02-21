import json
import random
import time
import re
import argparse
import os
import sys
from typing import Dict, Any, List

# Ensure we can import from utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from unsloth import FastLanguageModel
    import torch
    HAS_UNSLOTH = True
except ImportError:
    HAS_UNSLOTH = False

class QuestionModel:
    def __init__(self, model_name: str = "unsloth/llama-3-8b-bnb-4bit"):
        """
        Initializes the QuestionModel.
        Uses the environment's model (e.g., Llama-3 via Unsloth).
        """
        self.max_seq_length = 2048
        self.dtype = None  # None for auto detection. Float16 for Tesla T4, V100, Bfloat16 for Ampere+
        self.load_in_4bit = True
        self.model_name = model_name
        
        # Procedural fallbacks for safety and formatting guidance
        self.nouns = ["Doctors", "Engineers", "Artists", "Teachers", "Lawyers", "Scientists", "Painters", "Dancers", "Plumbers", "Athletes"]
        self.people = ["A", "B", "C", "D", "E", "F", "G", "H"]
        self.circular_people = ["P", "Q", "R", "S", "T", "U", "V", "W"]
        self.topics = [
            "Logical Reasoning: Syllogisms",
            "Puzzles: Seating Arrangements (Linear)",
            "Puzzles: Seating Arrangements (Circular)",
            "Blood Relations and Family Tree",
            "Alphanumeric Series"
        ]

        if HAS_UNSLOTH:
            try:
                print(f"Loading environment model: {model_name}...")
                # Load the model and tokenizer from the environment's pre-configured path
                self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                    model_name = model_name,
                    max_seq_length = self.max_seq_length,
                    dtype = self.dtype,
                    load_in_4bit = self.load_in_4bit,
                )
                FastLanguageModel.for_inference(self.model)
                print("Environment model loaded successfully.")
            except Exception as e:
                print(f"Direct model load failed ({e}). Attempting local fallback...")
                try:
                    # Try loading from the local finetuned weights if direct load fails
                    local_path = "reasoning_model_lora"
                    if os.path.exists(local_path):
                        self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                            model_name = local_path,
                            max_seq_length = self.max_seq_length,
                            dtype = self.dtype,
                            load_in_4bit = self.load_in_4bit,
                        )
                        FastLanguageModel.for_inference(self.model)
                        print(f"Loaded local finetuned model from {local_path}")
                    else:
                        print("No local model found. Using procedural generation.")
                        self.model = None
                except Exception as inner_e:
                    print(f"Crucial error: {inner_e}")
                    self.model = None
        else:
            print("Unsloth not found in this environment. Falling back to procedural generation.")
            self.model = None

    def generate_question(self, topic: str, use_llama: bool = True) -> Dict[str, Any]:
        if use_llama and self.model:
            return self.generate_question_llama(topic)
        return self._generate_procedural(topic)

    def generate_question_llama(self, topic: str) -> Dict[str, Any]:
        """Uses the Unsloth model to generate a question in JSON format."""
        # Generate a procedural example to show the model the desired schema
        sample_q_dict = self._generate_procedural(topic)
        sample_q = json.dumps(sample_q_dict, indent=4)
        
        from utils.build_prompt import build_q_prompt
        prompt = build_q_prompt(topic, sample_q)
        
        try:
            inputs = self.tokenizer([prompt], return_tensors = "pt").to("cuda")
            outputs = self.model.generate(**inputs, max_new_tokens = 512, use_cache = True)
            response = self.tokenizer.batch_decode(outputs)[0]
            
            # Extract JSON from the generated response
            response_content = response
            if "### Response:" in response:
                response_content = response.split("### Response:")[1]
                
            json_match = re.search(r'\{.*\}', response_content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except Exception as e:
            print(f"Model generation error for topic '{topic}': {e}. Using procedural fallback.")
        
        return self._generate_procedural(topic)

    def generate_n_questions(self, n: int, output_file: str = "generated_questions.json"):
        """Generates n questions across various logical reasoning topics and saves as JSON."""
        print(f"Starting batch generation of {n} questions...")
        all_questions = []
        for i in range(n):
            topic = random.choice(self.topics)
            print(f"[{i+1}/{n}] Generating: {topic}")
            q = self.generate_question(topic)
            all_questions.append(q)
        
        # Ensure outputs directory exists if output_file is in a subdirectory
        out_dir = os.path.dirname(output_file)
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
            
        with open(output_file, "w") as f:
            json.dump(all_questions, f, indent=4)
        print(f"\nSuccessfully generated {n} questions. Saved to: {output_file}")

    def _format_entry(self, topic, question, options, correct_idx, reasoning):
        letters = ["A", "B", "C", "D"]
        return {
            "topic": topic, "question": question.strip(),
            "choices": [f"{letters[i]}) {options[i]}" for i in range(4)],
            "answer": letters[correct_idx],
            "reasoning": reasoning.strip()
        }

    def _generate_procedural(self, topic: str) -> Dict[str, Any]:
        """Procedural fallback logic for different reasoning topics."""
        if "Syllogisms" in topic:
            return self._generate_syllogism()
        elif "Linear" in topic:
            return self._generate_linear()
        elif "Circular" in topic:
            return self._generate_circular()
        elif "Blood Relations" in topic:
            return self._generate_blood()
        elif "Series" in topic:
            return self._generate_series()
        else:
            return self._generate_syllogism()

    def _generate_syllogism(self):
        A, B, C = random.sample(self.nouns, 3)
        q = f"Statements:\nAll {A} are {B}. All {B} are {C}.\n\nConclusions:\nI. Some {A} are {C}\nII. Some {C} are {B}"
        options = ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"]
        return self._format_entry("Logical Reasoning: Syllogisms", q, options, 2, "Transitive property applies.")

    def _generate_linear(self):
        p = random.sample(self.people, 6)
        q = f"Six persons {', '.join(p)} sit in a row. {p[0]} is at the end. {p[1]} is next to {p[2]}."
        return self._format_entry("Puzzles: Seating Arrangements (Linear)", q, random.sample(p, 4), 0, "Arrangement logic.")

    def _generate_circular(self):
        p = random.sample(self.circular_people, 6)
        q = f"Six persons {', '.join(p)} sit circle. {p[0]} is opposite {p[1]}."
        return self._format_entry("Puzzles: Seating Arrangements (Circular)", q, random.sample(p, 4), 0, "Circular symmetry.")

    def _generate_blood(self):
        q = "Pointing to a man, a woman said: 'His mother is the only daughter of my mother.' How is the woman related to the man?"
        return self._format_entry("Blood Relations and Family Tree", q, ["Mother", "Aunt", "Sister", "Daughter"], 0, "Lineage analysis.")

    def _generate_series(self):
        return self._format_entry("Alphanumeric Series", "2, 4, 8, 16, ?", ["32", "24", "64", "20"], 0, "Geometric progression (x2).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", type=int, default=10, help="Number of questions to generate")
    parser.add_argument("-o", "--output", type=str, default="outputs/generated_questions.json")
    parser.add_argument("-m", "--model", type=str, default="unsloth/llama-3-8b-bnb-4bit")
    args = parser.parse_args()
    
    gen = QuestionModel(model_name=args.model)
    gen.generate_n_questions(args.n, args.output)
