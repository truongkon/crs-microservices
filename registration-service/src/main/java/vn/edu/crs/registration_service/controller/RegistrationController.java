package vn.edu.crs.registration_service.controller;

import vn.edu.crs.registration_service.dto.RegistrationRequestDTO;
import vn.edu.crs.registration_service.entity.Registration;
import vn.edu.crs.registration_service.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration register(@Valid @RequestBody RegistrationRequestDTO dto) {
        return registrationService.register(dto);
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id) {
        registrationService.cancel(id);
    }

    @GetMapping("/my")
    public List<Registration> getMyRegistrations(Authentication authentication) {
        // Đọc studentId từ credentials (đã được JwtAuthFilter lưu ở Bước A.4)
        Long studentId = (Long) authentication.getCredentials();
        return registrationService.getMyRegistrations(studentId);
    }
}