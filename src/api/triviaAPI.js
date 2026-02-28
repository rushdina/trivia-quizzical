const BASE_URL = "https://opentdb.com";

// Fetch new session token (to prevent duplicate questions)
export async function fetchToken() {
  const tokenRes = await fetch(`${BASE_URL}/api_token.php?command=request`); // request = new token

  if (!tokenRes.ok) {
    throw new Error(`Failed to get token: ${tokenRes.status}`);
  }

  const tokenData = await tokenRes.json();
  console.log("Token data:", tokenData);
  /*
    {
      response_code: 0,
      response_message: "Token Generated Successfully!",
      token: "ed2f..."
    }
 */
  return tokenData.token;
}

// Reset session token if all questions used
export async function resetToken(token) {
  await fetch(`${BASE_URL}/api.php?command=reset&token=${token}`);
} // reset = same token refreshed, making all questions available again

// Fetch 5 multiple choice questions from any categories (mixed) with token
export async function fetchQuestions(token) {
  const questionsRes = await fetch(
    `${BASE_URL}/api.php?amount=5&type=multiple&token=${token}`,
  );

  if (!questionsRes.ok) {
    throw new Error(`Failed to fetch questions: ${questionsRes.status}`);
  }

  const questionsData = await questionsRes.json();
  console.log("Questions Data:", questionsData);
  /* 
    {
      response_code: 0,
      results: [
        {
          type: "multiple",
          difficulty: "hard",
          category: "Art",
          question: "",
          correct_answer: "",
          incorrect_answers: ["", "", ""],
        },
        {},
      ];
    }
 */

  return questionsData;
}
