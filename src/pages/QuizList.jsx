import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import {
  MdQuiz,
  MdPlayArrow,
  MdAccessTime,
  MdQuestionAnswer,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import styles from "../css/QuizList.module.css";

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    try {
      const savedQuizzes = JSON.parse(
        localStorage.getItem("savedQuizzes") || "[]",
      );
      const quizzesWithStats = savedQuizzes.map((quiz) => ({
        ...quiz,
        timesPlayed: Math.floor(Math.random() * 100),
        avgScore: Math.floor(Math.random() * 30) + 70,
      }));
      setQuizzes(quizzesWithStats);
    } catch (error) {
      console.error("Lỗi khi load quiz:", error);
    }
  };

  const handleTakeQuiz = (quiz) => {
    sessionStorage.setItem("currentQuiz", JSON.stringify(quiz));
    navigate(`/quiz/take/${quiz.id}`);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (searchTerm) {
      return (
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.description &&
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (filter === "recent") {
      return new Date(b.savedAt || 0) - new Date(a.savedAt || 0);
    }
    if (filter === "popular") {
      return (b.timesPlayed || 0) - (a.timesPlayed || 0);
    }
    return 0;
  });

  return (
    <div className={styles.container}>
      <LogoutButton />

      <div className={styles.header}>
        <MdQuiz size={48} className={styles.headerIcon} />
        <h1>Danh sách Quiz</h1>
        <p>Chọn quiz để bắt đầu làm bài</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <MdSearch size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterBox}>
          <MdFilterList size={20} className={styles.filterIcon} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả</option>
            <option value="recent">Mới nhất</option>
            <option value="popular">Phổ biến</option>
          </select>
        </div>
      </div>

      {sortedQuizzes.length === 0 ? (
        <div className={styles.emptyState}>
          <MdQuiz size={64} className={styles.emptyIcon} />
          <h3>Không có quiz nào</h3>
          <p>Hiện tại chưa có quiz nào để làm bài</p>
        </div>
      ) : (
        <div className={styles.quizGrid}>
          {sortedQuizzes.map((quiz) => (
            <div key={quiz.id} className={styles.quizCard}>
              <div className={styles.quizCardHeader}>
                <h3>{quiz.name}</h3>
                <span className={styles.questionCount}>
                  <MdQuestionAnswer size={14} />
                  {quiz.questions?.length || 0} câu
                </span>
              </div>

              {quiz.description && (
                <p className={styles.quizDescription}>{quiz.description}</p>
              )}

              <div className={styles.quizStats}>
                <div className={styles.stat}>
                  <MdAccessTime size={16} />
                  <span>
                    {Math.ceil((quiz.questions?.length || 0) * 0.5)} phút
                  </span>
                </div>
                <div className={styles.stat}>
                  <span>👥 {quiz.timesPlayed} lượt</span>
                </div>
              </div>

              <div className={styles.quizCardFooter}>
                <button
                  onClick={() => handleTakeQuiz(quiz)}
                  className={styles.takeQuizBtn}
                >
                  <MdPlayArrow size={18} />
                  Làm quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
