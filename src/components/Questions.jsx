import { useState, useEffect, useCallback } from "react";
import QuestionCard from "./QuestionCard.jsx";
import { fetchToken, resetToken, fetchQuestions } from "../api/triviaAPI.js";
import { formatQuestionObj } from "../utils/formatQuestion.js";
import "./Questions.css";

export default function Questions({ goToStart }) {
  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState([]); // array of qns obj
  const [checkedAns, setCheckedAns] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch token and questions for quiz format
  const loadQuiz = useCallback(async () => {
    // Reset states when play again
    setLoading(true); // loading spinner while fetching
    setError(null); // clear old errors
    setCheckedAns(false);
    setScore(0);

    try {
      // Small delay to prevent rapid consecutive fetches
      await new Promise((resolve) => {
        console.log("Fetching questions...");
        setTimeout(resolve, 1500);
      }); // 1.5 second delay

      const questionsData = await fetchQuestions(token);

      // Token expired, request new session token
      if (questionsData.response_code === 3) {
        console.log("Token expired. Fetching new token...");
        const newToken = await fetchToken();
        setToken(newToken);
        return; // retry with new token, 2nd useEffect will re-run automatically
      }

      // Reset session token if all questions used (token empty) to fetch the questions again
      if (questionsData.response_code === 4) {
        console.log("All questions used. Resetting token...");
        await resetToken(token);
        return loadQuiz(); // retry with same token
      }

      // Need to format each question obj into quiz format
      const formattedQuestionsArr = questionsData.results.map((questionObj) => {
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
  }, [token]);

  // Fetch token once on mount
  useEffect(() => {
    async function initToken() {
      const newToken = await fetchToken();
      setToken(newToken);
    }

    initToken();
  }, []);

  // Fetch questions when token exists
  useEffect(() => {
    if (!token) return;
    loadQuiz();
  }, [token, loadQuiz]);

  // Handle onChange selecting an answer
  function handleSelectAnswer(questionId, answerId) {
    if (checkedAns) return;

    setQuestions((prevArr) => {
      return prevArr.map((questionObj) => {
        return questionObj.id === questionId
          ? { ...questionObj, selectedAnswerId: answerId }
          : questionObj;
      }); // update value
    });
  }

  // Check answers id with isCorrect boolean
  function checkAnswers() {
    let count = 0;

    questions.forEach((questionObj) => {
      const selected = questionObj.answers.find(
        (ans) => ans.id === questionObj.selectedAnswerId,
      ); // selected = { id: "a2", text: "4", isCorrect: true }

      // if selected exists, then check if selected.isCorrect is true, increment count
      if (selected?.isCorrect) count++;
    });

    setScore(count);
    setCheckedAns(true);
  }

  // Fetch new set of questions
  function playAgain() {
    loadQuiz();
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
          <button onClick={loadQuiz}>Retry</button>
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
              <QuestionCard
                key={questionObj.id}
                questionObj={questionObj}
                checkedAns={checkedAns}
                handleSelectAnswer={handleSelectAnswer}
              />
            );
          })}
        </div>
        <div className="controls">
          <button onClick={goToStart}>Home</button>
          {checkedAns && (
            <p>
              You scored {score}/{questions.length}!
            </p>
          )}
          {!checkedAns && (
            <button onClick={loadQuiz} disabled={loading}>
              New Questions
            </button>
          )}
          <button
            onClick={checkedAns ? playAgain : checkAnswers}
            disabled={
              !checkedAns &&
              !questions.every((questionObj) => questionObj.selectedAnswerId)
            }
          >
            {checkedAns ? "Play again" : "Check answers"}
          </button>
        </div>
      </section>
    </>
  );
}
