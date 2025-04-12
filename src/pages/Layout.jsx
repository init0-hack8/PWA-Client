import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default Layout;