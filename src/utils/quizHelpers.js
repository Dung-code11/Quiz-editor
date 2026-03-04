export const validateQuiz = (quiz) => {
  const errors = [];
  
  if (!quiz.name?.trim()) {
    errors.push('Tên quiz không được để trống');
  }
  
  if (quiz.questions.length === 0) {
    errors.push('Quiz phải có ít nhất 1 câu hỏi');
  }
  
  quiz.questions.forEach((question, qIndex) => {
    if (!question.name?.trim()) {
      errors.push(`Câu hỏi ${qIndex + 1}: Tiêu đề không được để trống`);
    }
    
    if (question.options.length < 2) {
      errors.push(`Câu hỏi ${qIndex + 1}: Cần ít nhất 2 lựa chọn`);
    }
    
    if (question.correctOptions.length === 0) {
      errors.push(`Câu hỏi ${qIndex + 1}: Cần ít nhất 1 đáp án đúng`);
    }
  });
  
  return errors;
};

export const generateSampleQuiz = () => {
  return {
    name: 'Quiz mẫu',
    description: 'Đây là quiz mẫu được tạo tự động',
    questions: [
      {
        id: Date.now(),
        name: 'Câu hỏi mẫu 1',
        description: 'Mô tả cho câu hỏi 1',
        sortOrder: 1,
        options: [
          { value: 'A', label: 'Lựa chọn A', sortOrder: 1 },
          { value: 'B', label: 'Lựa chọn B', sortOrder: 2 }
        ],
        correctOptions: ['A']
      }
    ]
  };
};