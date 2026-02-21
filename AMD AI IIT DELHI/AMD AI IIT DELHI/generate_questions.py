from agents.question_model import QuestionModel
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate reasoning questions.")
    parser.add_argument("-n", type=int, default=10, help="Number of questions to generate.")
    parser.add_argument("-o", "--output", type=str, default="output.json", help="Output JSON file.")
    
    args = parser.parse_args()
    
    print(f"Initializing QuestionModel and generating {args.n} questions...")
    model = QuestionModel()
    model.generate_n_questions(args.n, args.output)
    print(f"Generation complete. Results saved to {args.output}")
