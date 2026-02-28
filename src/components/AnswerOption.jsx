export default function AnswerOption({
  answerId,
  answerIsCorrect,
  answerText,
  questionId,
  questionSelectedAnswerId,
  checkedAns,
  handleSelectAnswer,
}) {
  // Checked answer class for styling correct and incorrect answer
  function getCheckedAnswerClass() {
    if (!checkedAns) return ""; // no coloring before checking

    if (answerIsCorrect) return "correct-answer";
    if (questionSelectedAnswerId === answerId) return "wrong-selected";

    return ""; // all other unselected answers stay neutral
  }

  return (
    <>
      <label className={`answer-label ${getCheckedAnswerClass()}`}>
        <input
          type="radio"
          name={questionId}
          value={answerText}
          checked={questionSelectedAnswerId === answerId}
          onChange={() => handleSelectAnswer(questionId, answerId)}
          disabled={checkedAns}
        />
        <span>{answerText}</span>
      </label>
    </>
  );
}
