import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const ViewListWorkSchedule = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Vui lòng đăng nhập để xem lịch làm việc');
                }

                if (!user?.doctorId) {
                    throw new Error('Không tìm thấy thông tin bác sĩ');
                }

                const response = await fetch(`${API_URL}/DoctorSchedule/GetByDoctorId/${user.doctorId}`, {
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

        if (user) {
            fetchSchedules();
        }
    }, [user]);

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
                        <h1 className="text-2xl font-semibold text-gray-900">Lịch làm việc </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Danh sách lịch làm việc của bác sĩ {user?.fullName}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                {schedules.length > 0 ? (
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm">Chưa có lịch làm việc nào được thiết lập</p>
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

export default ViewListWorkSchedule;
