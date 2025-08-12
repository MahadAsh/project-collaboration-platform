// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from "./components/ui/sonner";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import AuthGuard from "./components/AuthGuard";
import ProjectList from "./components/ProjectList";
import About from "./components/About";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <ProjectList />
                    </AuthGuard>
                  }
                />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
