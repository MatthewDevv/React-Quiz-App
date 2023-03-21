import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import Question from "./components/Question/Question";
import Menu from "./components/Menu/Menu";
import { decode } from "html-entities";

function App() {
  const topRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [quizData, setQuizData] = useState({
    questionsNumber: 10,
    category: "Any Category",
    categoryId: 0,
    difficulty: "Any difficulty",
    type: "Any type",
    url: "https://opentdb.com/api.php?amount=10",
  });
  const [correctCount, setCorrectCount] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isResetQuiz, setIsResetQuiz] = useState(false);
  const [isMenu, setIsMenu] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  const questionsElements = questions.map((q, i) => {
    const decodedIncorrect = q.incorrect_answers.map((incorrect) =>
      decode(incorrect)
    );
    const questionDecoded = decode(q.question);

    return (
      <Question
        key={questionDecoded}
        question={i + 1 + ". " + questionDecoded}
        correct={decode(q.correct_answer)}
        incorrect={decodedIncorrect}
        setCorrectCount={setCorrectCount}
        isResetQuiz={isResetQuiz}
        isEnd={isEnd}
      />
    );
  });

  async function getQuizData() {
    const res = await fetch(quizData.url);
    const data = await res.json();
    setQuestions(data.results);
  }

  useEffect(() => {
    if (!isMenu) {
      getQuizData(quizData.quizUrl);
      if (!dataReady)
        setTimeout(() => {
          setDataReady((prev) => !prev);
        }, 1000);
    }
  }, [isResetQuiz, isMenu]);

  function toggleQuiz() {
    if (isEnd) {
      setIsResetQuiz((prev) => !prev);
      setCorrectCount(0);
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsEnd((prev) => !prev);
  }

  function backToMenu() {
    setIsResetQuiz((prev) => !prev);
    if (isEnd) setIsEnd((prev) => !prev);
    setIsMenu(true);
    setDataReady((prev) => !prev);
  }

  return (
    <main ref={topRef}>
      {!dataReady && !isMenu && <div className="loader"></div>}
      {isMenu && (
        <Menu
          quizData={quizData}
          setQuizData={setQuizData}
          setIsMenu={setIsMenu}
        />
      )}
      {dataReady && (
        <div>
          <div className="quiz-header">
            <button className="btn-action" onClick={backToMenu}>
              Back to Menu
            </button>
            <h1 className="quiz-title">Category: {quizData.category}</h1>
          </div>
          {questionsElements}
          <div className="summary">
            {isEnd && (
              <h4 className="score">
                You scored {correctCount}/{questions.length} correct answers
              </h4>
            )}
            <button className="btn-action" onClick={toggleQuiz}>
              {isEnd ? "Play again" : "Check answers"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
