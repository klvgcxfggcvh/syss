package mil.army.cop.auth.service;

import mil.army.cop.auth.dto.UserDto;
import mil.army.cop.auth.entity.User;
import mil.army.cop.auth.repository.UserRepository;
import mil.army.cop.shared.exception.CopException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<UserDto> getUserById(UUID id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<UserDto> getUserByKeycloakId(String keycloakId) {
        return userRepository.findByKeycloakId(keycloakId)
                .map(this::convertToDto);
    }

    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }

    public List<UserDto> getUsersByUnit(String unit) {
        return userRepository.findByUnit(unit).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserDto createUser(UserDto userDto) {
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            throw new CopException("User with username already exists", "USER_EXISTS");
        }

        User user = convertToEntity(userDto);
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public UserDto updateUser(UUID id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new CopException("User not found", "USER_NOT_FOUND"));

        existingUser.setEmail(userDto.getEmail());
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setRank(userDto.getRank());
        existingUser.setUnit(userDto.getUnit());
        existingUser.setRoles(userDto.getRoles());
        existingUser.setActive(userDto.getActive());

        User savedUser = userRepository.save(existingUser);
        return convertToDto(savedUser);
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new CopException("User not found", "USER_NOT_FOUND");
        }
        userRepository.deleteById(id);
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRank(),
                user.getUnit(),
                user.getRoles(),
                user.getActive()
        );
    }

    private User convertToEntity(UserDto dto) {
        return new User(
                null, // keycloakId will be set separately
                dto.getUsername(),
                dto.getEmail(),
                dto.getFirstName(),
                dto.getLastName(),
                dto.getRank(),
                dto.getUnit(),
                dto.getRoles()
        );
    }
}
