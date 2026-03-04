export const saveQuizToLocal = (quiz) => {
  try {
    localStorage.setItem('lastQuiz', JSON.stringify(quiz));
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu quiz:', error);
    return false;
  }
};
export const loadQuizFromLocal = () => {
  try {
    const saved = localStorage.getItem('lastQuiz');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Lỗi khi đọc quiz:', error);
    return null;
  }
};