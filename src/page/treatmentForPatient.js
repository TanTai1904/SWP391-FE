import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, handleUnauthorized } from '../services/authService';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaUserMd, FaNotesMedical, FaPills, FaClipboardList, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const TreatmentForPatient = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [treatment, setTreatment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchTreatmentDetails();
    }, [appointmentId]);

    const fetchTreatmentDetails = async () => {
        try {
            const token = getToken();
            if (!token || isTokenExpired(token)) {
                handleUnauthorized();
                return;
            }

            const response = await axios.get(
                `${API_URL}/api/Treatment/GetAll`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                const matchingTreatment = response.data.data.find(
                    t => t.appointmentId.toString() === appointmentId
                );
                
                if (matchingTreatment) {
                    setTreatment(matchingTreatment);
                } else {
                    setError('Không tìm thấy thông tin phác đồ cho lịch hẹn này');
                }
            } else {
                setError('Không thể tải thông tin phác đồ');
            }
        } catch (error) {
            console.error('Error fetching treatment:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Đã xảy ra lỗi khi tải thông tin phác đồ');
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

    if (!treatment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500 text-center">
                    <FaNotesMedical className="mx-auto text-5xl mb-4" />
                    <p className="text-xl">Không tìm thấy thông tin phác đồ</p>
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
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết phác đồ điều trị</h1>
                    <button 
                        onClick={() => navigate('/appointments/list')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <FaArrowLeft className="text-white" />
                        <span>Quay lại</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-blue-500 text-white px-6 py-4">
                        <h2 className="text-xl font-semibold">{treatment.regimenName}</h2>
                        <p className="text-blue-100 mt-1">{treatment.description}</p>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Timeline Section */}
                        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-4">
                                <FaCalendarAlt className="text-blue-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Thời gian điều trị</h3>
                                    <p className="text-gray-600">Bắt đầu: {new Date(treatment.startDate).toLocaleDateString('vi-VN')}</p>
                                    <p className="text-gray-600">Kết thúc: {new Date(treatment.endDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 flex items-start gap-4">
                                <FaUserMd className="text-green-500 text-2xl mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Bác sĩ phụ trách</h3>
                                    <p className="text-gray-600">{treatment.doctorName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Components Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FaPills className="text-purple-500 text-xl" />
                                <h3 className="text-lg font-semibold text-gray-900">Thành phần điều trị</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 1, name: treatment.component1Name },
                                    { id: 2, name: treatment.component2Name },
                                    { id: 3, name: treatment.component3Name },
                                    { id: 4, name: treatment.component4Name }
                                ].filter(comp => comp.name).map((component) => (
                                    <div 
                                        key={component.id}
                                        className="bg-purple-50 rounded-lg p-4 border border-purple-100"
                                    >
                                        <span className="text-purple-600">{component.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="space-y-6">
                            <div className="bg-yellow-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaClipboardList className="text-yellow-600 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn sử dụng</h3>
                                </div>
                                <p className="text-gray-700">{treatment.usageInstructions}</p>
                            </div>

                            <div className="bg-red-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaExclamationTriangle className="text-red-500 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-900">Tác dụng phụ có thể gặp</h3>
                                </div>
                                <p className="text-gray-700">{treatment.sideEffects}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaNotesMedical className="text-gray-600 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-900">Ghi chú bổ sung</h3>
                                </div>
                                <p className="text-gray-700">{treatment.notes}</p>
                                {treatment.specialNotes && (
                                    <p className="mt-2 text-gray-700">{treatment.specialNotes}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreatmentForPatient;
