import { useState } from 'react';
import Login from '../components/Login';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kentrick AI</h1>
          <p className="text-primary-100">AI-Powered Document Analysis</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                !isRegister
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                isRegister
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <Login isRegister={isRegister} />
        </div>
      </div>
    </div>
  );
}
