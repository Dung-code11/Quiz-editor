import React from 'react';
import { MdAdd, MdHelp } from 'react-icons/md';
import QuestionItem from './QuestionItem';
import styles from '../../css/QuestionList.module.css';

const QuestionList = ({ questions, onQuestionsChange }) => {
  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
      name: '',
      description: '',
      sortOrder: questions.length + 1,
      options: [],
      correctOptions: []
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion) => {
    const updatedQuestions = questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (questionId) => {
    if (questions.length <= 1) {
      alert('Quiz phải có ít nhất 1 câu hỏi');
      return;
    }
    
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      const filteredQuestions = questions.filter(q => q.id !== questionId);
      const reorderedQuestions = filteredQuestions.map((q, index) => ({
        ...q,
        sortOrder: index + 1
      }));
      onQuestionsChange(reorderedQuestions);
    }
  };

  const moveQuestion = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    
    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      sortOrder: idx + 1
    }));
    
    onQuestionsChange(reorderedQuestions);
  };

  const duplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
      name: `${question.name} (Bản sao)`,
      sortOrder: questions.length + 1
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const sortedQuestions = [...questions].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={styles.questionList}>
      <div className={styles.header}>
        <div>
          <h3>Câu hỏi</h3>
          <p className={styles.count}>
            {questions.length} câu hỏi
          </p>
        </div>
        <button onClick={addQuestion} className={styles.addBtn}>
          <MdAdd size={18} />
          Thêm câu hỏi
        </button>
      </div>

      {questions.length === 0 ? (
        <div className={styles.emptyState}>
          <MdHelp size={64} className={styles.emptyIcon} />
          <h4>Chưa có câu hỏi nào</h4>
          <p>Nhấn nút "Thêm câu hỏi" để bắt đầu</p>
        </div>
      ) : (
        <div className={styles.container}>
          {sortedQuestions.map((question, index) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              totalQuestions={questions.length}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
              onMove={moveQuestion}
              onDuplicate={duplicateQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;