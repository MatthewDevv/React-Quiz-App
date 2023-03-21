import React, { useEffect, useState } from "react";
import "./Menu.scss";

export default function Menu(props) {
  const [categories, setCategories] = useState([]);

  async function getCategoriesData() {
    const res = await fetch("https://opentdb.com/api_category.php");
    const data = await res.json();
    setCategories(data.trivia_categories);
  }

  useEffect(() => {
    getCategoriesData();
  }, []);

  const categoriesOptions = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  function handleChange(e) {
    const { name, value, options, selectedIndex } = e.target;

    props.setQuizData((prevQuizData) => ({
      ...prevQuizData,
      [name]: value,
      category:
        name === "categoryId"
          ? options[selectedIndex].textContent
          : prevQuizData.category,
    }));
  }

  function startQuiz() {
    const { questionsNumber, categoryId, difficulty, type } = props.quizData;
    const categoryUrl = categoryId !== 0 ? `&category=${categoryId}` : "";
    const difficultyUrl =
      difficulty !== "Any difficulty" ? `&difficulty=${difficulty}` : "";
    const typeUrl = type !== "Any type" ? `&type=${type}` : "";

    const url =
      "https://opentdb.com/api.php?amount=" +
      questionsNumber +
      categoryUrl +
      difficultyUrl +
      typeUrl;

    props.setQuizData((prevQuizData) => ({ ...prevQuizData, url: url }));
    props.setIsMenu(false);
  }

  return (
    <section className="quiz-menu">
      <h1 className="quiz-menu-header">Quizzical</h1>
      <p className="quiz-menu-desc">
        Change options below to customize your quiz and press start to generate
        questions
      </p>
      <form>
        <div className="form-group">
          <label htmlFor="questionsNumber">Number of Questions:</label>
          <input
            type="text"
            name="questionsNumber"
            onChange={handleChange}
            value={props.quizData.questionsNumber}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Select Category:</label>
          <select
            name="categoryId"
            onChange={handleChange}
            value={props.quizData.categoryId}
          >
            <option value={0}>Any Category</option>
            {/* Categories from api */}
            {categoriesOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Select Difficulty:</label>
          <select
            name="difficulty"
            onChange={handleChange}
            value={props.quizData.difficulty}
          >
            <option value="Any Diffuculty">Any Diffuculty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="type">Select Type:</label>
          <select
            name="type"
            onChange={handleChange}
            value={props.quizData.type}
          >
            <option value="">Any Type</option>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </div>
      </form>
      <button className="btn-action" onClick={startQuiz}>
        START
      </button>
    </section>
  );
}
