import React from "react";
import Header from "./Header";

const Layout = ({ children, onAdminClick, onUserClick }) => {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
};

export default Layout;
