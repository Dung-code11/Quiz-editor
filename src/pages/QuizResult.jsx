import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdQuiz,
  MdHome,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
  MdBarChart,
  MdAccessTime,
  MdStar,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import styles from "../css/QuizResult.module.css";

const QuizResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    const savedResults = sessionStorage.getItem("quizResults");
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      setResults(parsed);

      const savedQuiz = sessionStorage.getItem("currentQuiz");
      if (savedQuiz) {
        setQuiz(JSON.parse(savedQuiz));
      }
    } else {
      navigate("/quiz/list");
    }
  }, [id, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return styles.excellent;
    if (score >= 60) return styles.good;
    if (score >= 50) return styles.average;
    return styles.poor;
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Xuất sắc! 🎉";
    if (score >= 60) return "Khá tốt! 👍";
    if (score >= 50) return "Tạm ổn! 📚";
    return "Cần cố gắng hơn! 💪";
  };

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const renderUserAnswer = (question, userAnswer) => {
    const isMultipleChoice = question.correctOptions.length > 1;
    
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return <span className={styles.noAnswer}>Chưa trả lời</span>;
    }

    if (isMultipleChoice && Array.isArray(userAnswer)) {
      return (
        <div className={styles.multipleAnswers}>
          {userAnswer.map(answer => {
            const option = question.options.find(opt => opt.value === answer);
            const isCorrect = question.correctOptions.includes(answer);
            return (
              <span 
                key={answer} 
                className={`${styles.answerTag} ${isCorrect ? styles.correctTag : styles.wrongTag}`}
              >
                <strong>{answer}.</strong> {option?.label || answer}
                {isCorrect ? 
                  <MdCheckCircle size={14} className={styles.tagIcon} /> : 
                  <MdCancel size={14} className={styles.tagIcon} />
                }
              </span>
            );
          })}
        </div>
      );
    }

    // Single choice
    const option = question.options.find(opt => opt.value === userAnswer);
    return (
      <span className={styles.answer}>
        <strong>{userAnswer}.</strong> {option?.label || userAnswer}
      </span>
    );
  };

  const renderCorrectAnswer = (question) => {
    const isMultipleChoice = question.correctOptions.length > 1;
    
    if (isMultipleChoice) {
      return (
        <div className={styles.multipleAnswers}>
          {question.correctOptions.map(value => {
            const option = question.options.find(opt => opt.value === value);
            return (
              <span key={value} className={`${styles.answerTag} ${styles.correctTag}`}>
                <strong>{value}.</strong> {option?.label || value}
                <MdCheckCircle size={14} className={styles.tagIcon} />
              </span>
            );
          })}
        </div>
      );
    }

    const correctOption = question.options.find(
      opt => opt.value === question.correctOptions[0]
    );
    return (
      <span className={styles.answer}>
        <strong>{correctOption?.value}.</strong> {correctOption?.label}
      </span>
    );
  };

  const calculateQuestionScore = (question, userAnswer) => {
    const isMultipleChoice = question.correctOptions.length > 1;
    
    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return { score: 0, maxScore: isMultipleChoice ? question.correctOptions.length : 1 };
    }

    if (isMultipleChoice && Array.isArray(userAnswer)) {
      const correctSelected = userAnswer.filter(ans => 
        question.correctOptions.includes(ans)
      ).length;
      const incorrectSelected = userAnswer.filter(ans => 
        !question.correctOptions.includes(ans)
      ).length;
      
      const score = Math.max(0, correctSelected - incorrectSelected);
      return {
        score,
        maxScore: question.correctOptions.length,
        correctSelected,
        incorrectSelected,
        isPartial: score > 0 && score < question.correctOptions.length
      };
    }

    // Single choice
    const isCorrect = userAnswer && question.correctOptions.includes(userAnswer);
    return {
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      isCorrect
    };
  };

  if (!results || !quiz) {
    return (
      <div className={styles.loading}>
        <MdQuiz size={48} className={styles.loadingIcon} />
        <p>Đang tải kết quả...</p>
      </div>
    );
  }

  const totalPossibleScore = quiz.questions.reduce((sum, q) => 
    sum + (q.correctOptions.length > 1 ? q.correctOptions.length : 1), 0
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MdQuiz size={48} className={styles.headerIcon} />
        <h1>Kết quả bài làm</h1>
        <p className={styles.quizName}>{results.quizName}</p>
      </div>

      {/* Score Card */}
      <div className={styles.scoreCard}>
        <div
          className={`${styles.scoreCircle} ${getScoreColor(results.results.score)}`}
        >
          <span className={styles.scoreNumber}>{results.results.score}</span>
          <span className={styles.scoreLabel}>điểm</span>
        </div>
        <div className={styles.scoreMessage}>
          {getScoreMessage(results.results.score)}
        </div>
        {results.results.partial > 0 && (
          <div className={styles.partialScore}>
            <MdInfo size={16} />
            <span>Điểm một phần: {results.results.partial.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#48bb78" }}>
            <MdCheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{results.results.correct}</span>
            <span className={styles.statLabel}>Đúng hoàn toàn</span>
          </div>
        </div>

        {results.results.partial > 0 && (
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fbbf24" }}>
              <MdStar size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {results.results.partial.toFixed(1)}
              </span>
              <span className={styles.statLabel}>Điểm một phần</span>
            </div>
          </div>
        )}

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#4299e1" }}>
            <MdBarChart size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{results.results.total}</span>
            <span className={styles.statLabel}>Tổng câu</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#ed8936" }}>
            <MdAccessTime size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {formatTime(results.timeSpent)}
            </span>
            <span className={styles.statLabel}>Thời gian</span>
          </div>
        </div>
      </div>

      {/* Detailed Answers */}
      <div className={styles.detailedAnswers}>
        <h3>Chi tiết câu trả lời</h3>
        <div className={styles.answersList}>
          {quiz.questions.map((question, index) => {
            const userAnswer = results.answers[question.id];
            const isMultipleChoice = question.correctOptions.length > 1;
            const questionScore = calculateQuestionScore(question, userAnswer);
            const isExpanded = expandedQuestions.has(question.id);
            
            return (
              <div 
                key={question.id} 
                className={`${styles.answerItem} ${isMultipleChoice ? styles.multipleChoiceItem : ''}`}
              >
                <div 
                  className={styles.answerHeader}
                  onClick={() => toggleQuestionExpand(question.id)}
                >
                  <div className={styles.questionInfo}>
                    <span className={styles.questionNumber}>Câu {index + 1}</span>
                    {isMultipleChoice && (
                      <span className={styles.multipleBadge}>
                        Nhiều đáp án
                      </span>
                    )}
                  </div>
                  <div className={styles.scoreInfo}>
                    <span className={styles.questionScore}>
                      {questionScore.score}/{questionScore.maxScore}
                    </span>
                    <span
                      className={`${styles.resultBadge} ${
                        questionScore.score === questionScore.maxScore 
                          ? styles.correct 
                          : questionScore.score > 0 
                            ? styles.partial 
                            : styles.wrong
                      }`}
                    >
                      {questionScore.score === questionScore.maxScore 
                        ? "Đúng" 
                        : questionScore.score > 0 
                          ? "Một phần" 
                          : "Sai"}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.answerDetails}>
                    <p className={styles.questionText}>{question.name}</p>
                    
                    {question.description && (
                      <p className={styles.questionDesc}>{question.description}</p>
                    )}

                    <div className={styles.comparison}>
                      <div className={styles.userAnswerSection}>
                        <span className={styles.label}>
                          <MdCheckCircle size={16} />
                          Câu trả lời của bạn:
                        </span>
                        {renderUserAnswer(question, userAnswer)}
                      </div>

                      {(!userAnswer || 
                        (Array.isArray(userAnswer) && userAnswer.length === 0) ||
                        questionScore.score < questionScore.maxScore) && (
                        <div className={styles.correctAnswerSection}>
                          <span className={styles.label}>
                            <MdStar size={16} />
                            Đáp án đúng:
                          </span>
                          {renderCorrectAnswer(question)}
                        </div>
                      )}
                    </div>

                    {isMultipleChoice && questionScore.isPartial && (
                      <div className={styles.partialHint}>
                        <MdInfo size={16} />
                        <span>
                          Bạn đã chọn đúng {questionScore.correctSelected}/{questionScore.maxScore} đáp án
                          {questionScore.incorrectSelected > 0 && 
                            ` và chọn sai ${questionScore.incorrectSelected} đáp án`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          onClick={() => navigate("/quiz/list")}
          className={styles.homeBtn}
        >
          <MdHome size={20} />
          Về trang chủ
        </button>

        <button
          onClick={() => {
            sessionStorage.setItem("currentQuiz", JSON.stringify(quiz));
            navigate(`/quiz/take/${quiz.id}`);
          }}
          className={styles.retryBtn}
        >
          <MdRefresh size={20} />
          Làm lại
        </button>
      </div>
    </div>
  );
};

export default QuizResult;