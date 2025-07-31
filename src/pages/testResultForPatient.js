import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, handleUnauthorized } from '../services/authService';
import { FaArrowLeft, FaFlask, FaCalendarAlt, FaUserMd, FaNotesMedical, FaExclamationTriangle } from 'react-icons/fa';

const TestResultForPatient = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [testResult, setTestResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchTestResult();
    }, [appointmentId]);

    const fetchTestResult = async () => {
        try {
            const token = getToken();
            if (!token || isTokenExpired(token)) {
                handleUnauthorized();
                return;
            }

            const response = await axios.get(
                `${API_URL}/api/TestResult/GetAll`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                const matchingResult = response.data.data.find(
                    t => t.appointmentId.toString() === appointmentId
                );
                
                if (matchingResult) {
                    setTestResult(matchingResult);
                } else {
                    setError('Không tìm thấy kết quả xét nghiệm cho lịch hẹn này');
                }
            } else {
                setError('Không thể tải kết quả xét nghiệm');
            }
        } catch (error) {
            console.error('Error fetching test result:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Đã xảy ra lỗi khi tải kết quả xét nghiệm');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <FaExclamationTriangle className="mx-auto text-5xl mb-4" />
                    <p className="text-xl">{error}</p>
                    <button 
                        onClick={() => navigate('/appointments/list')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Quay lại danh sách lịch hẹn
                    </button>
                </div>
            </div>
        );
    }

    if (!testResult) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500 text-center">
                    <FaNotesMedical className="mx-auto text-5xl mb-4" />
                    <p className="text-xl">Không tìm thấy kết quả xét nghiệm</p>
                    <button 
                        onClick={() => navigate('/appointments/list')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Quay lại danh sách lịch hẹn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Kết quả xét nghiệm</h1>
                    <button 
                        onClick={() => navigate('/appointments/list')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        <span>Quay lại</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-blue-500 text-white px-6 py-4">
                        <h2 className="text-xl font-semibold">{testResult.testTypeName}</h2>
                        <p className="text-blue-100 mt-1">Mã xét nghiệm: #{testResult.testResultId}</p>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Patient Info Section */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-4">
                                <FaCalendarAlt className="text-blue-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Thông tin lịch hẹn</h3>
                                    <p className="text-gray-600">Ngày: {new Date(testResult.appointmentDate).toLocaleDateString('vi-VN')}</p>
                                    <p className="text-gray-600">Giờ: {testResult.appointmentTime}</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-start gap-4">
                                <FaUserMd className="text-green-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Thông tin bệnh nhân</h3>
                                    <p className="text-gray-600">Bệnh nhân: {testResult.patientName}</p>
                                    <p className="text-gray-600">Nhóm máu: {testResult.bloodType}</p>
                                </div>
                            </div>
                        </div>

                        {/* Test Result Section */}
                        <div className="mb-8">
                            <div className="bg-purple-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FaFlask className="text-purple-500 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-900">Kết quả xét nghiệm</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                                            <p className="text-sm text-gray-500">Giá trị</p>
                                            <p className="text-lg font-semibold text-purple-600">{testResult.resultValue} {testResult.unit}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                                            <p className="text-sm text-gray-500">Phạm vi bình thường</p>
                                            <p className="text-gray-700">{testResult.normalRange}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaNotesMedical className="text-gray-600 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-900">Ghi chú</h3>
                                </div>
                                <p className="text-gray-700">{testResult.notes}</p>
                                {testResult.specialNotes && (
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <p className="text-yellow-800">{testResult.specialNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResultForPatient;
