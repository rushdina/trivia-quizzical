import AnswerOption from "./AnswerOption.jsx";

export default function QuestionCard({
  questionObj,
  checkedAns,
  handleSelectAnswer,
}) {
  return (
    <>
      <div className="question-card">
        <h2>{questionObj.question}</h2>
        <div className="answers">
          {questionObj.answers.map((answerObj) => {
            return (
              <AnswerOption
                key={answerObj.id}
                answerId={answerObj.id}
                answerIsCorrect={answerObj.isCorrect}
                answerText={answerObj.text}
                questionId={questionObj.id}
                questionSelectedAnswerId={questionObj.selectedAnswerId}
                checkedAns={checkedAns}
                handleSelectAnswer={handleSelectAnswer}
              ></AnswerOption>
            );
          })}
        </div>
      </div>
    </>
  );
}
