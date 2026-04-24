package com.cryptovault.controller;

import com.cryptovault.entity.User;
import com.cryptovault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/subscription")
public class SubscriptionController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.cryptovault.repository.TransactionRepository transactionRepository;

    @GetMapping
    public String subscriptionPage(Authentication auth, Model model) {
        User user = userService.getUserByUsername(auth.getName());
        model.addAttribute("user", user);
        return "subscription";
    }

    @PostMapping("/upgrade")
    public String upgradePlan(@RequestParam("plan") String plan,
                              @RequestParam("paymentMethod") String paymentMethod,
                              Authentication auth) {
        userService.updateSubscription(auth.getName(), plan, paymentMethod);
        
        // Record transaction
        double amount = 0;
        if ("WEEKLY".equals(plan)) amount = 5.0;
        else if ("MONTHLY".equals(plan)) amount = 15.0;
        else if ("ANNUALLY".equals(plan)) amount = 120.0;
        
        transactionRepository.save(new com.cryptovault.entity.Transaction(auth.getName(), plan, amount, paymentMethod));
        
        return "redirect:/subscription?success=true";
    }


    @GetMapping("/kyc")
    public String kycPage(Authentication auth, Model model) {
        User user = userService.getUserByUsername(auth.getName());
        model.addAttribute("user", user);
        return "kyc";
    }

    @PostMapping("/kyc/verify")
    public String verifyKyc(Authentication auth) {
        // In a real app, this would involve document processing
        // Here we simulate successful verification
        userService.updateKyc(auth.getName(), true);
        return "redirect:/subscription/kyc?verified=true";
    }
}
