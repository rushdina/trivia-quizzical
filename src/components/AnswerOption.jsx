export default function AnswerOption({
  answerObj,
  questionObj,
  checkedAns,
  handleSelectAnswer,
}) {
  // Checked answer class for styling correct and incorrect answer
  function getCheckedAnswerClass() {
    if (!checkedAns) return ""; // no coloring before checking

    if (answerObj.isCorrect) return "correct-answer";
    if (questionObj.selectedAnswerId === answerObj.id) return "wrong-selected";

    return ""; // all other unselected answers stay neutral
  }

  return (
    <>
      <label
        key={answerObj.id}
        className={`answer-label ${getCheckedAnswerClass()}`}
      >
        <input
          type="radio"
          name={questionObj.id}
          value={answerObj.text}
          checked={questionObj.selectedAnswerId === answerObj.id}
          onChange={() => handleSelectAnswer(questionObj.id, answerObj.id)}
          disabled={checkedAns}
        />
        <span>{answerObj.text}</span>
      </label>
    </>
  );
}
