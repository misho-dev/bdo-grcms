package com.bdo.bdogrcms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthTestController {
//    @Autowired
//    private JwtTokenProvider tokenProvider; // Assume this is a component that can generate tokens.
//
//    @GetMapping("/testToken")
//    public ResponseEntity<String> getTestToken() {
//        // Manually create a token for your user with 'viewassets:1' authority
//        String token = tokenProvider.createToken("yourUsernameHere", Collections.singletonList("viewassets:1"));
//        return ResponseEntity.ok(token);
//    }
}
