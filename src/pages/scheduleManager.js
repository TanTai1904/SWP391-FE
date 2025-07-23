import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const ScheduleManager = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { doctorId } = useParams(); // Lấy doctorId từ URL
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState(null);

    // Chuyển đổi ngày trong tuần sang tiếng Việt
    const getDayInVietnamese = (day) => {
        const dayMap = {
            'Monday': 'Thứ Hai',
            'Tuesday': 'Thứ Ba',
            'Wednesday': 'Thứ Tư',
            'Thursday': 'Thứ Năm',
            'Friday': 'Thứ Sáu',
            'Saturday': 'Thứ Bảy',
            'Sunday': 'Chủ Nhật'
        };
        return dayMap[day] || day;
    };

    // Fetch thông tin bác sĩ nếu có doctorId từ URL
    const fetchDoctorInfo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/Doctor/GetById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.status) {
                setDoctorInfo(data.data);
            }
        } catch (err) {
            console.error('Error fetching doctor info:', err);
        }
    };

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để xem lịch làm việc');
            }

            let endpoint;
            // Xác định endpoint dựa vào role và doctorId
            if (doctorId) {
                // Nếu có doctorId từ URL (admin/manager xem lịch của bác sĩ cụ thể)
                endpoint = `${API_URL}/DoctorSchedule/GetByDoctorId/${doctorId}`;
                fetchDoctorInfo(doctorId);
            } else if (user.role === 'Doctor' && user.doctorId) {
                // Bác sĩ xem lịch của chính mình
                endpoint = `${API_URL}/DoctorSchedule/GetByDoctorId/${user.doctorId}`;
            } else if (['Admin', 'Manager', 'Staff'].includes(user.role)) {
                // Admin/Manager xem tất cả lịch
                endpoint = `${API_URL}/DoctorSchedule/GetAll`;
            } else {
                throw new Error('Bạn không có quyền truy cập trang này');
            }

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải lịch làm việc');
            }

            const data = await response.json();
            if (data.status && data.data) {
                // Sắp xếp lịch theo thứ tự các ngày trong tuần
                const sortedSchedules = data.data.sort((a, b) => {
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    return days.indexOf(a.workDay) - days.indexOf(b.workDay);
                });
                setSchedules(sortedSchedules);
            }
        } catch (err) {
            console.error('Error fetching schedules:', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSchedules();
        }
    }, [user, doctorId]);

    const handleDelete = async () => {
        if (!selectedSchedule) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để xóa lịch làm việc');
            }

            const response = await fetch(`${API_URL}/DoctorSchedule/Delete/${selectedSchedule.scheduleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.status) {
                toast.success('Xóa lịch làm việc thành công');
                // Refresh danh sách lịch làm việc
                fetchSchedules();
            } else {
                throw new Error(data.message || 'Không thể xóa lịch làm việc');
            }
        } catch (err) {
            console.error('Error deleting schedule:', err);
            toast.error(err.message);
        } finally {
            setShowDeleteModal(false);
            setSelectedSchedule(null);
        }
    };

    const openDeleteModal = (schedule) => {
        setSelectedSchedule(schedule);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Lịch làm việc</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            {doctorInfo 
                                ? `Danh sách lịch làm việc của bác sĩ ${doctorInfo.fullName}`
                                : user.role === 'Doctor'
                                    ? `Danh sách lịch làm việc của bác sĩ ${user?.fullName}`
                                    : 'Danh sách lịch làm việc của tất cả bác sĩ'
                            }
                        </p>
                    </div>
                    {(user.role === 'Doctor' || doctorId) && (
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={() => navigate(`/schedule/create/${doctorId}`)}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                            >
                                Thêm lịch làm việc
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Thứ
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Giờ bắt đầu
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Giờ kết thúc
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {schedules.map((schedule) => (
                                            <tr key={schedule.scheduleId}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {getDayInVietnamese(schedule.workDay)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {schedule.startTime}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {schedule.endTime}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/update-schedule/${schedule.scheduleId}`)}
                                                            className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(schedule)}
                                                            className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                                                        >
                                                            Xóa 
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Xác nhận xóa */}
            {showDeleteModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Xác nhận xóa
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Bạn có chắc chắn muốn xóa lịch làm việc {selectedSchedule && getDayInVietnamese(selectedSchedule.workDay)} không?
                                            Hành động này không thể hoàn tác.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleDelete}
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedSchedule(null);
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManager;
