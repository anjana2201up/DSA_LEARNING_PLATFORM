// scripts/generate-extra.js
// Validation script to ensure all problems in problems-extra.js match the required schema.

const { PROBLEMS_EXTRA } = require('../data/problems-extra');

function validateProblems() {
  console.log(`Validating ${PROBLEMS_EXTRA.length} problems in problems-extra.js...`);
  let errors = 0;

  PROBLEMS_EXTRA.forEach((problem, index) => {
    const requiredFields = ['id', 'title', 'difficulty', 'tags', 'description', 'examples', 'constraints', 'functionName', 'starterCode', 'testCases'];
    const missing = requiredFields.filter(f => !(f in problem));

    if (missing.length > 0) {
      console.error(`❌ Problem[${index}] ("${problem.id || 'unknown'}") is missing fields: ${missing.join(', ')}`);
      errors++;
    }

    if (problem.examples && !Array.isArray(problem.examples)) {
      console.error(`❌ Problem[${index}] has invalid examples (must be array)`);
      errors++;
    }

    if (problem.testCases && !Array.isArray(problem.testCases)) {
      console.error(`❌ Problem[${index}] has invalid testCases (must be array)`);
      errors++;
    }

    if (problem.starterCode && typeof problem.starterCode.javascript !== 'string') {
      console.error(`❌ Problem[${index}] is missing javascript starter code`);
      errors++;
    }
  });

  if (errors === 0) {
    console.log("✅ All problems passed validation.");
  } else {
    console.error(`\nFailed with ${errors} error(s).`);
    process.exit(1);
  }
}

validateProblems();
