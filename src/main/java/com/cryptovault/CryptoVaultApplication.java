package com.cryptovault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CryptoVaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(CryptoVaultApplication.class, args);
        System.out.println("-----------------------------------------------------------");
        System.out.println("CryptoVault: Secure File Storage System is running...");
        System.out.println("-----------------------------------------------------------");
    }

}
