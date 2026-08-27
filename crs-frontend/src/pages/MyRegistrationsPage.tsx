// path: crs-frontend/src/pages/MyRegistrationsPage.tsx

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration, type Registration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import type { Course } from '../types/course';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface RegistrationItem extends Registration {
    courseDetail?: Course;
}

export default function MyRegistrationsPage() {
    const [items, setItems] = useState<RegistrationItem[]>([]);
    const [loading, setLoading] = useState(true); // chỉ dùng cho lần tải đầu tiên
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const { toast, showToast, clearToast } = useToast();

    const fetchMyRegistrations = useCallback(async () => {
        try {
            const res = await getMyRegistrations();

            // Lấy thông tin chi tiết từng môn học tương ứng với courseId
            const fullData = await Promise.all(
                res.data.map(async (reg) => {
                    try {
                        const courseRes = await getCourseById(reg.courseId);
                        return { ...reg, courseDetail: courseRes.data };
                    } catch {
                        return reg;
                    }
                })
            );

            setItems(fullData);
        } catch (err) {
            let message = 'Không thể tải danh sách đăng ký!';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            // setLoading(false) chạy SAU await -> không còn bị flag bởi
            // react-hooks/set-state-in-effect, đồng thời không gây
            // màn hình "Đang tải..." che mất Toast khi refetch sau khi hủy
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchMyRegistrations();
    }, [fetchMyRegistrations]);

    const handleCancel = async (registrationId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đăng ký môn học này?')) return;
        setCancellingId(registrationId);
        try {
            await cancelRegistration(registrationId);
            showToast('Hủy đăng ký thành công!', 'success');
            fetchMyRegistrations(); // tải lại danh sách, không set loading=true nên không giật UI
        } catch (err) {
            let message = 'Hủy đăng ký thất bại!';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) return <div style={{ padding: 24 }}>Đang tải danh sách...</div>;

    return (
        <div style={{ padding: 24 }}>
            <h2>Danh sách môn học đã đăng ký</h2>

            {items.length === 0 ? (
                <p>Bạn chưa đăng ký môn học nào.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                    <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
                        <th>Mã ĐK</th>
                        <th>Tên môn học</th>
                        <th>Số tín chỉ</th>
                        <th>Ngày đăng ký</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>{item.id}</td>
                            <td>{item.courseDetail?.tenMonHoc || `Môn ID: ${item.courseId}`}</td>
                            <td>{item.courseDetail?.soTinChi ?? 'N/A'}</td>
                            <td>{new Date(item.ngayDangKy).toLocaleString('vi-VN')}</td>
                            <td>
                  <span style={{ color: item.trangThai === 'DA_DANG_KY' ? '#15803d' : '#b91c1c', fontWeight: 'bold' }}>
                    {item.trangThai === 'DA_DANG_KY' ? 'Đã đăng ký' : 'Đã hủy'}
                  </span>
                            </td>
                            <td>
                                {item.trangThai === 'DA_DANG_KY' && (
                                    <button
                                        onClick={() => handleCancel(item.id)}
                                        disabled={cancellingId === item.id}
                                        style={{
                                            backgroundColor: '#b91c1c',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '4px 8px',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {cancellingId === item.id ? 'Đang hủy...' : 'Hủy đăng ký'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}