# Example code using Unsloth Llama as suggested in the task
# This is a template for the user to use with their trained weights.

try:
    from unsloth import FastLanguageModel
    import torch
except ImportError:
    FastLanguageModel = None

class QuestionModelLlama:
    def __init__(self, model_name="unsloth/llama-3-8b-bnb-4bit"):
        self.model_name = model_name
        self.max_seq_length = 2048
        self.dtype = None
        self.load_in_4bit = True
        
        if FastLanguageModel:
            self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                model_name = model_name,
                max_seq_length = self.max_seq_length,
                dtype = self.dtype,
                load_in_4bit = self.load_in_4bit,
            )
            FastLanguageModel.for_inference(self.model)
        else:
            print("Unsloth not installed. Using placeholder for Llama model.")

    def generate_question(self, topic: str, sample_q="{}") -> dict:
        from utils.build_prompt import build_q_prompt
        prompt = build_q_prompt(topic, sample_q)
        
        if FastLanguageModel:
            inputs = self.tokenizer([prompt], return_tensors = "pt").to("cuda")
            outputs = self.model.generate(**inputs, max_new_tokens = 512)
            response = self.tokenizer.batch_decode(outputs)[0]
            
            import re
            json_match = re.search(r'\{.*\}', response.split("### Response:")[1], re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            return {"error": "Failed to parse model output"}
        else:
            return {"error": "Model not loaded"}
