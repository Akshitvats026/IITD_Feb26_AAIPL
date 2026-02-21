# 🏆 AAIPL – Adversarial Language Model Agents  
### Built using Llama 3.1 for AMD AI Premier League (AAIPL)

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Model](https://img.shields.io/badge/Model-Llama%203.1-orange)
![Framework](https://img.shields.io/badge/Framework-Transformers-yellow)
![Environment](https://img.shields.io/badge/Environment-Jupyter%20Notebook-green)
![Status](https://img.shields.io/badge/Status-Hackathon%20Project-success)

---

## 📌 Overview

This project implements a competitive AI framework where two intelligent agents compete in a head-to-head multiple choice question battle.

The system consists of:

- 🧠 **Q-Agent** – Generates difficult, domain-specific MCQs  
- 🤖 **A-Agent** – Solves MCQs using structured reasoning  
- 📊 **Evaluation Module** – Measures accuracy and robustness  

The entire system was developed using **Llama 3.1** within the provided hackathon Jupyter environment.

---

## 🎯 Problem Statement

In the AMD AI Premier League (AAIPL), teams are required to build:

1. A **Question Agent** capable of generating challenging and valid MCQs.
2. An **Answer Agent** capable of solving opponent-generated questions accurately.

The objective is to maximize:
- Question difficulty  
- Question correctness  
- Answer accuracy  
- System reliability  

---

## 🧠 Model Used

### 🔹 Llama 3.1

- Large Language Model optimized for reasoning
- Used for both Q-Agent and A-Agent
- Controlled via structured prompt engineering
- Tuned for multi-step logical analysis

---

## 🏗 System Architecture

```
Jupyter Notebook Environment
        ↓
Llama 3.1 Model
   ├── Q-Agent Prompt Layer
   └── A-Agent Prompt Layer
        ↓
Evaluation Logic
        ↓
Match Results & Accuracy
```

---

## 🧠 Q-Agent Design (Question Generator)

The Q-Agent generates domain-specific MCQs using structured prompts.

### ✅ Features

- Generates 4-option MCQs (A–D)
- Ensures only one correct answer
- Includes multi-step reasoning questions
- Self-verification for logical consistency
- Difficulty-aware question generation

### 🔎 Strategy

- Conceptual traps
- Edge-case reasoning
- Strict output formatting
- Validation before final output

---

## 🤖 A-Agent Design (Answer Solver)

The A-Agent solves questions using step-by-step reasoning.

### ✅ Features

- Chain-of-thought reasoning
- Option-wise logical elimination
- Internal consistency check
- Confidence estimation

### 📌 Example Output

```
Final Answer: C  
Confidence: 87%
```

---

## 📊 Evaluation Strategy

The system evaluates performance using:

- Accuracy (% correct answers)
- Question validity rate
- Logical consistency check
- Multi-match simulation testing

Multiple simulated matches were conducted to validate robustness.

---

## ⚙️ Tech Stack

- Python 3.10+
- Llama 3.1
- PyTorch
- HuggingFace Transformers
- Jupyter Notebook (Hackathon Platform)

---

## 📂 Project Structure

```
AAIPL_Project.ipynb
│
├── Q-Agent Implementation
├── A-Agent Implementation
├── Evaluation Loop
└── Match Simulation
```

---

## 🚀 Key Innovations

- Adversarial co-design of question and answer agents
- Structured prompt engineering for difficulty control
- Self-verification mechanism in Q-Agent
- Reasoning-based validation in A-Agent
- Modular AI architecture within notebook environment

---

## 🔮 Future Improvements

- LoRA-based domain fine-tuning
- Reinforcement learning for adaptive difficulty
- Multi-domain expansion
- API-based deployment
- Competitive benchmarking system

---

## 👥 Team

- ML Engineer – Model design & optimization  
- Developer – Integration & implementation  
- Designer – Documentation & presentation  

---

## 🏁 Conclusion

This project demonstrates how structured prompt engineering combined with Llama 3.1 can create an effective adversarial AI competition framework capable of generating and solving high-difficulty MCQs with strong reasoning and accuracy.

Built entirely within the provided AAIPL Jupyter environment.

---

⭐ If you found this project interesting, feel free to star the repository!
