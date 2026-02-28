import { nanoid } from "nanoid";
import he from "he";

// Format individual question obj from API into quiz format + shuffle answer
export function formatQuestionObj(questionObj) {
  // All answers in array
  const answersArr = [
    {
      id: nanoid(),
      text: he.decode(questionObj.correct_answer),
      isCorrect: true,
    },
    ...questionObj.incorrect_answers.map((incorrectAns) => {
      return {
        id: nanoid(),
        text: he.decode(incorrectAns),
        isCorrect: false,
      };
    }),
  ];

  /*
  answersArr: [
    { id: "...", text: "...", isCorrect: true },
    { id: "...", text: "...", isCorrect: false },
    { id: "...", text: "...", isCorrect: false },
    { id: "...", text: "...", isCorrect: false },
  ]
  */

  // Fisher-Yates shuffle for answersArr
  for (let i = answersArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answersArr[i], answersArr[j]] = [answersArr[j], answersArr[i]];
  }

  const formattedQuestionObj = {
    id: nanoid(),
    question: he.decode(questionObj.question),
    answers: answersArr, // shuffled answers
    selectedAnswerId: null,
  };

  return formattedQuestionObj;

  /*
    {
      id: "nanoid",
      question: "What is 2+2?",
      answers: [
        { id: "a1", text: "3", isCorrect: false },
        { id: "a2", text: "4", isCorrect: true },
        { id: "a3", text: "2", isCorrect: false },
        { id: "a4", text: "1", isCorrect: false },
      ],
      selectedAnswerId: "a2"
    }
 */
}
