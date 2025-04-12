import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}

export default Layout;