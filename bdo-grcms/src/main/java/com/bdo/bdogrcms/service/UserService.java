package com.bdo.bdogrcms.service;

import com.bdo.bdogrcms.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> findAllUsers();

    Optional<User> findUserById(Long id);

    User saveUser(User user);

    void deleteUser(Long id);
}
