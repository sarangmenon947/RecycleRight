async function askChatbot(userQuestion) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userQuestion
      })
    });

    const data = await response.json();

    if (data.answer) {
      return data.answer;
    } else if (data.error) {
      console.error('API Error:', data.error);
      return 'Sorry, there was an error: ' + data.error;
    } else {
      return 'Sorry, I could not generate a response.';
    }
  } catch (error) {
    console.error('Error:', error);
    return 'Sorry, there was an error processing your question.';
  }
}
