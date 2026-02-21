const fs = require('fs');

const DATASET_SIZE = 2100;
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
        },
        {
            q: `Some ${A} are ${B}. Some ${B} are ${C}.`,
            ans: 3,
            exp: `Two 'some' statements do not allow for a definite logical conclusion regarding the relationship between the first and last terms. There is no guaranteed overlap between ${A} and ${C}.`
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
        ["A's father is B's son. C is A's paternal uncle and D is B's brother. How is D related to B?", "Brother", "The statement directly identifies D as B's brother. Other relationships provided help establish the family tree but do not negate the direct identification of D as B's brother."],
        ["Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son'.", "Sister", "Grandfather's only son is Vipul's father. The daughter of Vipul's father is Vipul's sister."],
        ["Looking at a portrait, a man said, 'I have no brother or sister, but that man's father is my father's son'. Whose portrait was it?", "His son's", " 'My father's son' with no siblings refers to the man himself. If that man's father is the speaker, then the person in the portrait is the speaker's son."],
        ["If A is the brother of B; B is the sister of C; and C is the father of D, how A is related to D?", "Uncle", "A and B are siblings of C. Since C is the father of D, his brother A is D's paternal uncle."]
    ];

    const [q, correct, exp] = relations[Math.floor(Math.random() * relations.length)];
    let options = [correct, "Father", "Grandfather", "Cousin"].sort(() => 0.5 - Math.random());

    return formatEntry("Blood Relations", q, options, options.indexOf(correct), exp);
};

// ---------- SERIES ----------
const generateSeries = () => {
    const type = ["arithmetic", "geometric", "squares", "primes"][Math.floor(Math.random() * 4)];
    let seq, ans, exp;

    if (type === "arithmetic") {
        const base = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 10) + 2;
        seq = [0, 1, 2, 3].map(i => base + i * diff);
        ans = base + 4 * diff;
        exp = `This is an arithmetic progression where each term increases by ${diff}. Adding ${diff} to the last term (${seq[3]}) gives ${ans}.`;
    } else if (type === "geometric") {
        const base = Math.floor(Math.random() * 5) + 1;
        const ratio = Math.floor(Math.random() * 2) + 2;
        seq = [0, 1, 2, 3].map(i => base * Math.pow(ratio, i));
        ans = base * Math.pow(ratio, 4);
        exp = `This is a geometric progression with a common ratio of ${ratio}. Multiplying the last term (${seq[3]}) by ${ratio} gives ${ans}.`;
    } else if (type === "squares") {
        const start = Math.floor(Math.random() * 10) + 1;
        seq = [0, 1, 2, 3].map(i => Math.pow(start + i, 2));
        ans = Math.pow(start + 4, 2);
        exp = `The series represents the squares of consecutive integers starting from ${start}. The next integer is ${start + 4}, and its square is ${ans}.`;
    } else {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
        const idx = Math.floor(Math.random() * (primes.length - 5));
        seq = primes.slice(idx, idx + 4);
        ans = primes[idx + 4];
        exp = `The terms in the series are consecutive prime numbers. The prime number following ${seq[3]} is ${ans}.`;
    }

    const question = `What comes next in the series: ${seq.join(", ")}, ?`;
    let options = [ans, ans + 2, ans - 2, ans + 5].sort(() => 0.5 - Math.random());

    return formatEntry("Mixed Series & Patterns", question, options, options.indexOf(ans), exp);
};

// ---------- CODING-DECODING ----------
const generateCoding = () => {
    const words = [["APPLE", "BQQMF"], ["ORANGE", "PSBOHF"], ["BANANA", "CBOBOB"], ["GRAPES", "HSBQFT"]];
    const [word, code] = words[Math.floor(Math.random() * words.length)];

    const targets = ["PEACH", "MANGO", "LEMON", "CHERRY"];
    const targetWord = targets[Math.floor(Math.random() * targets.length)];
    const targetCode = targetWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('');

    const question = `If in a certain code ${word} is written as ${code}, how will ${targetWord} be written in that code?`;
    let options = [targetCode,
        targetWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 2)).join(''),
        targetWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join(''),
        targetWord.split('').reverse().join('')
    ].sort(() => 0.5 - Math.random());

    const explanation = `The coding logic follows a +1 shift in the alphabet (e.g., A becomes B). Applying this +1 shift to each letter of '${targetWord}' results in '${targetCode}'.`;

    return formatEntry("Coding-Decoding", question, options, options.indexOf(targetCode), explanation);
};

// ---------- DIRECTION SENSE ----------
const generateDirection = () => {
    const dist1 = Math.floor(Math.random() * 15) + 5;
    const dist2 = Math.floor(Math.random() * 15) + 5;
    const question = `A person starts from point A and walks ${dist1}m North, then turns right and walks ${dist2}m. In which direction is he now with respect to the starting point?`;
    const ans = "North-East";
    const options = ["North-East", "North-West", "South-East", "South-West"].sort(() => 0.5 - Math.random());
    const explanation = `The person moves North and then East. This puts them in the quadrant between the North and East axes relative to the starting point, which is the North-East direction.`;
    return formatEntry("Direction Sense", question, options, options.indexOf(ans), explanation);
};

// ---------- COMPLEX LOGIC (If-Then) ----------
const generateComplexLogic = () => {
    const states = ["Rainy", "Sunny", "Cloudy", "Cold", "Windy"];
    const actions = ["Stay home", "Go to park", "Carry umbrella", "Wear jacket", "Fly kite"];
    const [S1, S2] = states.sort(() => 0.5 - Math.random());
    const [A1, A2] = actions.sort(() => 0.5 - Math.random());

    const question = `If it is ${S1}, then people ${A1}. If it is not ${S1}, it is ${S2}. People only ${A2} when it is ${S2}.\nToday it is not ${S1}.\nWhich of the following must be true?`;
    const ans = `People ${A2}`;
    const options = [`People ${A2}`, `People ${A1}`, `It is ${S1}`, "Cannot be determined"].sort(() => 0.5 - Math.random());
    const exp = `Since it is not ${S1}, and the rule says if not ${S1}, it must be ${S2}. The second rule states people ${A2} when it is ${S2}. Therefore, they ${A2}.`;

    return formatEntry("Complex Logic - Deduction", question, options, options.indexOf(ans), exp);
};

// ---------- CODING-DECODING (REVERSE) ----------
const generateReverseCoding = () => {
    const words = ["GHOST", "FIGHT", "LIGHT", "BRAIN"];
    const word = words[Math.floor(Math.random() * words.length)];
    const reverse = word.split('').reverse().join('');

    const question = `In a certain code, 'DREAM' is written as 'MAERD'. How is '${word}' written in that code?`;
    const options = [reverse, word, reverse.toLowerCase(), reverse.slice(1)].sort(() => 0.5 - Math.random());
    return formatEntry("Coding-Decoding - Pattern", question, options, options.indexOf(reverse), "The logic is to reverse the string.");
};

const engines = [
    [generateSyllogism, 500],
    [generateLinear, 400],
    [generateCircular, 400],
    [generateBlood, 400],
    [generateSeries, 300],
    [generateCoding, 200],
    [generateComplexLogic, 200],
    [generateReverseCoding, 100]
];

for (const [engine, count] of engines) {
    for (let i = 0; i < count; i++) {
        dataset.push(engine());
    }
}

// Shuffle
dataset.sort(() => 0.5 - Math.random());

fs.writeFileSync('reasoning_dataset_2000.json', JSON.stringify(dataset, null, 2));
console.log(`${dataset.length} entries generated successfully in reasoning_dataset_2000.json with explanations.`);
