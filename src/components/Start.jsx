export default function Start({ goToQuestions }) {
  return (
    <>
      <div>
        <p>
          Trivia, fun and challenges, all in one quiz! How many questions can
          you get right?
        </p>
        <button onClick={goToQuestions}>Start quiz</button>
      </div>
    </>
  );
}
