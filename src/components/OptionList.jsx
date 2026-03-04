import React from 'react';
import {
  MdAdd,
  MdArrowUpward,
  MdArrowDownward,
  MdDelete,
  MdCheck,
  MdWarning,
} from 'react-icons/md';
import styles from '../css/OptionList.module.css';

const OptionList = ({ 
  options, 
  correctOptions, 
  onOptionsChange, 
  onCorrectOptionsChange,
  onBlur
}) => {
  const addOption = () => {
    if (options.length >= 10) {
      alert('Tối đa 10 lựa chọn cho mỗi câu hỏi');
      return;
    }

    const newOption = {
      value: `opt${options.length + 1}`,
      label: '',
      sortOrder: options.length + 1
    };
    onOptionsChange([...options, newOption]);
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = options.map((opt, idx) => {
      if (idx === index) {
        return { ...opt, [field]: value };
      }
      return opt;
    });
    onOptionsChange(updatedOptions);
  };

  const deleteOption = (index) => {
    if (options.length <= 2) {
      alert('Câu hỏi phải có ít nhất 2 lựa chọn');
      return;
    }
    
    const optionToDelete = options[index];
    const filteredOptions = options.filter((_, idx) => idx !== index);
    
    const reorderedOptions = filteredOptions.map((opt, idx) => ({
      ...opt,
      sortOrder: idx + 1
    }));
    
    onOptionsChange(reorderedOptions);
    
    if (correctOptions.includes(optionToDelete.value)) {
      const newCorrectOptions = correctOptions.filter(v => v !== optionToDelete.value);
      onCorrectOptionsChange(newCorrectOptions);
    }
  };

  const moveOption = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === options.length - 1)
    ) {
      return;
    }

    const newOptions = [...options];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
    
    const reorderedOptions = newOptions.map((opt, idx) => ({
      ...opt,
      sortOrder: idx + 1
    }));
    
    onOptionsChange(reorderedOptions);
  };

  const sortedOptions = [...options].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className={styles.optionList}>
      <div className={styles.header}>
        <div>
          <h4>Lựa chọn</h4>
          <p className={styles.count}>
            {options.length} lựa chọn (tối thiểu 2)
          </p>
        </div>
        <button 
          onClick={addOption} 
          className={styles.addBtn}
          disabled={options.length >= 10}
        >
          <MdAdd size={18} />
          Thêm lựa chọn
        </button>
      </div>

      <div className={styles.container}>
        {sortedOptions.map((option, index) => (
          <div key={index} className={styles.optionItem}>
            <div className={styles.order}>
              <span className={styles.number}>{option.sortOrder}</span>
            </div>

            <div className={styles.fields}>
              <input
                type="text"
                value={option.value}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                onBlur={onBlur}
                placeholder="Giá trị (VD: A, B, C)"
                className={styles.valueInput}
              />
              <input
                type="text"
                value={option.label}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                onBlur={onBlur}
                placeholder="Nội dung (VD: Paris, 42, Đúng)"
                className={styles.labelInput}
              />
            </div>

            <div className={styles.actions}>
              <label className={`${styles.checkbox} ${correctOptions.includes(option.value) ? styles.checked : ''}`}>
                <input
                  type="checkbox"
                  checked={correctOptions.includes(option.value)}
                  onChange={() => onCorrectOptionsChange(option.value)}
                  onBlur={onBlur}
                />
                <MdCheck size={16} />
                <span>Đúng</span>
              </label>
              <button 
                onClick={() => deleteOption(index)}
                className={styles.deleteBtn}
                title="Xóa"
                disabled={options.length <= 2}
              >
                <MdDelete size={18} />
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tổng lựa chọn:</span>
          <span className={styles.summaryValue}>{options.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Đáp án đúng:</span>
          <span className={styles.summaryValue}>{correctOptions.length}</span>
        </div>
        {correctOptions.length === 0 && (
          <div className={styles.warning}>
            <MdWarning size={16} />
            <span>Chọn ít nhất một đáp án đúng</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionList;