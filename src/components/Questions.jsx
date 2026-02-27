import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import he from "he";
import "./Questions.css";

export default function Questions({ goToStart }) {
  const [token, setToken] = useState(null); // initilized null (no token yet)
  const [checked, setChecked] = useState(false);
  const [questions, setQuestions] = useState([]); // array of qns obj
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // null because currenty no error

  // 1. Fetch new session token (to prevent duplicate questions)
  const fetchToken = useCallback(async () => {
    setLoading(true); // show spinner while fetching token
    setError(null); // clear any previous errors

    try {
      const tokenRes = await fetch(
        "https://opentdb.com/api_token.php?command=request",
      ); // request = new token

      if (!tokenRes.ok) {
        throw new Error(`Failed to get token: ${tokenRes.status}`);
      }

      const tokenData = await tokenRes.json(); // parse json str to js obj
      console.log("Token data:", tokenData);
      /*
        {
          response_code: 0,
          response_message: "Token Generated Successfully!",
          token: "ed2f..."
        }
      */
      setToken(tokenData.token); // string
      return tokenData.token; // need to return to be used when code is 3
    } catch (error) {
      console.error(error);
      setError("Failed to get session token. Please try again.");
    } finally {
      setLoading(false); // spinner disappears even if error happens
    }
  }, []);

  // 2. Fetch 5 multiple choice questions from any categories (mixed) with SAME token
  const fetchQuestions = useCallback(async () => {
    // Reset states when play again
    setLoading(true); // loading spinner while fetching
    setError(null); // clear old errors
    setChecked(false);
    setScore(0);

    let activeToken = token;

    if (!activeToken) {
      activeToken = await fetchToken();
    } // ensure we have a token

    try {
      // Small delay to prevent rapid consecutive fetches
      await new Promise((resolve) => {
        console.log("Fetching questions...");
        setTimeout(resolve, 1500);
      }); // 1.5 second delay

      const questionRes = await fetch(
        `https://opentdb.com/api.php?amount=5&type=multiple&token=${activeToken}`,
      );

      if (!questionRes.ok) {
        throw new Error(
          `Failed to fetch questions! status: ${questionRes.status}`,
        );
      }

      const questionData = await questionRes.json();

      // Token expired, request new session token
      if (questionData.response_code === 3) {
        console.log("Token expired. Fetching new token...");
        await fetchToken(); // waits for new token (updates the state with setToken(), which fetchQuestions() uses.)
        return fetchQuestions(); // retry after new token
      }

      // Reset session token if all questions used (token empty) so we can fetch questions again
      if (questionData.response_code === 4) {
        console.log("All questions used. Resetting token...");
        await fetch(
          `https://opentdb.com/api.php?command=reset&token=${activeToken}`,
        ); // reset = same token refreshed, making all questions available again
        return fetchQuestions(); // fetch again with the same token
      }

      console.log("Questions Data:", questionData);
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
      const formattedQuestionsArr = questionData.results.map((questionObj) => {
        return formatQuestionObj(questionObj);
      });
      console.log("Formatted Questions:", formattedQuestionsArr);
      setQuestions(formattedQuestionsArr);

      // setQuestions(formattedQuestions);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again after a few seconds.");
    } finally {
      setLoading(false);
    }
  }, [token, fetchToken]);

  // On mount: fetch token
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Fetch questions after retrieving token
  useEffect(() => {
    if (!token) return; // exit func
    fetchQuestions();
  }, [token, fetchQuestions]);

  // Format individual question obj from API into quiz format + shuffle answer
  function formatQuestionObj(questionObj) {
    // All answers in array
    const answersArr = [
      {
        id: nanoid(),
        text: he.decode(questionObj.correct_answer),
        isCorrect: true,
      },
      ...questionObj.incorrect_answers.map((incorrectAnswer) => {
        return {
          id: nanoid(),
          text: he.decode(incorrectAnswer),
          isCorrect: false,
        };
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
      question: he.decode(questionObj.question),
      answers: answersArr, // shuffled answers
      selectedAnswer: null,
    };

    return formattedQuestionObj;

    /*
{
  id: "nanoid",
  question: "What is 2+2?",
  answers: [
    { id: "a1", text: "3", isCorrect: false },
    { id: "a2", text: "4", isCorrect: true },
    ...
  ],
  selectedAnswer: "a2"
}
    */
  }

  // Handle onChange selecting an answer
  function handleSelectAnswer(questionId, answerText) {
    if (checked) return;

    setQuestions((prevArr) => {
      return prevArr.map((questionObj) => {
        return questionObj.id === questionId
          ? { ...questionObj, selectedAnswer: answerText }
          : questionObj;
      }); // update value
    });
  }

  // Check answers text with isCorrect boolean
  function checkAnswers() {
    let count = 0;

    questions.forEach((questionObj) => {
      const selected = questionObj.answers.find(
        (a) => a.text === questionObj.selectedAnswer,
      ); // selected = { id: "a2", text: "4", isCorrect: true }

      // if selected exists, then check if selected.isCorrect is true, increment count
      if (selected?.isCorrect) count++;
    });

    setScore(count);
    setChecked(true);
  }

  // Fetch new set of questions
  function playAgain() {
    fetchQuestions();
  }

  // Answer class for checked styling
  function getCheckedAnswerClass(answer, question) {
    if (!checked) return ""; // no coloring before checking

    if (answer.isCorrect) return "correct-green"; // correct answers green
    if (question.selectedAnswer === answer.text) return "wrong-red"; // user's wrong choice red

    return ""; // all other unselected answers stay neutral
  }

  // Early returns
  if (loading) {
    return (
      <section>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchQuestions}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section>
        <div className="questions-container">
          {questions.map((questionObj) => {
            return (
              <div key={questionObj.id} className="question-block">
                <h2>{questionObj.question}</h2>
                <div className="answers">
                  {questionObj.answers.map((answerObj) => {
                    return (
                      <label
                        key={answerObj.id}
                        // className={`answer-label ${checked ? (answer.isCorrect ? "correct-green" : questionObj.selectedAnswer === answer.text ? "wrong" : "") : ""}`}
                        className={`answer-label ${getCheckedAnswerClass(answerObj, questionObj)}`}
                      >
                        <input
                          type="radio"
                          name={questionObj.id}
                          value={answerObj.text}
                          checked={
                            questionObj.selectedAnswer === answerObj.text
                          }
                          onChange={() =>
                            handleSelectAnswer(questionObj.id, answerObj.text)
                          }
                          disabled={checked}
                        />
                        <span>{answerObj.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="controls">
          <button onClick={goToStart}>Home</button>
          {checked && (
            <p>
              You scored {score}/{questions.length}!
            </p>
          )}
          {!checked && (
            <button onClick={fetchQuestions} disabled={loading}>
              New Questions
            </button>
          )}
          <button
            onClick={checked ? playAgain : checkAnswers}
            disabled={
              !checked &&
              !questions.every((question) => question.selectedAnswer)
            }
          >
            {checked ? "Play again" : "Check answers"}
          </button>
        </div>
      </section>
    </>
  );
}
