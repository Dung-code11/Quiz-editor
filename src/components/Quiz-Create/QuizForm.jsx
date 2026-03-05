import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import QuestionList from './QuestionList';
import styles from '../../css/QuizForm.module.css';

const QuizForm = ({ quiz, onQuizChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    questions: []
  });

  useEffect(() => {
    if (quiz) {
      setFormData(quiz);
    }
  }, [quiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onQuizChange(newData);
  };

  const handleQuestionsChange = (questions) => {
    const newData = { ...formData, questions };
    setFormData(newData);
    onQuizChange(newData);
  };

  return (
    <div className={styles.quizForm}>
      <div className={styles.quizHeader}>
        <Info size={24} className={styles.headerIcon} />
        <h2>Thông tin Quiz</h2>
        <p>Điền thông tin cơ bản về quiz của bạn</p>
      </div>

      <div className={styles.basicInfo}>
        <div className={styles.formGroup}>
          <label htmlFor="quizName">
            Tên Quiz <span className={styles.required}>*</span>
          </label>
          <input
            id="quizName"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="VD: Kiến thức JavaScript cơ bản"
            required
          />
          <span className={styles.hint}>Đặt tên mô tả cho quiz của bạn</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quizDescription">Mô tả</label>
          <textarea
            id="quizDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả quiz này nói về gì..."
            rows="3"
          />
          <span className={styles.hint}>Không bắt buộc</span>
        </div>
      </div>

      <QuestionList 
        questions={formData.questions}
        onQuestionsChange={handleQuestionsChange}
      />
    </div>
  );
};

export default QuizForm;