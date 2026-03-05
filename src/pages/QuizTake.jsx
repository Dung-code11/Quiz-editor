import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdQuiz,
  MdArrowBack,
  MdCheckCircle,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdNavigateNext,
  MdNavigateBefore,
  MdFlag,
} from "react-icons/md";
import ProgressBar from "../components/Quiz-Answer/ProgressBar";
import styles from "../css/QuizTake.module.css";

const QuizTake = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem("currentQuiz");
    if (savedQuiz) {
      const parsedQuiz = JSON.parse(savedQuiz);
      setQuiz(parsedQuiz);
      setTimeLeft(parsedQuiz.questions.length * 30);
    } else {
      try {
        const savedQuizzes = JSON.parse(
          localStorage.getItem("savedQuizzes") || "[]",
        );
        const foundQuiz = savedQuizzes.find((q) => q.id.toString() === id);
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setTimeLeft(foundQuiz.questions.length * 30);
        }
      } catch (error) {
        console.error("Lỗi khi load quiz:", error);
      }
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleAnswer = (questionId, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    if (!isFinished) {
      setIsFinished(true);
      const results = calculateResults();
      sessionStorage.setItem(
        "quizResults",
        JSON.stringify({
          quizId: quiz.id,
          quizName: quiz.name,
          answers,
          results,
          timeSpent: quiz.questions.length * 30 - timeLeft,
        }),
      );
      navigate(`/quiz/result/${quiz.id}`);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer && question.correctOptions.includes(userAnswer)) {
        correct++;
      }
    });
    return {
      total: quiz.questions.length,
      correct,
      wrong: quiz.questions.length - correct,
      score: Math.round((correct / quiz.questions.length) * 100),
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quiz) {
    return (
      <div className={styles.loading}>
        <MdQuiz size={48} className={styles.loadingIcon} />
        <p>Đang tải quiz...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isFlagged = flaggedQuestions.has(currentQuestion.id);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <MdArrowBack size={24} />
        </button>
        <div className={styles.headerInfo}>
          <h1>{quiz.name}</h1>
          <ProgressBar progress={progress} />
        </div>
        <div className={styles.timer}>
          <span
            className={`${styles.time} ${timeLeft < 60 ? styles.warning : ""}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className={styles.questionArea}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>
            Câu hỏi {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
          <button
            onClick={() => handleFlagQuestion(currentQuestion.id)}
            className={`${styles.flagBtn} ${isFlagged ? styles.flagged : ""}`}
          >
            <MdFlag size={20} />
            {isFlagged ? "Đã đánh dấu" : "Đánh dấu"}
          </button>
        </div>

        <h2 className={styles.questionTitle}>{currentQuestion.name}</h2>

        {currentQuestion.description && (
          <p className={styles.questionDescription}>
            {currentQuestion.description}
          </p>
        )}

        <div className={styles.options}>
          {currentQuestion.options
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`${styles.optionBtn} ${isSelected ? styles.selected : ""}`}
                >
                  <span className={styles.optionValue}>{option.value}.</span>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {isSelected ? (
                    <MdRadioButtonChecked
                      size={20}
                      className={styles.checkedIcon}
                    />
                  ) : (
                    <MdRadioButtonUnchecked
                      size={20}
                      className={styles.uncheckedIcon}
                    />
                  )}
                </button>
              );
            })}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.navigation}>
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={styles.navBtn}
          >
            <MdNavigateBefore size={24} />
            Câu trước
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className={styles.navBtn}
          >
            Câu sau
            <MdNavigateNext size={24} />
          </button>
        </div>

        <button onClick={handleFinishQuiz} className={styles.finishBtn}>
          <MdCheckCircle size={20} />
          Nộp bài
        </button>
      </div>

      <div className={styles.questionNavigator}>
        {quiz.questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isFlagged = flaggedQuestions.has(q.id);
          const isCurrent = idx === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`${styles.navDot} ${isCurrent ? styles.current : ""} 
                ${isAnswered ? styles.answered : ""} ${isFlagged ? styles.flagged : ""}`}
              title={`Câu ${idx + 1}${isFlagged ? " - Đã đánh dấu" : ""}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTake;
