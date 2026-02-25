import { useState } from "react";
import Start from "./components/Start.jsx";
import Questions from "./components/Questions.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState("start");

  function goToQuestions() {
    setPage("questions");
  }

  function goToStart() {
    setPage("start");
  }

  return (
    <>
      <header
        className={page === "start" ? "header-start" : "header-questions"}
      >
        <h1>Quizzical</h1>
      </header>

      <main>
        {page === "start" && <Start goToQuestions={goToQuestions} />}
        {page === "questions" && <Questions goToStart={goToStart} />}
      </main>

      <footer>Scrimba Solo Project Quizzical</footer>
    </>
  );
}

export default App;
