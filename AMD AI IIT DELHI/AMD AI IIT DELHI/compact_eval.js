const fs = require('fs');
const qs = JSON.parse(fs.readFileSync('outputs/full_pipeline_questions.json', 'utf8'));
const as = JSON.parse(fs.readFileSync('outputs/full_pipeline_answers.json', 'utf8'));
let correct = 0;
const topics = {};
qs.forEach((q, i) => {
    const isCorrect = q.answer === as[i].answer;
    if (isCorrect) correct++;
    if (!topics[q.topic]) topics[q.topic] = { total: 0, correct: 0 };
    topics[q.topic].total++;
    if (isCorrect) topics[q.topic].correct++;
});
console.log(`TOTAL: ${correct}/${qs.length} (${((correct / qs.length) * 100).toFixed(2)}%)`);
for (const [t, s] of Object.entries(topics)) {
    console.log(`${t}: ${s.correct}/${s.total} (${((s.correct / s.total) * 100).toFixed(2)}%)`);
}
