import AnswerOption from "./AnswerOption.jsx";

export default function QuestionCard({
  questionObj,
  checkedAns,
  handleSelectAnswer,
}) {
  return (
    <>
      <div key={questionObj.id} className="question-card">
        <h2>{questionObj.question}</h2>
        <div className="answers">
          {questionObj.answers.map((answerObj) => {
            return (
              <AnswerOption
                key={answerObj.id}
                answerObj={answerObj}
                questionObj={questionObj}
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
