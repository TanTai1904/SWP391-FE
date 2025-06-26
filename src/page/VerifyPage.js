import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = `${process.env.REACT_APP_API_URL}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/Email/VerifyPatient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          verifyCode: verifyCode
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Xác thực thất bại');
      }

      // Xác thực thành công, chuyển hướng đến trang chủ
      navigate('/login');
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Lỗi</h2>
          <p className="mt-2">Không tìm thấy thông tin email để xác thực</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Xác thực email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng nhập mã xác thực đã được gửi đến email {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verifyCode" className="block text-sm font-medium text-gray-700">
              Mã xác thực
            </label>
            <input
              id="verifyCode"
              name="verifyCode"
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Nhập mã xác thực"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              // Gửi lại mã xác thực
              fetch(`${API_URL}/Email/SendEmail`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
              });
            }}
            className="text-sm text-red-600 hover:text-red-500"
          >
            Gửi lại mã xác thực
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage; 