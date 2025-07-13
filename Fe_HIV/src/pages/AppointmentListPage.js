import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, isTokenExpired, handleUnauthorized } from '../services/authService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AppointmentListPage = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    // Thêm object để map status từ tiếng Anh sang tiếng Việt
    const statusMapping = {
        'Scheduled': 'Đã lên lịch',
        'Confirmed': 'Đã chấp nhận',
        'Cancelled': 'Đã hủy'
    };

    // Thêm object để map màu sắc cho từng status
    const statusColorMapping = {
        'Scheduled': 'bg-yellow-100 text-yellow-800',
        'Confirmed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = getToken();
            if (!token || isTokenExpired(token)) {
                handleUnauthorized();
                return;
            }

            const userDetails = JSON.parse(localStorage.getItem('userDetails'));
            
            if (!userDetails?.patientId) {
                setError('Không thể tải thông tin lịch hẹn. Vui lòng đăng nhập lại.');
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/Appointment/GetByPatientId/${userDetails.patientId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                setAppointments(response.data.data);
            } else {
                setError('Không thể tải danh sách lịch hẹn');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
            return;
        }

        try {
            const token = getToken();
            const response = await axios.put(
                `http://localhost:8080/api/Appointment/Update`,
                {
                    appointmentId: appointmentId,
                    status: 'Cancelled',
                    appointmentDate: null,
                    appointmentTime: null,
                    appointmentType: null,
                    doctorId: null,
                    testTypeId: null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status) {
                toast.success('Hủy lịch hẹn thành công');
                // Cập nhật state local để không cần gọi API lại
                setAppointments(appointments.map(apt => 
                    apt.appointmentId === appointmentId 
                        ? { ...apt, status: 'Cancelled' }
                        : apt
                ));
            } else {
                toast.error(response.data.message || 'Không thể hủy lịch hẹn');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            toast.error('Đã xảy ra lỗi khi hủy lịch hẹn');
        }
    };

    const handleUpdate = async (appointmentId) => {
        if (!newDate || !newTime) {
            toast.error('Vui lòng chọn ngày và giờ mới');
            return;
        }

        try {
            const token = getToken();
            const updatedAppointment = {
                appointmentId: appointmentId,
                appointmentDate: newDate,
                appointmentTime: newTime + ':00',
                status: 'Scheduled',
                appointmentType: editingAppointment.appointmentType,
                doctorId: editingAppointment.doctorId,
                testTypeId: editingAppointment.testTypeId
            };

            const response = await axios.put(
                `http://localhost:8080/api/Appointment/Update`,
                updatedAppointment,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status) {
                toast.success('Cập nhật lịch hẹn thành công');
                setShowEditModal(false);
                setEditingAppointment(null);
                // Cập nhật state local
                setAppointments(appointments.map(apt => 
                    apt.appointmentId === appointmentId 
                        ? { 
                            ...apt, 
                            appointmentDate: newDate,
                            appointmentTime: newTime + ':00',
                            status: 'Scheduled'
                        }
                        : apt
                ));
            } else {
                toast.error(response.data.message || 'Không thể cập nhật lịch hẹn');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật lịch hẹn');
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8" style={{ width: '81%' }}>
            <h1 className="text-2xl font-bold mb-6">Danh sách lịch hẹn</h1>

            {appointments.length === 0 ? (
                <p className="text-center text-gray-500">Bạn chưa có lịch hẹn nào</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bác sĩ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày hẹn
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giờ hẹn
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment.appointmentId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {appointment.doctorName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {appointment.appointmentTime.substring(0, 5)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMapping[appointment.status]}`}>
                                            {statusMapping[appointment.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {appointment.status === 'Scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => navigate(`/update-appointment/${appointment.appointmentId}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Cập nhật
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(appointment.appointmentId)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Hủy lịch
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal cập nhật lịch hẹn */}
            {showEditModal && editingAppointment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                Cập nhật lịch hẹn
                            </h3>
                            <div className="mt-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ngày hẹn mới
                                    </label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giờ hẹn mới
                                    </label>
                                    <input
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 space-x-3">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingAppointment(null);
                                    }}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleUpdate(editingAppointment.appointmentId)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Cập nhật 
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentListPage;