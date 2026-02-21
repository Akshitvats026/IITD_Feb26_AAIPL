const fs = require('fs');

const DATASET_SIZE = 1000;
const dataset = [];

const formatEntry = (topic, question, options, correctIndex, explanation) => {
    const letters = ["A", "B", "C", "D"];
    return {
        topic,
        question: question.trim(),
        choices: options.map((opt, i) => `${letters[i]}) ${opt}`),
        answer: letters[correctIndex],
        explanation: explanation.trim()
    };
};

// ---------- SYLLOGISM ----------
const generateSyllogism = () => {
    const nouns = ["Doctors", "Engineers", "Artists", "Teachers", "Lawyers", "Scientists", "Painters", "Dancers", "Plumbers", "Athletes"];
    const [A, B, C] = [...nouns].sort(() => 0.5 - Math.random()).slice(0, 3);

    const types = [
        {
            q: `All ${A} are ${B}. All ${B} are ${C}.`,
            ans: 2,
            exp: `By transitive property, if all ${A} are ${B} and all ${B} are ${C}, then all ${A} are ${C}. This implies 'Some ${A} are ${C}' is true. Also, since all ${B} are ${C}, it follows that 'Some ${C} are ${B}'. Thus, both conclusions follow.`
        },
        {
            q: `All ${A} are ${B}. Some ${B} are ${C}.`,
            ans: 1,
            exp: `While all ${A} are ${B}, the 'some' relationship between ${B} and ${C} does not guarantee a connection between ${A} and ${C}. However, 'Some ${B} are ${C}' directly implies 'Some ${C} are ${B}'. Only conclusion II follows.`
        },
        {
            q: `No ${A} is ${B}. All ${B} are ${C}.`,
            ans: 3,
            exp: `The exclusion of ${A} from ${B} and the inclusion of ${B} in ${C} does not provide enough information to conclude a relationship between ${A} and ${C}. Likewise, '${C}' might contain elements outside of '${B}', so we cannot confirm 'Some ${C} are ${B}' based only on exclusion rules.`
        }
    ];

    const choice = types[Math.floor(Math.random() * types.length)];
    const question = `Statements:\n${choice.q}\n\nConclusions:\nI. Some ${A} are ${C}\nII. Some ${C} are ${B}\n\nWhich conclusion logically follows?`;
    const options = ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"];

    return formatEntry("Logical Reasoning - Syllogism", question, options, choice.ans, choice.exp);
};

// ---------- LINEAR SEATING ----------
const generateLinear = () => {
    const people = ["A", "B", "C", "D", "E", "F", "G", "H"].sort(() => 0.5 - Math.random()).slice(0, 6);
    const question = `Six persons ${people.join(", ")} sit in a row.\n${people[0]} sits at one extreme end.\n${people[1]} and ${people[2]} are immediate neighbors.\n${people[3]} sits third to the right of ${people[0]}.\n${people[4]} sits between ${people[1]} and ${people[5]}.\n\nWho is sitting at the other extreme end?`;

    const correct = people[5];
    let options = [...people].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    options.sort(() => 0.5 - Math.random());

    const explanation = `Based on the clues: ${people[0]} is at position 1. ${people[3]} is at position 4. ${people[1]} and ${people[2]} are neighbors. ${people[4]} being between ${people[1]} and ${people[5]} suggests a cluster. Arranging them linearly (1: ${people[0]}, 2: ${people[2]}, 3: ${people[1]}, 4: ${people[3]}, 5: ${people[4]}, 6: ${people[5]}), we find that ${people[5]} is at the other extreme end.`;

    return formatEntry("Seating Arrangement - Linear", question, options, options.indexOf(correct), explanation);
};

// ---------- CIRCULAR SEATING ----------
const generateCircular = () => {
    const people = ["P", "Q", "R", "S", "T", "U", "V", "W"].sort(() => 0.5 - Math.random()).slice(0, 6);
    const question = `Six persons ${people.join(", ")} sit around a circular table facing the center.\n${people[0]} sits opposite to ${people[1]}.\n${people[2]} sits to the immediate left of ${people[0]}.\n${people[3]} sits opposite to ${people[2]}.\n\nWho is sitting to the immediate right of ${people[1]}?`;

    const correct = people[3];
    let options = [...people].sort(() => 0.5 - Math.random()).slice(0, 4);
    if (!options.includes(correct)) options[0] = correct;
    options.sort(() => 0.5 - Math.random());

    const explanation = `In a 6-person circle: ${people[0]} and ${people[1]} are opposite. ${people[2]} to the left of ${people[0]}. Its opposite position is held by ${people[3]}. Moving clockwise/counter-clockwise from ${people[0]}, we see that the position to the right of ${people[1]} is indeed occupied by ${people[3]} given the symmetry of the arrangement.`;

    return formatEntry("Seating Arrangement - Circular", question, options, options.indexOf(correct), explanation);
};

// ---------- BLOOD RELATIONS ----------
const generateBlood = () => {
    const relations = [
        ["Pointing to a lady, a man said, 'She is the daughter of my mother's only son'.", "Daughter", "The 'mother's only son' is the man himself. Since the lady is the daughter of that son, she is the man's daughter."],
        ["A's father is B's son. C is A's paternal uncle and D is B's brother. How is D related to B?", "Brother", "The statement directly identifies D as B's brother."],
        ["Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son'.", "Sister", "Grandfather's only son is Vipul's father. The daughter of Vipul's father is Vipul's sister."]
    ];

    const [q, correct, exp] = relations[Math.floor(Math.random() * relations.length)];
    let options = [correct, "Father", "Grandfather", "Cousin"].sort(() => 0.5 - Math.random());

    return formatEntry("Blood Relations", q, options, options.indexOf(correct), exp);
};

const engines = [
    [generateSyllogism, 250],
    [generateLinear, 250],
    [generateCircular, 250],
    [generateBlood, 250]
];

for (const [engine, count] of engines) {
    for (let i = 0; i < count; i++) {
        dataset.push(engine());
    }
}

dataset.sort(() => 0.5 - Math.random());

fs.writeFileSync('outputs/full_pipeline_questions.json', JSON.stringify(dataset, null, 2));
console.log(`${dataset.length} entries generated successfully in outputs/full_pipeline_questions.json.`);
