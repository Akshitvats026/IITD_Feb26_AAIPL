"""
Fine-tuning script for AMD AI Reasoning Competition.
Optimized for the Answer Agent using Unsloth.
"""

import json
import torch
import os
from unsloth import FastLanguageModel
from datasets import Dataset
from trl import SFTTrainer
from transformers import TrainingArguments
from utils.build_prompt import build_a_prompt

# 1. Config
MODEL_NAME = "unsloth/llama-3-8b-bnb-4bit"
MAX_SEQ_LENGTH = 2048
DATASET_FILE = "reasoning_dataset_2000.json"
OUTPUT_DIR = "answer_model_lora"

# 2. Load Model
print(f"Loading model {MODEL_NAME}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = MODEL_NAME,
    max_seq_length = MAX_SEQ_LENGTH,
    load_in_4bit = True,
)

# 3. Add LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 16,
    lora_dropout = 0,
    bias = "none",
)

# 4. Prepare Dataset
print(f"Loading dataset {DATASET_FILE}...")
if not os.path.exists(DATASET_FILE):
    print(f"Error: {DATASET_FILE} not found. Ensure the dataset is in the current directory.")
    import sys
    sys.exit(1)

with open(DATASET_FILE, "r") as f:
    data = json.load(f)

def format_prompt(sample):
    # Match the competition prompt style
    prompt = build_a_prompt(sample['question'], sample['choices'])
    # Goal output format: {"answer": "A", "reasoning": "..."}
    reasoning = sample.get('explanation', sample.get('reasoning', ''))
    response = json.dumps({
        "answer": sample['answer'],
        "reasoning": reasoning
    })
    return {
        "text": f"{prompt}{response}"
    }

dataset = Dataset.from_list([format_prompt(s) for s in data])

# 5. Training Arguments
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = MAX_SEQ_LENGTH,
    args = TrainingArguments(
        per_device_train_batch_size = 4, # Optimized for performance
        gradient_accumulation_steps = 4,
        warmup_steps = 10,
        max_steps = 1200, # Increased steps for better reasoning
        learning_rate = 2e-4,
        fp16 = not torch.cuda.is_bf16_supported(),
        bf16 = torch.cuda.is_bf16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "cosine",
        seed = 3407,
        output_dir = "outputs",
    ),
)

# 6. Train and Save
print("Starting training...")
trainer.train()

print(f"Saving model to {OUTPUT_DIR}...")
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)
print("Fine-tuning complete!")