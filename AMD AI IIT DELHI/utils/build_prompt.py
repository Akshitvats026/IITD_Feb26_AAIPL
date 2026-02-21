def build_q_prompt(topic, sample_q):
    return f"""You are a logical reasoning expert.
Generate a puzzle question for the topic: {topic}.
Follow the format strictly as shown in this example:
{sample_q}

Only output the JSON object."""

def build_a_prompt(question_text, choices, sample_a):
    return f"""Solve the following puzzle:
{question_text}

Choices:
{choices}

Provide your answer in the format shown here:
{sample_a}

Only output the JSON object."""
