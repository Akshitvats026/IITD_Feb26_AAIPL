def build_q_prompt(topic, sample_q):
    return f"""### Instruction:
You are a logical reasoning expert. Generate a reasoning puzzle for the topic: {topic}.

### Example Format:
{sample_q}

### Response:
"""

def build_a_prompt(question_text, choices, sample_a=None):
    prompt = f"""### Instruction:
Solve the following logical reasoning puzzle. Provide your response strictly in JSON format with "answer" and "reasoning" keys.

### Question:
{question_text}

### Choices:
{choices}

### Response:
"""
    return prompt
