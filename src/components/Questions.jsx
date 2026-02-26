import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

export default function Questions({ goToStart }) {
  const [token, setToken] = useState();
  const [checked] = useState(false);
  const [questions, setQuestions] = useState([]);

  // 1. Fetch session token ONCE on load (to prevent duplicate questions)
  useEffect(() => {
    async function fetchToken() {
      try {
        const tokenRes = await fetch(
          "https://opentdb.com/api_token.php?command=request",
        ); // request = new token

        if (!tokenRes) {
          throw new Error(`Failed to get token: ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json(); // parse json str to js obj
        console.log(tokenData);
        /*
         {
           response_code: 0,
           response_message: "Token Generated Successfully!",
           token: "ed2f..."
         }
        */
        setToken(tokenData.token); // string
      } catch (error) {
        console.error(error);
      }
    }

    fetchToken();
  }, []);

  // 2. Fetch 5 multiple choice questions from any categories (mixed) with SAME token
  useEffect(() => {
    if (!token) return; // exit func
    async function fetchQuestions() {
      try {
        const questionRes = await fetch(
          `https://opentdb.com/api.php?amount=5&type=multiple&token=${token}`,
        );

        if (!questionRes.ok) {
          throw new Error(`Failed to fetch questions: ${questionRes.status}`);
        }

        const questionData = await questionRes.json();

        // Reset session token that has returned all questions because token empty
        if (questionData.response_code === 4) {
          await fetch(
            `https://opentdb.com/api.php?command=reset&token=${token}`,
          ); // reset = same token, all questions refreshed to fetch them again
          return fetchQuestions();
        }

        console.log(questionData);
        /* 
        {
          response_code: 0,
          results: [
            {
              type: "multiple",
              difficulty: "hard",
              category: "Art",
              question: "",
              correct_answer: "",
              incorrect_answers: ["", "", ""],
            },
            {},
          ];
        }
        */

        // Need to format each question obj into quiz format
        const formattedQuestionsArr = questionData.results.map(
          (questionObj) => {
            formatQuestionObj(questionObj);
          },
        );
        console.log(formattedQuestionsArr);
        setQuestions(formattedQuestionsArr);

        // setQuestions(formattedQuestions);
      } catch (error) {
        console.error(error);
      }
    }

    fetchQuestions();
  }, [token]);

  // Convert individual question obj from API into quiz format
  function formatQuestionObj(questionObj) {
    // All answers in array
    const answersArr = [
      { id: nanoid(), text: questionObj.correct_answer, isCorrect: true },
      ...questionObj.incorrect_answers.map((incorrectAnswer) => {
        return { id: nanoid(), text: incorrectAnswer, isCorrect: false };
      }), // .map return new array which becomes nested array, then spread operator expands array items which flattens answersArr
    ];

    /*
  answersArr: [
    { id: "", text: "", isCorrect: true },
    { id: "", text: "", isCorrect: false },
    { id: "", text: "", isCorrect: false },
    { id: "", text: "", isCorrect: false },
  ]
    */

    // Fisher-Yates shuffle for answersArr
    for (let i = answersArr.length - 1; i > 0; i--) {
      // start shuffling from last index, stop at index 1, no need to swap index 0 as it's been swapped by the time i=1.
      const j = Math.floor(Math.random() * (i + 1)); // Math.random to multiply (i+1) to include last index
      [answersArr[i], answersArr[j]] = [answersArr[j], answersArr[i]]; // array destructuring swap
    }

    const formattedQuestionObj = {
      id: nanoid(),
      question: questionObj.question,
      answers: answersArr, // shuffled answers
      selectedAnswer: null,
    };

    return formattedQuestionObj;
  }

  // onChange user selecting answer
  function handleSelectAnswer(questionId, answerText) {
    if (checked) return;

    setQuestions((prevArr) => {
      prevArr.map((questionObj) => {
        questionObj.id === questionId
          ? { ...questionObj, selectedAnswer: answerText }
          : questionObj;
      }); // update value
    });
  }

  return (
    <>
      <section>
        <div className="question-block">
          {questions.map((questionObj) => {
            return (
              <div key={questionObj.id} className="question-block">
                <h2>{questionObj.question}</h2>
                <div className="answers">
                  {questionObj.answers.map((answer) => {
                    return (
                      <label key={answer.id}>
                        <input
                          type="radio"
                          name={questionObj.id}
                          value={answer.text}
                          checked={questionObj.selectedAnswer === answer.text}
                          onChange={() =>
                            handleSelectAnswer(questionObj.id, answer.text)
                          }
                          disabled={checked}
                        />
                        <span className="answer-btn">{answer.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="controls">
          <button>{checked ? "Check answers" : "Play again"}</button>
          {checked && <p>You scored 3/{questions.length}!</p>}
          <button onClick={goToStart}>Home</button>
        </div>
      </section>
    </>
  );
}
