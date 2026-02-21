const fs = require('fs');

function evaluate(qFile, aFile) {
    try {
        const questions = JSON.parse(fs.readFileSync(qFile, 'utf8'));
        const answers = JSON.parse(fs.readFileSync(aFile, 'utf8'));

        const N = questions.length;
        let correct = 0;
        const details = [];

        for (let i = 0; i < N; i++) {
            const q = questions[i];
            const a = answers[i];
            const isCorrect = q.answer === a.answer;
            if (isCorrect) correct++;
            details.push({
                id: i + 1,
                topic: q.topic,
                qAns: q.answer,
                aAns: a.answer,
                status: isCorrect ? "PASS" : "FAIL"
            });
        }

        console.log("\n" + "=".repeat(40));
        console.log(" AUTOMATED PROJECT RUN REPORT ");
        console.log("=".repeat(40));
        console.log(`Total Questions Processed: ${N}`);
        console.log(`Correct Multi-Choice:    ${correct}`);
        console.log(`Accuracy Rate:           ${((correct / N) * 100).toFixed(2)}%`);
        console.log("=".repeat(40));

        const topics = {};
        details.forEach(d => {
            const t = d.topic;
            if (!topics[t]) topics[t] = { total: 0, correct: 0 };
            topics[t].total++;
            if (d.status === "PASS") topics[t].correct++;
        });

        console.log("\nTOPIC BREAKDOWN:");
        for (const [t, stats] of Object.entries(topics)) {
            const rate = (stats.correct / stats.total) * 100;
            console.log(`- ${t.padEnd(40)} | ${rate.toFixed(2).padStart(6)}% (${stats.correct}/${stats.total})`);
        }
        console.log("=".repeat(40) + "\n");

    } catch (e) {
        console.error(`Evaluation failed: ${e.message}`);
    }
}

const qFile = process.argv[2] || "outputs/full_pipeline_questions.json";
const aFile = process.argv[3] || "outputs/full_pipeline_answers.json";

evaluate(qFile, aFile);
