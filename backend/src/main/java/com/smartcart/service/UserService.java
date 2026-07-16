package com.smartcart.service;

import com.smartcart.dto.PageResponse;
import com.smartcart.dto.UserDto;
import com.smartcart.entity.User;
import com.smartcart.exception.BadRequestException;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.UserRepository;
import com.smartcart.security.SecurityUtils;
import com.smartcart.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;

    public UserDto getProfile() {
        return mapper.toUserDto(securityUtils.getCurrentUser());
    }

    @Transactional
    public UserDto updateProfile(UserDto request) {
        User user = securityUtils.getCurrentUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        return mapper.toUserDto(userRepository.save(user));
    }

    public PageResponse<UserDto> getAllUsers(int page, int size) {
        Page<UserDto> users = userRepository.findAllByOrderByCreatedAtDesc(
                PageUtils.createPageable(page, size, "createdAt", "desc"))
                .map(mapper::toUserDto);
        return mapper.toPageResponse(users);
    }

    public UserDto getUserById(Long id) {
        return mapper.toUserDto(findUserById(id));
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto request) {
        User user = findUserById(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        return mapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public UserDto toggleUserStatus(Long id) {
        User user = findUserById(id);
        User currentUser = securityUtils.getCurrentUser();
        if (user.getId().equals(currentUser.getId())) {
            throw new BadRequestException("Cannot disable your own account");
        }
        user.setEnabled(!user.getEnabled());
        return mapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = findUserById(id);
        User currentUser = securityUtils.getCurrentUser();
        if (user.getId().equals(currentUser.getId())) {
            throw new BadRequestException("Cannot delete your own account");
        }
        userRepository.delete(user);
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
