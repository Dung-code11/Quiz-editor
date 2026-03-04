import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MdFileDownload
} from 'react-icons/md';
import QuizForm from '../components/QuizForm';
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

  const handleGoBack = () => {
    navigate(-1);
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
  };

  const handleCancel = () => {
    if (quiz && window.confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ mất.')) {
      setQuiz(null);
      setImportJson('');
      setFileName('');
      setError('');
    }
  };

  const handleClearImport = () => {
    setImportJson('');
    setFileName('');
    setError('');
  };

  // Validation function
  const validateQuiz = () => {
    if (!quiz) return false;
    
    if (!quiz.name.trim()) {
      alert('Vui lòng nhập tên Quiz');
      return false;
    }

    if (quiz.questions.length === 0) {
      alert('Quiz phải có ít nhất 1 câu hỏi');
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.name.trim()) {
        alert(`Câu hỏi ${i + 1}: Tiêu đề không được để trống`);
        return false;
      }
      if (q.options.length < 2) {
        alert(`Câu hỏi ${i + 1}: Cần ít nhất 2 lựa chọn`);
        return false;
      }
      if (q.correctOptions.length === 0) {
        alert(`Câu hỏi ${i + 1}: Cần ít nhất 1 đáp án đúng`);
        return false;
      }
    }
    return true;
  };

  // Save functions
  const handleSaveQuiz = () => {
    if (!validateQuiz()) return;

    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const newQuiz = {
        ...quiz,
        id: Date.now(),
        savedAt: new Date().toISOString()
      };
      savedQuizzes.push(newQuiz);
      localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
      alert('✅ Lưu Quiz thành công!');
      setIsDropdownOpen(false);
    } catch (error) {
      alert('Lỗi khi lưu Quiz: ' + error.message);
    }
  };

  const handleExportOnly = () => {
    if (!validateQuiz()) return;

    try {
      const dataStr = JSON.stringify(quiz, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `quiz-${quiz.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('✅ Export Quiz thành công!');
      setIsDropdownOpen(false);
    } catch (error) {
      alert('Lỗi khi export: ' + error.message);
    }
  };

  const handleSaveAndExport = () => {
    if (!validateQuiz()) return;

    // Lưu vào localStorage
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
      const newQuiz = {
        ...quiz,
        id: Date.now(),
        savedAt: new Date().toISOString()
      };
      savedQuizzes.push(newQuiz);
      localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
    } catch (error) {
      alert('Lỗi khi lưu Quiz: ' + error.message);
      return;
    }

    // Export JSON
    try {
      const dataStr = JSON.stringify(quiz, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `quiz-${quiz.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      alert('✅ Lưu và Export Quiz thành công!');
      setIsDropdownOpen(false);
    } catch (error) {
      alert('Lỗi khi export: ' + error.message);
    }
  };

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
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
            onClick={() => setActiveTab('create')}
          >
            <MdAdd size={18} />
            Tạo mới
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'import' ? styles.active : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <MdUpload size={18} />
            Import JSON
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
      </div>

      {!quiz ? (
        <div className={styles.welcomeScreen}>
          <MdQuiz size={80} className={styles.welcomeIcon} />
          <h2>Chào mừng đến với Quiz Editor!</h2>
          <p>Bắt đầu bằng cách tạo quiz mới hoặc import từ file JSON</p>
          <button onClick={handleNewQuiz} className={styles.welcomeNewBtn}>
            <MdAdd size={20} />
            Tạo Quiz mới
          </button>
        </div>
      ) : (
        <>
          <QuizForm quiz={quiz} onQuizChange={setQuiz} />
          
          {/* Action buttons at the bottom */}
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
                Lưu Quiz
                <MdArrowDropDown size={20} className={styles.dropdownIcon} />
              </button>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleSaveQuiz} className={styles.dropdownItem}>
                    <MdSave size={18} />
                    <span>Chỉ lưu</span>
                    <small className={styles.itemDesc}>Lưu vào bộ nhớ</small>
                  </button>
                  
                  <button onClick={handleExportOnly} className={styles.dropdownItem}>
                    <MdFileDownload size={18} />
                    <span>Chỉ Export</span>
                    <small className={styles.itemDesc}>Xuất ra file JSON</small>
                  </button>
                  
                  <div className={styles.dropdownDivider}></div>
                  
                  <button onClick={handleSaveAndExport} className={`${styles.dropdownItem} ${styles.highlight}`}>
                    <MdCheckCircle size={18} />
                    <span>Lưu và Export</span>
                    <small className={styles.itemDesc}>Vừa lưu vừa xuất file</small>
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