# ❓ Trivia Quiz App

A multiple-choice quiz app that fetches multiple-choice questions from the `Open Trivia Database API`, allowing users to select answers, check their score, and play multiple rounds without repeating questions. Answers are shuffled, correct and incorrect selections are highlighted, and the app handles token expiration for a smooth quiz experience.

## 🌐 Live Demo
🔗 View app: https://trivia-quiz-rushdina.vercel.app/ 

![Quizzical Start Page Preview](./src/assets/preview/preview-quizzical-start.png)
![Quizzical Questions Page Preview](./src/assets/preview/preview-quizzical-questions.png)
![Quizzical Checked Answers Page Preview](./src/assets/preview/preview-quizzical-checkedAnswers.png)

## 🛠️ Technologies Used

- **Frontend:** `React`, `Vite`, `JavaScript`, `CSS`
- **External APIs:** [Trivia API](https://opentdb.com/api_config.php) – Retrieve questions data
- **npm Packages:**
  - [nanoid](https://www.npmjs.com/package/nanoid) – Generates unique IDs for questions and answers
  - [he](https://www.npmjs.com/package/he#hedecodehtml-options) (HTML Entities) – Decodes HTML entities from API responses (e.g: `&quot;` → `"`)

## ✨ Features

- Fetches random multiple-choice mixed-category questions from the `Open Trivia Database API`
- Shuffles answer options are randomized to make each quiz unique
- Calculates and displays user score after checking answers
- Handles session tokens to avoid duplicate questions and expired tokens
- Reset and play a new set of questions anytime
- Responsive, user-friendly UI with loading state and error handling
- Decodes HTML entities in questions and answers using the `he` package

## ⚡ How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/<username>/<repository>.git
cd <repository>
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. Open the **Localhost URL** (`http://localhost:5173`) shown in your terminal.

## 🚀 Usage

1. Click **Start Quiz**
2. Select one answer for each question
3. Click **Check Answers**
4. View your score
5. Click **Play Again** to fetch new questions

## 🧠 Challenges Encountered

- **API Tokens & Rate Limits**: Empty/expired tokens and rapid requests caused errors (`429`).
  - Solution: Automatically fetched a new token, reset after all questions are used, and added a 1-second delay between requests.
- **State Management**: Avoided unnecessary re-renders and stale values with multiple state variables.
  - Solution: Structured `useEffect` with proper dependencies and passed token explicitly to async fetches.
- **Shuffling and Formatting Questions**: API responses needed consistent formatting, and answers had to be shuffled.
  - Solution: Created a reusable function with `Fisher-Yates shuffle` to format questions.
- **Check Answers**: Verify selected answers against correct ones.
  - Solution: Iterates through all questions, finds the selected answer object, and checks its `isCorrect` property to calculate the score.
- **Refactor**: `Questions.jsx` handled too many responsibilities. Hard to maintain.
  - Solution: Split logic into `api`, `utils`, and reusable UI components.

## 📚 What I Learned

- Managing multiple React states and async operations
- Managing API tokens, rate limits, and error recovery
- Formatting and shuffling API data for dynamic UI updates
- Handling user interactions like “Check Answers” reliably
- Structuring React components for readability and reusability

## 💡 Future Improvements

- Difficulty and category filters
- Timer mode

## 🙌 Acknowledgements

- Solo project from [Scrimba Frontend Developer Career Path](https://scrimba.com/frontend-path-c0j)
- Design reference from [Figma by Scrimba](https://www.figma.com/design/E9S5iPcm10f0RIHK8mCqKL/Quizzical-App?node-id=8-448&t=1PTwhDp6TAwDlrhX-0)
