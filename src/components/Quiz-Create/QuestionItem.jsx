import React, { useState } from "react";
import {
  MdExpandMore,
  MdExpandLess,
  MdArrowUpward,
  MdArrowDownward,
  MdContentCopy,
  MdDelete,
  MdWarning,
} from "react-icons/md";
import OptionList from "./OptionList";
import styles from "../../css/QuestionItem.module.css";

const QuestionItem = ({
  question,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showValidation, setShowValidation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...question, [name]: value });
  };

  const handleOptionsChange = (options) => {
    onUpdate({ ...question, options });
  };

  const handleCorrectOptionsChange = (optionValue) => {
    let newCorrectOptions;
    if (question.correctOptions.includes(optionValue)) {
      newCorrectOptions = question.correctOptions.filter(
        (v) => v !== optionValue
      );
    } else {
      newCorrectOptions = [...question.correctOptions, optionValue];
    }
    onUpdate({ ...question, correctOptions: newCorrectOptions });
  };

  const validateQuestion = () => {
    const errors = [];
    if (!question.name?.trim())
      errors.push("Tiêu đề câu hỏi không được để trống");
    if (question.options?.length < 2) errors.push("Cần ít nhất 2 lựa chọn");
    if (question.correctOptions?.length < 1)
      errors.push("Cần ít nhất 1 đáp án đúng");
    return errors;
  };

  const errors = validateQuestion();
  const isValid = errors.length === 0;

  return (
    <div
      className={`${styles.questionItem} ${!isValid && showValidation ? styles.invalid : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.number}>#{question.sortOrder}</span>
          <input
            type="text"
            name="name"
            value={question.name || ""}
            onChange={handleChange}
            onBlur={() => setShowValidation(true)}
            placeholder="Nhập tiêu đề câu hỏi"
            className={styles.nameInput}
          />
        </div>
        <div className={styles.actions}>
          <button
            onClick={() => onDuplicate(question)}
            className={styles.duplicateBtn}
            title="Nhân bản"
          >
            <MdContentCopy size={18} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className={styles.deleteBtn}
            title="Xóa"
          >
            <MdDelete size={20} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.details}>
          <div className={styles.formGroup}>
            <label>
              Mô tả <span className={styles.optional}>(không bắt buộc)</span>
            </label>
            <textarea
              name="description"
              value={question.description || ""}
              onChange={handleChange}
              placeholder="Thêm mô tả hoặc hướng dẫn cho câu hỏi"
              rows="2"
            />
          </div>

          <OptionList
            options={question.options || []}
            correctOptions={question.correctOptions || []}
            onOptionsChange={handleOptionsChange}
            onCorrectOptionsChange={handleCorrectOptionsChange}
            onBlur={() => setShowValidation(true)}
          />

          {showValidation && !isValid && (
            <div className={styles.validationMessage}>
              <MdWarning size={20} />
              <div>
                <strong>Vui lòng sửa các lỗi sau:</strong>
                <ul>
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;