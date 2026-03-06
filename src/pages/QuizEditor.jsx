import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import {
  MdQuiz,
  MdDownload,
  MdAdd,
  MdUpload,
  MdFilePresent,
  MdArrowBack,
  MdAttachFile,
  MdCloudUpload,
  MdSave,
  MdArrowDropDown,
  MdCheckCircle,
  MdFileDownload,
  MdList,
  MdDelete,
  MdEdit,
  MdClose,
  MdVisibility
} from 'react-icons/md';
import QuizForm from '../components/Quiz-Create/QuizForm';
import styles from '../css/QuizEditor.module.css';

const QuizEditor = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [quiz, setQuiz] = useState(null);
  const [importJson, setImportJson] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [showQuizList, setShowQuizList] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    loadSavedQuizzes();
  }, []);

  const loadSavedQuizzes = () => {
    try {
      const quizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      setSavedQuizzes(quizzes);
    } catch (error) {
      console.error('Lỗi khi load quiz:', error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const resetToWelcome = () => {
    setQuiz(null);
    setSelectedQuiz(null);
    setImportJson('');
    setFileName('');
    setError('');
    setActiveTab('create');
    setShowQuizList(false);
    setIsDropdownOpen(false);
  };

  const processFile = (file) => {
    if (!file) return;
    
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Vui lòng chọn file JSON');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        setImportJson(content);
        setError('');
      } catch (error) {
        setError('Lỗi đọc file: ' + error.message);
      }
    };
    reader.onerror = () => {
      setError('Lỗi đọc file');
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleImportFromContent = (content) => {
    try {
      if (!content.trim()) {
        setError('Vui lòng nhập JSON');
        return;
      }
      const parsed = JSON.parse(content);
      
      if (!parsed.name || !Array.isArray(parsed.questions)) {
        setError('Format không hợp lệ: thiếu tên hoặc mảng câu hỏi');
        return;
      }
      
      setQuiz(parsed);
      setImportJson('');
      setFileName('');
      setError('');
      setActiveTab('create');
    } catch (error) {
      setError('JSON không hợp lệ: ' + error.message);
    }
  };

  const handleImport = () => {
    handleImportFromContent(importJson);
  };

  const handleNewQuiz = () => {
    setQuiz({
      name: '',
      description: '',
      questions: []
    });
    setSelectedQuiz(null);
    setShowQuizList(false);
  };

  const handleCancel = () => {
    if (quiz && window.confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ mất.')) {
      resetToWelcome();
    }
  };

  const handleClearImport = () => {
    setImportJson('');
    setFileName('');
    setError('');
  };

  const validateQuiz = (quizToValidate) => {
    if (!quizToValidate) {
      alert('Không có dữ liệu quiz');
      return false;
    }
    
    if (!quizToValidate.name?.trim()) {
      alert('Vui lòng nhập tên Quiz');
      return false;
    }

    if (!quizToValidate.questions || quizToValidate.questions.length === 0) {
      alert('Quiz phải có ít nhất 1 câu hỏi');
      return false;
    }

    for (let i = 0; i < quizToValidate.questions.length; i++) {
      const q = quizToValidate.questions[i];
      if (!q.name?.trim()) {
        alert(`Câu hỏi ${i + 1}: Tiêu đề không được để trống`);
        return false;
      }
      if (!q.options || q.options.length < 2) {
        alert(`Câu hỏi ${i + 1}: Cần ít nhất 2 lựa chọn`);
        return false;
      }
      if (!q.correctOptions || q.correctOptions.length === 0) {
        alert(`Câu hỏi ${i + 1}: Cần ít nhất 1 đáp án đúng`);
        return false;
      }
    }
    return true;
  };

  const handleSaveQuiz = () => {
    if (!validateQuiz(quiz)) return;

    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const newQuiz = {
        ...quiz,
        id: selectedQuiz?.id || Date.now(),
        savedAt: !selectedQuiz ? new Date().toISOString() : quiz.savedAt,
        updatedAt: new Date().toISOString()
      };

      let updatedQuizzes;
      if (selectedQuiz) {
        updatedQuizzes = savedQuizzes.map(q => 
          q.id === selectedQuiz.id ? newQuiz : q
        );
      } else {
        updatedQuizzes = [...savedQuizzes, newQuiz];
      }

      localStorage.setItem('savedQuizzes', JSON.stringify(updatedQuizzes));
      setSavedQuizzes(updatedQuizzes);
      
      alert('Lưu Quiz thành công!');
      resetToWelcome(); 
    } catch (error) {
      alert('Lỗi khi lưu Quiz: ' + error.message);
    }
  };

  const handleExportOnly = () => {
    if (!validateQuiz(quiz)) return;

    try {
      const dataStr = JSON.stringify(quiz, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `quiz-${quiz.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('Export Quiz thành công!');
      resetToWelcome();
    } catch (error) {
      alert('Lỗi khi export: ' + error.message);
    }
  };

  const handleSaveAndExport = () => {
    if (!validateQuiz(quiz)) return;

    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const newQuiz = {
        ...quiz,
        id: selectedQuiz?.id || Date.now(),
        savedAt: !selectedQuiz ? new Date().toISOString() : quiz.savedAt,
        updatedAt: new Date().toISOString()
      };

      let updatedQuizzes;
      if (selectedQuiz) {
        updatedQuizzes = savedQuizzes.map(q => 
          q.id === selectedQuiz.id ? newQuiz : q
        );
      } else {
        updatedQuizzes = [...savedQuizzes, newQuiz];
      }

      localStorage.setItem('savedQuizzes', JSON.stringify(updatedQuizzes));
      setSavedQuizzes(updatedQuizzes);
    } catch (error) {
      alert('Lỗi khi lưu Quiz: ' + error.message);
      return;
    }

    try {
      const dataStr = JSON.stringify(quiz, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `quiz-${quiz.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('Lưu và Export Quiz thành công!');
      resetToWelcome(); // Quay về màn hình chào
    } catch (error) {
      alert('Lỗi khi export: ' + error.message);
    }
  };

  const handleEditQuiz = (quizItem) => {
    setSelectedQuiz(quizItem);
    setQuiz(quizItem);
    setShowQuizList(false);
    setActiveTab('create');
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa quiz này?')) {
      try {
        const updatedQuizzes = savedQuizzes.filter(q => q.id !== id);
        localStorage.setItem('savedQuizzes', JSON.stringify(updatedQuizzes));
        setSavedQuizzes(updatedQuizzes);
        
        if (selectedQuiz?.id === id) {
          setSelectedQuiz(null);
          setQuiz(null);
        }
        
        alert('Xóa quiz thành công!');
      } catch (error) {
        alert('Lỗi khi xóa quiz: ' + error.message);
      }
    }
  };

  const handleViewQuiz = (quizItem) => {
    setSelectedQuiz(quizItem);
    setQuiz(quizItem);
    setShowQuizList(false);
    setActiveTab('create');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không rõ';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.dropdownContainer}`)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <LogoutButton/>
      <div className={styles.header}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <MdArrowBack size={24} />
        </button>
        <MdQuiz size={48} className={styles.headerIcon} />
        <h1>Trình tạo Quiz</h1>
        <p>Tạo và chỉnh sửa quiz dễ dàng</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.tabButtons}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'create' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('create');
              setShowQuizList(false);
            }}
          >
            <MdAdd size={18} />
            Tạo mới
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'import' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('import');
              setShowQuizList(false);
            }}
          >
            <MdUpload size={18} />
            Import JSON
          </button>
          <button 
            className={`${styles.tabButton} ${showQuizList ? styles.active : ''}`}
            onClick={() => {
              setShowQuizList(!showQuizList);
              setActiveTab('');
              loadSavedQuizzes();
            }}
          >
            <MdList size={18} />
            Danh sách Quiz
          </button>
        </div>

        {activeTab === 'import' && (
          <div className={styles.importSection}>
            <div className={styles.fileUploadArea}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,application/json"
                style={{ display: 'none' }}
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className={styles.fileUploadBtn}
              >
                <MdAttachFile size={18} />
                Chọn file JSON
              </button>
              {fileName && (
                <span className={styles.fileName}>
                  📄 {fileName}
                </span>
              )}
            </div>
            
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className={styles.dropOverlay}>
                  <MdCloudUpload size={48} />
                  <p>Thả file JSON vào đây</p>
                </div>
              )}
              <div className={styles.textareaWrapper}>
                <div className={styles.dropIcon}>
                  <MdCloudUpload size={32} />
                </div>
                <textarea
                  placeholder='Hoặc paste JSON trực tiếp vào đây...'
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  rows={6}
                  className={`${styles.importTextarea} ${error ? styles.errorInput : ''}`}
                />
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.importActions}>
              <button onClick={handleImport} className={styles.importBtn}>
                <MdFilePresent size={18} />
                Import Quiz
              </button>
              <button 
                onClick={handleClearImport} 
                className={styles.clearBtn}
              >
                Xóa
              </button>
            </div>
          </div>
        )}

        {showQuizList && (
          <div className={styles.quizListSection}>
            <h3>Danh sách Quiz đã tạo</h3>
            {savedQuizzes.length === 0 ? (
              <p className={styles.emptyList}>Chưa có quiz nào được lưu</p>
            ) : (
              <div className={styles.quizGrid}>
                {savedQuizzes.map((q) => (
                  <div key={q.id} className={styles.quizCard}>
                    <div className={styles.quizCardHeader}>
                      <h4>{q.name}</h4>
                      <span className={styles.questionCount}>
                        {q.questions?.length || 0} câu hỏi
                      </span>
                    </div>
                    {q.description && (
                      <p className={styles.quizDescription}>{q.description}</p>
                    )}
                    <div className={styles.quizMeta}>
                      <span className={styles.quizDate}>
                        {q.updatedAt ? 'Cập nhật: ' : 'Tạo: '}
                        {formatDate(q.updatedAt || q.savedAt)}
                      </span>
                    </div>
                    <div className={styles.quizCardActions}>
                      <button 
                        onClick={() => handleViewQuiz(q)}
                        className={styles.viewBtn}
                        title="Xem quiz"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditQuiz(q)}
                        className={styles.editBtn}
                        title="Chỉnh sửa"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuiz(q.id)}
                        className={styles.deleteBtn}
                        title="Xóa"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!quiz && !showQuizList ? (
        <div className={styles.welcomeScreen}>
          <MdQuiz size={80} className={styles.welcomeIcon} />
          <h2>Chào mừng đến với Quiz Editor!</h2>
          <p>Bắt đầu bằng cách tạo quiz mới hoặc import từ file JSON</p>
          <button onClick={handleNewQuiz} className={styles.welcomeNewBtn}>
            <MdAdd size={20} />
            Tạo Quiz mới
          </button>
        </div>
      ) : showQuizList ? null : (
        <>
          <QuizForm quiz={quiz} onQuizChange={setQuiz} />
  
          <div className={styles.bottomActions}>
            <button onClick={handleCancel} className={styles.cancelBottomBtn}>
              Hủy
            </button>
            
            <div className={styles.dropdownContainer}>
              <button 
                className={styles.dropdownTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <MdSave size={20} />
                {selectedQuiz ? 'Cập nhật Quiz' : 'Lưu Quiz'}
                <MdArrowDropDown size={20} className={styles.dropdownIcon} />
              </button>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleSaveQuiz} className={styles.dropdownItem}>
                    <MdSave size={18} />
                    <span>{selectedQuiz ? 'Cập nhật' : 'Chỉ lưu'}</span>
                    <small className={styles.itemDesc}>
                      {selectedQuiz ? 'Cập nhật vào bộ nhớ' : 'Lưu vào bộ nhớ'}
                    </small>
                  </button>
                  
                  <button onClick={handleExportOnly} className={styles.dropdownItem}>
                    <MdFileDownload size={18} />
                    <span>Chỉ Export</span>
                    <small className={styles.itemDesc}>Xuất ra file JSON</small>
                  </button>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  <button onClick={handleSaveAndExport} className={`${styles.dropdownItem} ${styles.highlight}`}>
                    <MdCheckCircle size={18} />
                    <span>{selectedQuiz ? 'Cập nhật và Export' : 'Lưu và Export'}</span>
                    <small className={styles.itemDesc}>
                      {selectedQuiz ? 'Vừa cập nhật vừa xuất file' : 'Vừa lưu vừa xuất file'}
                    </small>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizEditor;