import React, { useEffect, useState } from "react";
import "./Question.scss";

export default function Question(props) {
  const answersCount = 1 + props.incorrect.length;

  const [answerInfo, setAnswerInfo] = useState({
    selected: "",
    isCorrect: false,
  });
  const [answersPositions, setAnswersPositions] = useState(
    getAnswerPositions()
  );

  function getAnswerPositions() {
    if (answersCount === 2) return [0, 1];
    else {
      let randomPositions = new Set();
      while (randomPositions.size < answersCount)
        randomPositions.add(Math.floor(Math.random() * answersCount));
      return [...randomPositions];
    }
  }

  function getAnswerClassList(answer) {
    let answerClassList = "answer";
    if (answer === answerInfo.selected) answerClassList = "answer selected";
    if (props.isEnd && answer === props.correct && answerInfo.selected !== "")
      answerClassList = "answer correct";
    if (props.isEnd && answer === props.correct && answerInfo.selected === "")
      answerClassList = "answer wrong";
    if (
      props.isEnd &&
      answerInfo.selected !== props.correct &&
      answerInfo.selected === answer
    )
      answerClassList = "answer wrong";

    return answerClassList;
  }

  function createAnswersElements() {
    // True / false type
    let trueText, falseText;

    if (answersCount === 2) {
      if (props.correct === "True") {
        trueText = props.correct;
        falseText = props.incorrect[0];
      } else {
        trueText = props.incorrect[0];
        falseText = props.correct;
      }
    }
    //

    let answersElements = [];
    for (let i = 0; i < answersCount; i++) {
      let answer;
      if (answersCount > 2)
        i === 0 ? (answer = props.correct) : (answer = props.incorrect[i - 1]);
      else
        i === 0 && answersCount === 2
          ? (answer = trueText)
          : (answer = falseText);

      answersElements[answersPositions[i]] = (
        <button
          key={answer}
          className={getAnswerClassList(answer)}
          onClick={(e) => selectAnswer(e)}
          disabled={props.isEnd}
        >
          {answer}
        </button>
      );
    }
    return answersElements;
  }

  function selectAnswer(e) {
    const selectedAnswer = e.target.textContent;
    if (selectedAnswer === props.correct) {
      props.setCorrectCount((prevCount) => prevCount + 1);
      setAnswerInfo({ selected: selectedAnswer, isCorrect: true });
    } else {
      props.setCorrectCount((prevCount) =>
        prevCount > 0 && answerInfo.isCorrect ? prevCount - 1 : prevCount
      );
      setAnswerInfo({ selected: selectedAnswer, isCorrect: false });
    }
  }

  useEffect(() => {
    setAnswerInfo({
      selected: "",
      isCorrect: false,
    });
  }, [props.isResetQuiz]);

  const answers = createAnswersElements();

  return (
    <div>
      <h3 className="question">{props.question}</h3>
      <div
        className={`answers-container ${
          answersCount === 2 ? "answers-container-2" : ""
        }`}
      >
        {answers}
      </div>
    </div>
  );
}
