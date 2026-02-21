import argparse
import json
import os
from agents.question_model import QuestionModel

def main():
    parser = argparse.ArgumentParser(description="Generate questions using the Q-Agent.")
    parser.add_argument("--output_file", type=str, required=True, help="File to save questions.")
    parser.add_argument("--num_questions", type=int, default=10, help="Number of questions to generate.")
    parser.add_argument("--verbose", action="store_true", help="Print progress.")

    args = parser.parse_args()

    # Load topics
    topics_path = os.path.join("assets", "topics.json")
    with open(topics_path, "r") as f:
        topics = json.load(f)

    model = QuestionModel()
    questions = []

    for i in range(args.num_questions):
        topic = random_topic = topics[i % len(topics)]
        if args.verbose:
            print(f"Generating question {i+1}/{args.num_questions} for topic: {topic}")
        
        q = model.generate_question(topic)
        questions.append(q)

    # Ensure output directory exists
    output_dir = os.path.dirname(args.output_file)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    with open(args.output_file, "w") as f:
        json.dump(questions, f, indent=4)

    print(f"Successfully generated {len(questions)} questions in {args.output_file}")

if __name__ == "__main__":
    main()
