# Example code using Unsloth Llama for the Answer Agent
try:
    from unsloth import FastLanguageModel
    import torch
except ImportError:
    FastLanguageModel = None

class AnswerModelLlama:
    def __init__(self, model_name="unsloth/llama-3-8b-bnb-4bit"):
        self.model_name = model_name
        
        if FastLanguageModel:
            self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                model_name = model_name,
                max_seq_length = 2048,
                load_in_4bit = True,
            )
            FastLanguageModel.for_inference(self.model)

    def answer_question(self, question_data: dict) -> dict:
        from utils.build_prompt import build_a_prompt
        prompt = build_a_prompt(question_data['question'], question_data['choices'])
        
        if FastLanguageModel:
            inputs = self.tokenizer([prompt], return_tensors = "pt").to("cuda")
            outputs = self.model.generate(**inputs, max_new_tokens = 512)
            response = self.tokenizer.batch_decode(outputs)[0]
            
            # Use regex to extract JSON from the response
            import re
            json_match = re.search(r'\{.*\}', response.split("### Response:")[1], re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            return {"answer": "A", "reasoning": "Failed to parse model output."}
        else:
            return {"answer": "A", "reasoning": "Llama model not loaded."}
