import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdQuiz,
  MdArrowBack,
  MdCheckCircle,
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdNavigateNext,
  MdNavigateBefore,
  MdFlag,
  MdSend,
  MdWarning,
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const isAutoAdvancing = useRef(false);
  const lastAnsweredQuestionId = useRef(null);

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
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      const currentQId = quiz.questions[currentQuestionIndex].id;

      const justAnswered =
        answers[currentQId] !== undefined &&
        lastAnsweredQuestionId.current !== currentQId;

      if (justAnswered && !isAutoAdvancing.current) {
        isAutoAdvancing.current = true;
        lastAnsweredQuestionId.current = currentQId;

        const timer = setTimeout(() => {
          setCurrentQuestionIndex((prev) => {
            isAutoAdvancing.current = false;
            return prev + 1;
          });
        }, 500);

        return () => {
          clearTimeout(timer);
          isAutoAdvancing.current = false;
        };
      }
    }
  }, [answers, currentQuestionIndex, quiz]);

  useEffect(() => {
    const answered = new Set();
    Object.keys(answers).forEach((qId) => {
      if (
        answers[qId] !== undefined &&
        (Array.isArray(answers[qId]) ? answers[qId].length > 0 : true)
      ) {
        answered.add(qId);
      }
    });
    setAnsweredQuestions(answered);
  }, [answers]);

  const handleAnswer = (questionId, optionValue, isMultipleChoice) => {
    if (isMultipleChoice) {
      // Xử lý checkbox (nhiều đáp án)
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        let newAnswers;

        if (currentAnswers.includes(optionValue)) {
          // Bỏ chọn nếu đã có
          newAnswers = currentAnswers.filter((v) => v !== optionValue);
        } else {
          // Thêm mới nếu chưa có
          newAnswers = [...currentAnswers, optionValue];
        }

        return {
          ...prev,
          [questionId]: newAnswers,
        };
      });
    } else {
      // Xử lý radio (một đáp án)
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionValue,
      }));
    }
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
    isAutoAdvancing.current = false;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    isAutoAdvancing.current = false;
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleAutoSubmit = () => {
    if (!isFinished) {
      setIsFinished(true);
      submitQuiz();
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  const handleSubmitQuiz = () => {
    setShowConfirmDialog(false);
    submitQuiz();
  };

  const submitQuiz = () => {
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
  };

  const calculateResults = () => {
    let correct = 0;
    let partialScore = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const isMultipleChoice = question.correctOptions.length > 1;

      if (isMultipleChoice) {
        // Tính điểm cho câu hỏi nhiều đáp án
        if (userAnswer && Array.isArray(userAnswer)) {
          const correctOptions = question.correctOptions;
          const userSelected = userAnswer;

          // Đếm số đáp án đúng người dùng chọn
          const correctSelected = userSelected.filter((opt) =>
            correctOptions.includes(opt),
          ).length;

          // Đếm số đáp án sai người dùng chọn
          const incorrectSelected = userSelected.filter(
            (opt) => !correctOptions.includes(opt),
          ).length;

          // Tính điểm: mỗi đáp án đúng được tính, trừ điểm đáp án sai
          const questionScore = Math.max(
            0,
            correctSelected - incorrectSelected,
          );
          const maxScore = correctOptions.length;

          // Nếu chọn đúng tất cả đáp án đúng và không chọn sai
          if (
            correctSelected === correctOptions.length &&
            incorrectSelected === 0
          ) {
            correct++;
            partialScore += 1;
          } else {
            // Tính điểm một phần (VD: 2/3 đáp án đúng)
            partialScore += questionScore / maxScore;
          }
        }
      } else {
        // Tính điểm cho câu hỏi một đáp án
        if (userAnswer && question.correctOptions.includes(userAnswer)) {
          correct++;
        }
      }
    });

    // Tính tổng điểm
    const totalScore = correct + partialScore;
    const percentageScore = Math.round(
      (totalScore / quiz.questions.length) * 100,
    );

    return {
      total: quiz.questions.length,
      correct, // Số câu đúng hoàn toàn
      partial: partialScore, // Điểm một phần
      totalScore: totalScore.toFixed(1), // Tổng điểm
      wrong: quiz.questions.length - correct - partialScore,
      score: percentageScore,
      details: quiz.questions.map((q, index) => {
        const userAnswer = answers[q.id];
        const isMultipleChoice = q.correctOptions.length > 1;
        let isCorrect = false;
        let partial = 0;

        if (isMultipleChoice && Array.isArray(userAnswer)) {
          const correctSelected = userAnswer.filter((opt) =>
            q.correctOptions.includes(opt),
          ).length;
          const incorrectSelected = userAnswer.filter(
            (opt) => !q.correctOptions.includes(opt),
          ).length;
          const questionScore = Math.max(
            0,
            correctSelected - incorrectSelected,
          );
          const maxScore = q.correctOptions.length;

          isCorrect =
            correctSelected === q.correctOptions.length &&
            incorrectSelected === 0;
          partial = questionScore / maxScore;
        } else {
          isCorrect = userAnswer && q.correctOptions.includes(userAnswer);
        }

        return {
          questionId: q.id,
          userAnswer,
          isCorrect,
          partial,
          maxScore: isMultipleChoice ? q.correctOptions.length : 1,
        };
      }),
    };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Array.from(answeredQuestions).length;
  };

  const isQuestionAnswered = (questionId) => {
    return answeredQuestions.has(questionId);
  };

  const getQuestionType = (question) => {
    return question.correctOptions.length > 1 ? "multiple" : "single";
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
  const answeredCount = getAnsweredCount();
  const totalQuestions = quiz.questions.length;
  const questionType = getQuestionType(currentQuestion);
  const currentAnswers =
    answers[currentQuestion.id] ||
    (questionType === "multiple" ? [] : undefined);

  return (
    <div className={styles.container}>
      {/* Header */}
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

      {/* Question Area */}
      <div className={styles.questionArea}>
        <div className={styles.questionHeader}>
          <div className={styles.questionInfo}>
            <span className={styles.questionNumber}>
              Câu {currentQuestionIndex + 1}/{totalQuestions}
            </span>
            <span
              className={`${styles.questionTypeBadge} ${
                questionType === "multiple"
                  ? styles.multipleChoice
                  : styles.singleChoice
              }`}
            >
              {questionType === "multiple" ? "Nhiều đáp án" : "Một đáp án"}
            </span>
            <span className={styles.answeredCount}>
              Đã trả lời: {answeredCount}/{totalQuestions}
            </span>
          </div>
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

        {questionType === "multiple" && (
          <p className={styles.multipleHint}>
            <MdCheckCircle size={16} />
            Có thể chọn nhiều đáp án
          </p>
        )}

        <div className={styles.options}>
          {currentQuestion.options
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((option) => {
              const isSelected =
                questionType === "multiple"
                  ? currentAnswers?.includes(option.value)
                  : currentAnswers === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() =>
                    handleAnswer(
                      currentQuestion.id,
                      option.value,
                      questionType === "multiple",
                    )
                  }
                  className={`${styles.optionBtn} ${isSelected ? styles.selected : ""}`}
                >
                  <span className={styles.optionValue}>{option.value}.</span>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {questionType === "multiple" ? (
                    isSelected ? (
                      <MdCheckBox size={20} className={styles.checkedIcon} />
                    ) : (
                      <MdCheckBoxOutlineBlank
                        size={20}
                        className={styles.uncheckedIcon}
                      />
                    )
                  ) : isSelected ? (
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

        {/* Hiển thị hint khi câu đã được trả lời */}
        {isQuestionAnswered(currentQuestion.id) && (
          <div className={styles.answeredHint}>
            <MdCheckCircle size={16} />
            <span>
              {questionType === "multiple"
                ? `Bạn đã chọn ${currentAnswers?.length || 0} đáp án. Có thể chọn thêm hoặc bỏ chọn.`
                : "Bạn đã trả lời câu này. Có thể chọn lại đáp án khác."}
            </span>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
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

          {currentQuestionIndex < totalQuestions - 1 && (
            <button onClick={handleNext} className={styles.navBtn}>
              Câu sau
              <MdNavigateNext size={24} />
            </button>
          )}
        </div>

        <button
          onClick={handleConfirmSubmit}
          className={styles.submitBtn}
          disabled={answeredCount === 0}
        >
          <MdSend size={20} />
          Nộp bài
          {answeredCount > 0 && (
            <span className={styles.submitBadge}>
              {answeredCount}/{totalQuestions}
            </span>
          )}
        </button>
      </div>

      {/* Question Navigator */}
      <div className={styles.questionNavigator}>
        <div className={styles.navigatorHeader}>
          <span>Danh sách câu</span>
          <span className={styles.navigatorStats}>
            {answeredCount}/{totalQuestions}
          </span>
        </div>
        <div className={styles.navigatorGrid}>
          {quiz.questions.map((q, idx) => {
            const isAnswered =
              answers[q.id] !== undefined &&
              (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true);
            const isFlagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentQuestionIndex;
            const qType = q.correctOptions.length > 1 ? "multiple" : "single";

            return (
              <button
                key={q.id}
                onClick={() => {
                  isAutoAdvancing.current = false;
                  setCurrentQuestionIndex(idx);
                }}
                className={`${styles.navDot} ${isCurrent ? styles.current : ""} 
                  ${isAnswered ? styles.answered : ""} ${isFlagged ? styles.flagged : ""}
                  ${qType === "multiple" ? styles.multipleDot : ""}`}
                title={`Câu ${idx + 1} - ${qType === "multiple" ? "Nhiều đáp án" : "Một đáp án"}
                  ${isAnswered ? " - Đã trả lời" : ""}${isFlagged ? " - Đã đánh dấu" : ""}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <MdWarning size={48} className={styles.confirmIcon} />
            <h3>Xác nhận nộp bài</h3>
            <p>
              Bạn đã trả lời {answeredCount}/{totalQuestions} câu hỏi.
              {answeredCount < totalQuestions && (
                <span className={styles.warningText}>
                  {" "}
                  Còn {totalQuestions - answeredCount} câu chưa trả lời.
                </span>
              )}
            </p>
            <p className={styles.confirmQuestion}>
              Bạn có chắc muốn nộp bài không?
            </p>
            <div className={styles.confirmActions}>
              <button onClick={handleCancelSubmit} className={styles.cancelBtn}>
                Hủy
              </button>
              <button onClick={handleSubmitQuiz} className={styles.confirmBtn}>
                <MdCheckCircle size={18} />
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTake;
