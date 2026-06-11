import { useEffect, useRef } from 'react';

/**
 * Component wrapper để xử lý phím Enter cho nút Lọc
 * @param {React.ReactNode} children - Nội dung form lọc
 * @param {Function} onSearch - Hàm được gọi khi nhấn Enter hoặc click nút Lọc
 * @param {Array} excludeSelectors - Các selector để loại trừ khỏi việc lắng nghe Enter (ví dụ: textarea, select đang mở)
 */
const FilterFormWrapper = ({ children, onSearch, excludeSelectors = [] }) => {
  const formRef = useRef(null);

  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement || !onSearch) return;

    const handleKeyDown = (e) => {
      // Chỉ xử lý khi nhấn Enter
      if (e.key !== 'Enter') return;

      // Kiểm tra nếu đang focus vào các element không nên trigger search
      const target = e.target;
      const tagName = target.tagName.toLowerCase();
      
      // Bỏ qua nếu đang ở textarea
      if (tagName === 'textarea') return;
      
      // Bỏ qua nếu đang ở button (để tránh double trigger)
      if (tagName === 'button') return;
      
      // Bỏ qua nếu đang ở select đang mở dropdown
      if (tagName === 'select' || target.closest('.ant-select-dropdown')) return;
      
      // Bỏ qua nếu đang ở DatePicker đang mở
      if (target.closest('.ant-picker-dropdown')) return;
      
      // Kiểm tra các exclude selectors
      const shouldExclude = excludeSelectors.some(selector => {
        if (typeof selector === 'string') {
          return target.closest(selector);
        }
        if (typeof selector === 'function') {
          return selector(target);
        }
        return false;
      });
      
      if (shouldExclude) return;

      // Ngăn chặn hành vi mặc định (submit form nếu có)
      e.preventDefault();
      e.stopPropagation();
      
      // Gọi hàm search
      onSearch();
    };

    formElement.addEventListener('keydown', handleKeyDown);

    return () => {
      formElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSearch, excludeSelectors]);

  return (
    <div ref={formRef}>
      {children}
    </div>
  );
};

export default FilterFormWrapper;

