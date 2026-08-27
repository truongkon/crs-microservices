// path: crs-frontend/src/api/registrationApi.ts

import axiosClient from './axiosClient';

export interface Registration {
    id: number;
    studentId: number;
    courseId: number;
    trangThai: 'DA_DANG_KY' | 'DA_HUY';
    ngayDangKy: string;
}

export interface RegisterPayload {
    studentId: number;
    courseId: number;
}

export const registerCourse = (payload: RegisterPayload) => {
    return axiosClient.post<Registration>('/api/registrations', payload);
};

export const cancelRegistration = (id: number) => {
    return axiosClient.delete(`/api/registrations/${id}`);
};

// BỔ SUNG THEO BÀI 9: Lấy danh sách đăng ký của chính sinh viên đang đăng nhập
export const getMyRegistrations = () => {
    return axiosClient.get<Registration[]>('/api/registrations/my');
};