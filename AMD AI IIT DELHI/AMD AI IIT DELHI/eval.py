import json
import sys
import argparse

def evaluate(q_file, a_file):
    try:
        with open(q_file, "r") as f:
            questions = json.load(f)
        with open(a_file, "r") as f:
            answers = json.load(f)
        
        N = len(questions)
        correct = 0
        details = []
        
        for i, (q, a) in enumerate(zip(questions, answers)):
            is_correct = q['answer'] == a['answer']
            if is_correct:
                correct += 1
            details.append({
                "id": i + 1,
                "topic": q['topic'],
                "q_ans": q['answer'],
                "a_ans": a['answer'],
                "status": "PASS" if is_correct else "FAIL"
            })
        
        print("\n" + "="*40)
        print(" AUTOMATED PROJECT RUN REPORT ")
        print("="*40)
        print(f"Total Questions Processed: {N}")
        print(f"Correct Multi-Choice:    {correct}")
        print(f"Accuracy Rate:           {(correct/N)*100:.2f}%")
        print("="*40)
        
        # Display breakdown by topic
        topics = {}
        for d in details:
            t = d['topic']
            if t not in topics: topics[t] = {"total": 0, "correct": 0}
            topics[t]["total"] += 1
            if d['status'] == "PASS": topics[t]["correct"] += 1
        
        print("\nTOPIC BREAKDOWN:")
        for t, stats in topics.items():
            rate = (stats['correct']/stats['total'])*100
            print(f"- {t:40} | {rate:6.2f}% ({stats['correct']}/{stats['total']})")
        print("="*40 + "\n")
        
    except Exception as e:
        print(f"Evaluation failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--q_file", default="outputs/questions.json")
    parser.add_argument("--a_file", default="outputs/answers.json")
    args = parser.parse_args()
    
    evaluate(args.q_file, args.a_file)
