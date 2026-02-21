import os
for k, v in os.environ.items():
    if "MODEL" in k or "LLAMA" in k or "PATH" in k:
        print(f"{k}: {v}")
