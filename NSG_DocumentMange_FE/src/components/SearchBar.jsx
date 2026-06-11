import  { useState } from "react";
import { Input, Button } from "antd";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm); // Gọi hàm onSearch với giá trị tìm kiếm
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <Input
        placeholder="Nhập từ khóa tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onPressEnter={handleSearch} // Cho phép tìm kiếm khi nhấn Enter
        style={{ width: "300px" }}
      />
      <Button type="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;