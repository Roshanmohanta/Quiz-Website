interface Question {
  id: number;
  section: 'science' | 'commerce' | 'arts';
  question: string;
  options: string[];
  correctAnswer: number;
}

export const questions: Question[] = [
  // Science Questions
  {
    id: 1,
    section: 'science',
    question: 'What is the chemical symbol for Gold?',
    options: ['Au', 'Ag', 'Fe', 'Cu'],
    correctAnswer: 0
  },
  {
    id: 2,
    section: 'science',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1
  },
  {
    id: 3,
    section: 'science',
    question: 'What is the unit of electrical resistance?',
    options: ['Watt', 'Ohm', 'Volt', 'Ampere'],
    correctAnswer: 1
  },
  // Commerce Questions
  {
    id: 4,
    section: 'commerce',
    question: 'What is the full form of GDP?',
    options: [
      'Gross Domestic Product',
      'General Domestic Product',
      'Gross Domestic Profit',
      'General Domestic Profit'
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    section: 'commerce',
    question: 'Which document is issued by a seller to a buyer?',
    options: ['Invoice', 'Receipt', 'Voucher', 'Bill'],
    correctAnswer: 0
  },
  {
    id: 6,
    section: 'commerce',
    question: 'What type of market deals with long-term securities?',
    options: ['Money Market', 'Capital Market', 'Commodity Market', 'Forex Market'],
    correctAnswer: 1
  },
  // Arts Questions
  {
    id: 7,
    section: 'arts',
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
    correctAnswer: 1
  },
  {
    id: 8,
    section: 'arts',
    question: 'Which of these is a play by William Shakespeare?',
    options: ['Pride and Prejudice', 'Macbeth', 'The Catcher in the Rye', 'The Great Gatsby'],
    correctAnswer: 1
  },
  {
    id: 9,
    section: 'arts',
    question: 'What is the main language of classical Indian literature?',
    options: ['Hindi', 'Tamil', 'Sanskrit', 'Bengali'],
    correctAnswer: 2
  }
];