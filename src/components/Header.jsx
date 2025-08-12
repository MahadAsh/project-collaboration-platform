import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import NotificationSystem from "./NotificationSystem";

function Header() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAboutClick = () => {
    // Open About page in a new tab
    window.open('/about', '_blank');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-46 lg:h-46 pt-2">
              <img
                src="public/Black_and_White_Minimal_Modern_Bold_Beauty_Logo__1_-removebg-preview.svg"
                alt="Logo"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <NotificationSystem />
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.displayName}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
                <Button
                  onClick={handleAboutClick}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-gray-900"
                >
                  About
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleSignIn}
                className="flex items-center space-x-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Google</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mobile Notifications */}
                  <div className="px-3 py-2">
                    <NotificationSystem />
                  </div>
                  
                  {/* Mobile Menu Items */}
                  <Button
                    onClick={handleAboutClick}
                    variant="ghost"
                    className="w-full justify-start text-left px-3 py-2"
                  >
                    About
                  </Button>
                  
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full justify-start text-left px-3 py-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSignIn}
                  className="w-full justify-start text-left px-3 py-2"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In with Google
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
