package com.cryptovault.controller;

import com.cryptovault.entity.User;
import com.cryptovault.service.FileService;
import com.cryptovault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Autowired
    private com.cryptovault.repository.TransactionRepository transactionRepository;

    @GetMapping("/login")

    public String loginPage(@RequestParam(name = "error", required = false) String error,
                            @RequestParam(name = "logout", required = false) String logout,
                            Model model) {
        if (error != null) model.addAttribute("error", "Invalid username or password.");
        if (logout != null) model.addAttribute("message", "You have been logged out safely.");
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String doRegister(@RequestParam(name = "username") String username,
                             @RequestParam(name = "password") String password,
                             Model model) {
        try {
            userService.registerUser(username, password);
            return "redirect:/login?registered=true";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(Authentication auth, Model model) {
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        User user = userService.getUserByUsername(username);
        model.addAttribute("username", username);
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("user", user);
        model.addAttribute("files", fileService.getFilesForUser(username));
        model.addAttribute("transactions", transactionRepository.findByUsernameOrderByTimestampDesc(username));
        return "dashboard";
    }

    @GetMapping("/admin")
    public String adminPanel(Model model) {
        List<com.cryptovault.entity.Transaction> allTx = transactionRepository.findAll();
        double totalRevenue = allTx.stream().mapToDouble(com.cryptovault.entity.Transaction::getAmount).sum();
        
        model.addAttribute("users", userService.getAllUsers());
        model.addAttribute("files", fileService.getAllFiles());
        model.addAttribute("userCount", userService.getUserCount());
        model.addAttribute("fileCount", fileService.getTotalFileCount());
        model.addAttribute("totalRevenue", totalRevenue);
        return "admin";
    }

}
