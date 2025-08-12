import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Users } from 'lucide-react';

function AuthGuard({ children }) {
  const { currentUser, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-6 sm:px-6 lg:px-4 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to
            </h2>
            <img
              src="public/Black_and_White_Minimal_Modern_Bold_Beauty_Logo__1_-removebg-preview.svg"
              alt="Logo"
              className="w-[25vw] pt-4 h-auto min-w-28 sm:w-[20vw] md:w-[18vw] lg:w-[15vw]"
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            Connect with fellow creators and build amazing projects together
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Get Started
                </h3>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Post your project ideas</li>
                  <li>• Find teammates with complementary skills</li>
                  <li>• Join exciting projects from other creators</li>
                  <li>• Build your network and collaborate</li>
                </ul>
              </div>
              
              <Button
                onClick={handleSignIn}
                className="w-full flex justify-center items-center space-x-2"
                size="lg"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In with Google</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default AuthGuard;

