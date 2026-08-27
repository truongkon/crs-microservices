package vn.edu.crs.registration_service.service;

import vn.edu.crs.registration_service.client.CourseClient;
import vn.edu.crs.registration_service.dto.RegistrationRequestDTO;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String DA_DANG_KY = "DA_DANG_KY";
    private static final String DA_HUY = "DA_HUY";

    private final RegistrationRepository registrationRepository;
    private final CourseClient courseClient;

    public Registration register(RegistrationRequestDTO dto) {
        if (registrationRepository.existsByStudentIdAndCourseIdAndTrangThai(
                dto.getStudentId(), dto.getCourseId(), DA_DANG_KY)) {
            throw new IllegalStateException("Sinh vien da dang ky mon hoc nay roi");
        }

        // Bước 1: Gọi sang course-service để trừ chỗ TRƯỚC.
        courseClient.reserveSeat(dto.getCourseId());

        // Bước 2: Chỉ lưu Registration SẢU KHI course-service xác nhận thành công.
        Registration registration = new Registration();
        registration.setStudentId(dto.getStudentId());
        registration.setCourseId(dto.getCourseId());
        registration.setTrangThai(DA_DANG_KY);
        registration.setNgayDangKy(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public void cancel(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay dang ky id = " + registrationId));

        if (DA_HUY.equals(registration.getTrangThai())) {
            throw new IllegalStateException("Dang ky nay da duoc huy truoc do");
        }

        // Gọi sang course-service để hoàn trả chỗ TRƯỚC khi đổi trạng thái
        courseClient.releaseSeat(registration.getCourseId());

        registration.setTrangThai(DA_HUY);
        registrationRepository.save(registration);
    }

    // =========================================================================
    // THÊM MỚI THEO BÀI 9 (MỤC B): Lấy danh sách môn học đã đăng ký của 1 sinh viên
    // =========================================================================
    public List<Registration> getMyRegistrations(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
}