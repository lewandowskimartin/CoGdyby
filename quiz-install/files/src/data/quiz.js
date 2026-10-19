// Preparedness quiz — single source of truth for questions, scoring bands and CTAs.
// Question order = display order. AREAS order = tie-break priority for "weakest area" and gaps.
// Points: option index 0, 1, 2. Score = total points × 5 (0–100).

export const QUIZ_PATH = '/household-preparedness-quiz';
export const RESULTS_PATH = '/household-preparedness-quiz/results';

// Flip `live` to true and add the Payhip URL once checkout exists.
export const PACK = {
  live: false,
  url: '',
  price: '£14.99',
  fallbackUrl: '/free-emergency-plan-template',
  fallbackLabel: 'Download the free fridge card',
};

// MailerLite embedded-form action URL, from the env var PUBLIC_MAILERLITE_ACTION or pasted here.
// Empty = the email step is hidden.
export const EMAIL_FORM = {
  action: import.meta.env?.PUBLIC_MAILERLITE_ACTION ?? '',
};

export const AREAS = [
  { id: 'plan', label: 'Your household plan' },
  { id: 'power', label: 'Power and utilities' },
  { id: 'supplies', label: 'Food and water' },
  { id: 'leaving', label: 'Leaving in a hurry' },
  { id: 'warnings', label: 'Warnings and neighbours' },
];

export const QUESTIONS = [
  {
    id: 'q1',
    area: 'plan',
    text: 'Does your household have a written plan, including where to meet if you can’t get home?',
    options: ['No', 'We’ve talked about it', 'Yes, it’s written down'],
    gap: 'No written household plan',
    fix: 'Agree a meeting point tonight and write it down, along with who calls whom.',
    packPage: 'Meeting point and household information pages',
  },
  {
    id: 'q2',
    area: 'plan',
    text: 'Are your important phone numbers written on paper, not only saved in a phone?',
    options: ['No', 'Some of them', 'Yes'],
    gap: 'Key numbers only in a phone',
    fix: 'Write five numbers on paper: family, a neighbour, your GP, your energy supplier and your insurer.',
    packPage: 'Emergency contacts page and fridge card',
  },
  {
    id: 'q3',
    area: 'supplies',
    text: 'Could your household eat for a few days without cooking?',
    options: ['No', 'Maybe for a day', 'Yes, for a few days'],
    gap: 'Not enough no-cook food',
    fix: 'Add three no-cook meals per person to your next shop, and check you have a tin opener.',
    packPage: 'Emergency kit checklist',
  },
  {
    id: 'q4',
    area: 'supplies',
    text: 'Do you keep bottled water at home?',
    options: ['None', 'Some', 'Enough for everyone for a few days'],
    gap: 'Little or no bottled water',
    fix: 'GOV.UK says there’s no standard figure, but suggests 2.5 to 3 litres of drinking water per person per day. Start with a few large bottles.',
    packPage: 'Emergency kit checklist',
  },
  {
    id: 'q5',
    area: 'power',
    text: 'Do you have a torch, spare batteries and a charged power bank you could find in the dark?',
    options: ['No', 'Some of these', 'Yes, all three'],
    gap: 'No torch or power bank ready',
    fix: 'Put a torch, spare batteries and a power bank in one drawer. Torches are safer than candles.',
    packPage: 'Emergency kit checklist',
  },
  {
    id: 'q6',
    area: 'power',
    text: 'Does someone in your household know how to turn off the water, gas and electricity?',
    options: ['No', 'One or two of them', 'All three'],
    gap: 'Unsure how to turn off water, gas or electricity',
    fix: 'This weekend, find your stopcock, gas meter valve and fuse box, and show everyone in your household.',
    packPage: 'Utility shut-offs page',
  },
  {
    id: 'q7',
    area: 'leaving',
    text: 'If you had to leave in 10 minutes, is there a grab bag ready?',
    options: ['No', 'Partly', 'Yes'],
    gap: 'No grab bag ready',
    fix: 'Start a grab bag by the door: torch, power bank, water, snacks, medication and copies of documents.',
    packPage: 'Grab bag checklist',
  },
  {
    id: 'q8',
    area: 'leaving',
    text: 'Could you grab passports, insurance details and other key documents quickly?',
    options: ['No', 'Some of them', 'Yes, they’re kept together'],
    gap: 'Documents scattered',
    fix: 'Put passports, birth certificates and insurance policies (or copies) in one folder near your plan.',
    packPage: 'Household information page',
  },
  {
    id: 'q9',
    area: 'warnings',
    text: 'Would you hear about a flood or emergency warning early?',
    options: ['Not sure', 'Only through phone alerts', 'Signed up to Floodline, or checked we’re not at risk'],
    gap: 'No early warnings set up',
    fix: 'Check your postcode and sign up to free flood warnings at gov.uk/sign-up-for-flood-warnings (England, Scotland and Wales).',
    packPage: null,
  },
  {
    id: 'q10',
    area: 'warnings',
    text: 'Have you agreed with a neighbour, friend or relative to check on each other?',
    options: ['No', 'Informally', 'Yes'],
    gap: 'No one agreed to check in on you',
    fix: 'Swap numbers with a neighbour and agree to check on each other if the power goes out.',
    packPage: 'Emergency contacts page',
  },
];

export const BANDS = [
  {
    id: 'starting',
    min: 0,
    label: 'Getting started',
    summary: 'Many households start here. Each step below is small, and they add up.',
    cta: 'The pack walks you through all of this, one page at a time.',
  },
  {
    id: 'partly',
    min: 40,
    label: 'Partly prepared',
    summary: 'You’ve covered some of the basics. The gaps below are quick to close.',
    cta: 'The pack helps you close these gaps and keep everything on paper.',
  },
  {
    id: 'well',
    min: 75,
    label: 'Well prepared',
    summary: 'You’ve covered most of the basics.',
    cta: 'You’ve done the hard part. Put it on paper so it’s there when the power’s out.',
  },
];

export const BENCHMARK = {
  text: 'In a 2026 UK government survey, 13% of people said their household was largely or totally prepared for an emergency.',
  url: 'https://www.gov.uk/government/statistics/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026/uk-public-survey-of-risk-perception-resilience-and-preparedness-2026-headline-findings-html',
};
