import "./Start.css";

export default function Start({ goToQuestions }) {
  return (
    <>
      <div className="start-wrapper">
        <h1>Quizzical</h1>
        <p>
          Trivia, fun and challenges, all in one quiz! How many questions can
          you get right?
        </p>
        <button onClick={goToQuestions}>Start quiz</button>
      </div>
    </>
  );
}
