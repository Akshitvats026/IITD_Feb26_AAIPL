import argparse
import json
import os
from agents.answer_model import AnswerModel

def main():
    parser = argparse.ArgumentParser(description="Answer questions using the A-Agent.")
    parser.add_argument("--input_file", type=str, required=True, help="File containing questions.")
    parser.add_argument("--output_file", type=str, required=True, help="File to save answers.")
    parser.add_argument("--verbose", action="store_true", help="Print progress.")

    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: Input file {args.input_file} not found.")
        return

    with open(args.input_file, "r") as f:
        questions = json.load(f)

    model = AnswerModel()
    answers = []

    for i, q_data in enumerate(questions):
        if args.verbose:
            print(f"Answering question {i+1}/{len(questions)}")
        
        ans = model.answer_question(q_data)
        answers.append(ans)

    # Ensure output directory exists
    output_dir = os.path.dirname(args.output_file)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(args.output_file, "w") as f:
        json.dump(answers, f, indent=4)

    print(f"Successfully answered {len(answers)} questions in {args.output_file}")

if __name__ == "__main__":
    main()
