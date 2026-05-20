/**
 * Returns pronoun set for the given pronouns string.
 * @param {string} pronouns - e.g. 'he/him', 'she/her', 'they/them', or custom
 * @returns {{ subject: string, possessive: string, object: string }}
 */
function getPronouns(pronouns) {
  switch (pronouns) {
    case 'he/him':
      return { subject: 'he', possessive: 'his', object: 'him' };
    case 'she/her':
      return { subject: 'she', possessive: 'her', object: 'her' };
    case 'they/them':
    default:
      return { subject: 'they', possessive: 'their', object: 'them' };
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a progress report narrative paragraph from structured responses.
 *
 * @param {Object} student - { name: string, pronouns: string }
 * @param {Object} goal - { name: string, area: string, description: string }
 * @param {Object} responses - answers to the workflow questions
 * @param {'professional'|'parent-friendly'} mode
 * @returns {string}
 */
export function generateNarrative(student, goal, responses, mode = 'professional') {
  const p = getPronouns(student.pronouns);
  const name = student.name;
  const goalArea = goal.area || goal.name;
  const goalName = goal.name;

  const {
    currentPerformance,
    progressSinceLast,
    supportsAccommodations,
    promptingLevel,
    accuracyPercentage,
    behavioralConcerns,
    nextSteps,
  } = responses;

  if (mode === 'parent-friendly') {
    let narrative = `${name} is working on ${goalName} in the area of ${goalArea}. `;
    narrative += `Right now, ${p.subject} ${currentPerformance.trim()}. `;
    narrative += `Since the last reporting period, ${p.subject} ${progressSinceLast.trim()}. `;
    narrative += `To help ${p.object} succeed, ${p.possessive} teachers have been using ${supportsAccommodations.trim()}. `;
    narrative += `${capitalize(p.subject)} is working ${promptingLevel.toLowerCase()}. `;
    if (accuracyPercentage && accuracyPercentage.trim()) {
      narrative += `${name} is performing at ${accuracyPercentage.trim()}. `;
    }
    if (behavioralConcerns && behavioralConcerns.trim()) {
      narrative += `It is worth noting that ${behavioralConcerns.trim()}. `;
    }
    narrative += `Next, we will be focusing on ${nextSteps.trim()}.`;
    return narrative;
  }

  // Professional mode
  let narrative = `${name} is currently working on the goal of ${goalName} within the ${goalArea} domain. `;
  narrative += `At this time, ${p.subject} ${currentPerformance.trim()}. `;
  narrative += `Over the course of this reporting period, ${p.subject} ${progressSinceLast.trim()}. `;
  narrative += `The following supports and accommodations have been implemented to facilitate ${p.possessive} progress: ${supportsAccommodations.trim()}. `;
  narrative += `${name} is demonstrating skills ${promptingLevel.toLowerCase()}. `;
  if (accuracyPercentage && accuracyPercentage.trim()) {
    narrative += `Current data indicates performance at ${accuracyPercentage.trim()}. `;
  }
  if (behavioralConcerns && behavioralConcerns.trim()) {
    narrative += `It should be noted that ${behavioralConcerns.trim()}. `;
  }
  narrative += `Instructional focus for the next reporting period will target ${nextSteps.trim()}.`;
  return narrative;
}
