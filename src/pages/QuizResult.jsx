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
} from "react-icons/md";
import styles from "../css/QuizResult.module.css";

const QuizResult = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [quiz, setQuiz] = useState(null);

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
    if (score >= 40) return styles.average;
    return styles.poor;
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Xuất sắc! 🎉";
    if (score >= 60) return "Khá tốt! 👍";
    if (score >= 40) return "Cần cố gắng thêm 📚";
    return "Hãy thử lại nhé! 💪";
  };

  if (!results || !quiz) {
    return (
      <div className={styles.loading}>
        <MdQuiz size={48} className={styles.loadingIcon} />
        <p>Đang tải kết quả...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MdQuiz size={48} className={styles.headerIcon} />
        <h1>Kết quả bài làm</h1>
        <p className={styles.quizName}>{results.quizName}</p>
      </div>

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
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#48bb78" }}>
            <MdCheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{results.results.correct}</span>
            <span className={styles.statLabel}>Đúng</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#f56565" }}>
            <MdCancel size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{results.results.wrong}</span>
            <span className={styles.statLabel}>Sai</span>
          </div>
        </div>

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

      <div className={styles.detailedAnswers}>
        <h3>Chi tiết câu trả lời</h3>
        <div className={styles.answersList}>
          {quiz.questions.map((question, index) => {
            const userAnswer = results.answers[question.id];
            const isCorrect =
              userAnswer && question.correctOptions.includes(userAnswer);
            const correctOption = question.options.find((opt) =>
              question.correctOptions.includes(opt.value),
            );

            return (
              <div key={question.id} className={styles.answerItem}>
                <div className={styles.answerHeader}>
                  <span className={styles.questionNumber}>Câu {index + 1}</span>
                  <span
                    className={`${styles.resultBadge} ${isCorrect ? styles.correct : styles.wrong}`}
                  >
                    {isCorrect ? "Đúng" : "Sai"}
                  </span>
                </div>

                <p className={styles.questionText}>{question.name}</p>

                <div className={styles.answerDetails}>
                  <div className={styles.userAnswer}>
                    <span className={styles.label}>Câu trả lời của bạn:</span>
                    <span
                      className={`${styles.answer} ${!isCorrect ? styles.wrongAnswer : ""}`}
                    >
                      {userAnswer ? (
                        <>
                          <strong>{userAnswer}.</strong>{" "}
                          {
                            question.options.find(
                              (opt) => opt.value === userAnswer,
                            )?.label
                          }
                        </>
                      ) : (
                        "Chưa trả lời"
                      )}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className={styles.correctAnswer}>
                      <span className={styles.label}>Đáp án đúng:</span>
                      <span className={styles.answer}>
                        <strong>{correctOption.value}.</strong>{" "}
                        {correctOption.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
