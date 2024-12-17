import React, { createContext, useEffect, useState } from 'react';

// 1. Tạo Context
export const AppContext = createContext();

// 2. Tạo Provider
export const AppProvider = ({ children }) => {
  // Khai báo state hoặc giá trị cần chia sẻ
  const [user, setUser] = useState({ name: "Guest", isLoggedIn: false });
  const [theme, setTheme] = useState("light");
  const [selectedOrder, setselectedOrder] = useState();
  const [selectedOrderCode, setselectedOrderCode] = useState("");


  useEffect(() => {
    console.log("selectedOrder: ", selectedOrder)
  }, [selectedOrder])
  

  // Hàm cập nhật dữ liệu trong context
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        toggleTheme,
        selectedOrder,
        setselectedOrder,
        selectedOrderCode,
        setselectedOrderCode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};