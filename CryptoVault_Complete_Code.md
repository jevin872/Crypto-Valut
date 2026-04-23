\# CryptoVault – Complete Source Code



\*\*Project:\*\* CryptoVault: Secure File Storage System with AES Encryption

\*\*Framework:\*\* Spring Boot 3.2.3 | Java 17 | AES-128 Encryption

\*\*Author:\*\* Jevin



\---



\## Table of Contents

1\. pom.xml

2\. application.properties

3\. CryptoVaultApplication.java

4\. SecurityConfig.java

5\. DataInitializer.java

6\. User.java

7\. FileMetadata.java

8\. UserRepository.java

9\. FileMetadataRepository.java

10\. UserService.java

11\. FileService.java

12\. AESUtils.java

13\. FileStorageException.java

14\. GlobalExceptionHandler.java

15\. AuthController.java

16\. FileController.java

17\. index.html

18\. login.html

19\. register.html

20\. dashboard.html

21\. admin.html

22\. AESUtilsTest.java



\---



\## 1. pom.xml



```xml

<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"

&#x20;   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

&#x20;   xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

&#x20;   <modelVersion>4.0.0</modelVersion>

&#x20;   <parent>

&#x20;       <groupId>org.springframework.boot</groupId>

&#x20;       <artifactId>spring-boot-starter-parent</artifactId>

&#x20;       <version>3.2.3</version>

&#x20;       <relativePath/>

&#x20;   </parent>

&#x20;   <groupId>com.cryptovault</groupId>

&#x20;   <artifactId>crypto-vault</artifactId>

&#x20;   <version>0.0.1-SNAPSHOT</version>

&#x20;   <name>CryptoVault: Secure File Storage System with AES Encryption</name>

&#x20;   <description>Spring Boot project for secure file storage with AES encryption</description>

&#x20;   <properties>

&#x20;       <java.version>17</java.version>

&#x20;   </properties>

&#x20;   <dependencies>

&#x20;       <dependency>

&#x20;           <groupId>org.springframework.boot</groupId>

&#x20;           <artifactId>spring-boot-starter-data-jpa</artifactId>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>org.springframework.boot</groupId>

&#x20;           <artifactId>spring-boot-starter-web</artifactId>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>com.h2database</groupId>

&#x20;           <artifactId>h2</artifactId>

&#x20;           <scope>runtime</scope>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>org.springframework.boot</groupId>

&#x20;           <artifactId>spring-boot-starter-security</artifactId>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>org.springframework.boot</groupId>

&#x20;           <artifactId>spring-boot-starter-thymeleaf</artifactId>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>org.thymeleaf.extras</groupId>

&#x20;           <artifactId>thymeleaf-extras-springsecurity6</artifactId>

&#x20;       </dependency>

&#x20;       <dependency>

&#x20;           <groupId>org.springframework.boot</groupId>

&#x20;           <artifactId>spring-boot-starter-test</artifactId>

&#x20;           <scope>test</scope>

&#x20;       </dependency>

&#x20;   </dependencies>

&#x20;   <build>

&#x20;       <plugins>

&#x20;           <plugin>

&#x20;               <groupId>org.springframework.boot</groupId>

&#x20;               <artifactId>spring-boot-maven-plugin</artifactId>

&#x20;           </plugin>

&#x20;       </plugins>

&#x20;   </build>

</project>

```



\---



\## 2. application.properties

Path: src/main/resources/application.properties



```properties

spring.application.name=crypto-vault

spring.datasource.url=jdbc:h2:mem:cryptovault\_db

spring.datasource.driverClassName=org.h2.Driver

spring.datasource.username=sa

spring.datasource.password=password



spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true

spring.jpa.properties.hibernate.format\_sql=true



spring.servlet.multipart.max-file-size=10MB

spring.servlet.multipart.max-request-size=10MB



file.upload-dir=./uploads

```



\---



\## 3. CryptoVaultApplication.java

Path: src/main/java/com/cryptovault/CryptoVaultApplication.java



```java

package com.cryptovault;



import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;



@SpringBootApplication

public class CryptoVaultApplication {

&#x20;   public static void main(String\[] args) {

&#x20;       SpringApplication.run(CryptoVaultApplication.class, args);

&#x20;       System.out.println("-----------------------------------------------------------");

&#x20;       System.out.println("CryptoVault: Secure File Storage System is running...");

&#x20;       System.out.println("-----------------------------------------------------------");

&#x20;   }

}

```



\---



\## 4. SecurityConfig.java

Path: src/main/java/com/cryptovault/config/SecurityConfig.java



```java

package com.cryptovault.config;



import com.cryptovault.service.UserService;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;



@Configuration

@EnableWebSecurity

public class SecurityConfig {



&#x20;   @Bean

&#x20;   public BCryptPasswordEncoder passwordEncoder() {

&#x20;       return new BCryptPasswordEncoder();

&#x20;   }



&#x20;   @Bean

&#x20;   public DaoAuthenticationProvider authProvider(UserService userService) {

&#x20;       DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

&#x20;       provider.setUserDetailsService(userService);

&#x20;       provider.setPasswordEncoder(passwordEncoder());

&#x20;       return provider;

&#x20;   }



&#x20;   @Bean

&#x20;   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

&#x20;       http

&#x20;           .authorizeHttpRequests(auth -> auth

&#x20;               .requestMatchers("/", "/register", "/login", "/css/\*\*", "/js/\*\*").permitAll()

&#x20;               .requestMatchers("/admin/\*\*").hasRole("ADMIN")

&#x20;               .anyRequest().authenticated()

&#x20;           )

&#x20;           .formLogin(form -> form

&#x20;               .loginPage("/login")

&#x20;               .defaultSuccessUrl("/dashboard", true)

&#x20;               .failureUrl("/login?error=true")

&#x20;               .permitAll()

&#x20;           )

&#x20;           .logout(logout -> logout

&#x20;               .logoutSuccessUrl("/login?logout=true")

&#x20;               .permitAll()

&#x20;           )

&#x20;           .csrf(csrf -> csrf.ignoringRequestMatchers("/api/\*\*"));

&#x20;       return http.build();

&#x20;   }

}

```



\---



\## 5. DataInitializer.java

Path: src/main/java/com/cryptovault/config/DataInitializer.java



```java

package com.cryptovault.config;



import com.cryptovault.entity.User;

import com.cryptovault.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.stereotype.Component;



@Component

public class DataInitializer implements CommandLineRunner {



&#x20;   @Autowired

&#x20;   private UserRepository userRepository;



&#x20;   @Autowired

&#x20;   private BCryptPasswordEncoder passwordEncoder;



&#x20;   @Override

&#x20;   public void run(String... args) {

&#x20;       if (!userRepository.existsByUsername("admin")) {

&#x20;           User admin = new User("admin", passwordEncoder.encode("admin123"), "ROLE\_ADMIN");

&#x20;           userRepository.save(admin);

&#x20;           System.out.println(">>> Default admin created: username=admin, password=admin123");

&#x20;       }

&#x20;   }

}

```



\---



\## 6. User.java

Path: src/main/java/com/cryptovault/entity/User.java



```java

package com.cryptovault.entity;



import jakarta.persistence.\*;



@Entity

@Table(name = "users")

public class User {



&#x20;   @Id

&#x20;   @GeneratedValue(strategy = GenerationType.IDENTITY)

&#x20;   private Long id;



&#x20;   @Column(unique = true, nullable = false)

&#x20;   private String username;



&#x20;   @Column(nullable = false)

&#x20;   private String password;



&#x20;   @Column(nullable = false)

&#x20;   private String role;



&#x20;   public User() {}



&#x20;   public User(String username, String password, String role) {

&#x20;       this.username = username;

&#x20;       this.password = password;

&#x20;       this.role = role;

&#x20;   }



&#x20;   public Long getId() { return id; }

&#x20;   public void setId(Long id) { this.id = id; }

&#x20;   public String getUsername() { return username; }

&#x20;   public void setUsername(String username) { this.username = username; }

&#x20;   public String getPassword() { return password; }

&#x20;   public void setPassword(String password) { this.password = password; }

&#x20;   public String getRole() { return role; }

&#x20;   public void setRole(String role) { this.role = role; }

}

```



\---



\## 7. FileMetadata.java

Path: src/main/java/com/cryptovault/entity/FileMetadata.java



```java

package com.cryptovault.entity;



import jakarta.persistence.\*;

import java.time.LocalDateTime;



@Entity

@Table(name = "file\_metadata")

public class FileMetadata {



&#x20;   @Id

&#x20;   @GeneratedValue(strategy = GenerationType.IDENTITY)

&#x20;   private Long id;



&#x20;   @Column(name = "file\_name", nullable = false)

&#x20;   private String fileName;



&#x20;   @Column(name = "file\_path", nullable = false)

&#x20;   private String filePath;



&#x20;   @Column(name = "file\_size", nullable = false)

&#x20;   private Long fileSize;



&#x20;   @Column(name = "upload\_time", nullable = false)

&#x20;   private LocalDateTime uploadTime;



&#x20;   @Column(name = "uploaded\_by")

&#x20;   private String uploadedBy;



&#x20;   public FileMetadata() {}



&#x20;   public FileMetadata(String fileName, String filePath, Long fileSize, LocalDateTime uploadTime) {

&#x20;       this.fileName = fileName;

&#x20;       this.filePath = filePath;

&#x20;       this.fileSize = fileSize;

&#x20;       this.uploadTime = uploadTime;

&#x20;   }



&#x20;   public Long getId() { return id; }

&#x20;   public void setId(Long id) { this.id = id; }

&#x20;   public String getFileName() { return fileName; }

&#x20;   public void setFileName(String fileName) { this.fileName = fileName; }

&#x20;   public String getFilePath() { return filePath; }

&#x20;   public void setFilePath(String filePath) { this.filePath = filePath; }

&#x20;   public Long getFileSize() { return fileSize; }

&#x20;   public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

&#x20;   public LocalDateTime getUploadTime() { return uploadTime; }

&#x20;   public void setUploadTime(LocalDateTime uploadTime) { this.uploadTime = uploadTime; }

&#x20;   public String getUploadedBy() { return uploadedBy; }

&#x20;   public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

}

```



\---



\## 8. UserRepository.java

Path: src/main/java/com/cryptovault/repository/UserRepository.java



```java

package com.cryptovault.repository;



import com.cryptovault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;



@Repository

public interface UserRepository extends JpaRepository<User, Long> {

&#x20;   Optional<User> findByUsername(String username);

&#x20;   boolean existsByUsername(String username);

}

```



\---



\## 9. FileMetadataRepository.java

Path: src/main/java/com/cryptovault/repository/FileMetadataRepository.java



```java

package com.cryptovault.repository;



import com.cryptovault.entity.FileMetadata;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;



@Repository

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

&#x20;   List<FileMetadata> findByUploadedBy(String username);

}

```



\---



\## 10. UserService.java

Path: src/main/java/com/cryptovault/service/UserService.java



```java

package com.cryptovault.service;



import com.cryptovault.entity.User;

import com.cryptovault.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.\*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Collections;

import java.util.List;



@Service

public class UserService implements UserDetailsService {



&#x20;   @Autowired

&#x20;   private UserRepository userRepository;



&#x20;   @Autowired

&#x20;   private BCryptPasswordEncoder passwordEncoder;



&#x20;   @Override

&#x20;   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

&#x20;       User user = userRepository.findByUsername(username)

&#x20;               .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

&#x20;       return new org.springframework.security.core.userdetails.User(

&#x20;               user.getUsername(),

&#x20;               user.getPassword(),

&#x20;               Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))

&#x20;       );

&#x20;   }



&#x20;   public User registerUser(String username, String rawPassword) {

&#x20;       if (userRepository.existsByUsername(username)) {

&#x20;           throw new RuntimeException("Username already taken!");

&#x20;       }

&#x20;       User user = new User(username, passwordEncoder.encode(rawPassword), "ROLE\_USER");

&#x20;       return userRepository.save(user);

&#x20;   }



&#x20;   public List<User> getAllUsers() { return userRepository.findAll(); }

&#x20;   public long getUserCount() { return userRepository.count(); }

}

```



\---



\## 11. FileService.java

Path: src/main/java/com/cryptovault/service/FileService.java



```java

package com.cryptovault.service;



import com.cryptovault.entity.FileMetadata;

import com.cryptovault.exception.FileStorageException;

import com.cryptovault.repository.FileMetadataRepository;

import com.cryptovault.util.AESUtils;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.nio.file.\*;

import java.time.LocalDateTime;

import java.util.List;

import java.util.UUID;



@Service

public class FileService {



&#x20;   @Autowired

&#x20;   private FileMetadataRepository fileRepository;



&#x20;   @Value("${file.upload-dir}")

&#x20;   private String uploadDir;



&#x20;   public FileMetadata storeFile(MultipartFile file) throws Exception {

&#x20;       if (file.isEmpty()) throw new FileStorageException("Failed to store empty file.");

&#x20;       try {

&#x20;           byte\[] encryptedBytes = AESUtils.encrypt(file.getBytes());

&#x20;           Path targetPath = Paths.get(uploadDir).toAbsolutePath().normalize();

&#x20;           if (!Files.exists(targetPath)) Files.createDirectories(targetPath);



&#x20;           String storedFileName = UUID.randomUUID().toString() + ".enc";

&#x20;           Path filePath = targetPath.resolve(storedFileName);

&#x20;           Files.write(filePath, encryptedBytes);



&#x20;           String username = SecurityContextHolder.getContext().getAuthentication().getName();

&#x20;           FileMetadata metadata = new FileMetadata(

&#x20;                   file.getOriginalFilename(), filePath.toString(), file.getSize(), LocalDateTime.now());

&#x20;           metadata.setUploadedBy(username);

&#x20;           return fileRepository.save(metadata);

&#x20;       } catch (IOException e) {

&#x20;           throw new FileStorageException("Could not store file " + file.getOriginalFilename(), e);

&#x20;       }

&#x20;   }



&#x20;   public DecryptedFile getFile(Long id) throws Exception {

&#x20;       String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

&#x20;       boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()

&#x20;               .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE\_ADMIN"));



&#x20;       FileMetadata metadata = fileRepository.findById(id)

&#x20;               .orElseThrow(() -> new FileStorageException("File not found with id: " + id));



&#x20;       if (!isAdmin \&\& !metadata.getUploadedBy().equals(currentUser))

&#x20;           throw new FileStorageException("Access denied. You do not own this file.");



&#x20;       try {

&#x20;           byte\[] decryptedBytes = AESUtils.decrypt(Files.readAllBytes(Paths.get(metadata.getFilePath())));

&#x20;           return new DecryptedFile(metadata.getFileName(), decryptedBytes);

&#x20;       } catch (IOException e) {

&#x20;           throw new FileStorageException("Could not read file for id: " + id, e);

&#x20;       }

&#x20;   }



&#x20;   public List<FileMetadata> getFilesForUser(String username) { return fileRepository.findByUploadedBy(username); }

&#x20;   public List<FileMetadata> getAllFiles() { return fileRepository.findAll(); }

&#x20;   public long getTotalFileCount() { return fileRepository.count(); }



&#x20;   public static class DecryptedFile {

&#x20;       private final String fileName;

&#x20;       private final byte\[] content;

&#x20;       public DecryptedFile(String fileName, byte\[] content) {

&#x20;           this.fileName = fileName;

&#x20;           this.content = content;

&#x20;       }

&#x20;       public String getFileName() { return fileName; }

&#x20;       public byte\[] getContent() { return content; }

&#x20;   }

}

```



\---



\## 12. AESUtils.java

Path: src/main/java/com/cryptovault/util/AESUtils.java



```java

package com.cryptovault.util;



import javax.crypto.Cipher;

import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;



public class AESUtils {



&#x20;   private static final String ALGORITHM = "AES";

&#x20;   private static final String SECRET\_KEY = "CryptoVaultKey12"; // 16 chars = AES-128



&#x20;   /\*\*

&#x20;    \* Encrypts the provided byte array using AES encryption.

&#x20;    \*/

&#x20;   public static byte\[] encrypt(byte\[] data) throws Exception {

&#x20;       SecretKeySpec keySpec = new SecretKeySpec(SECRET\_KEY.getBytes(StandardCharsets.UTF\_8), ALGORITHM);

&#x20;       Cipher cipher = Cipher.getInstance(ALGORITHM);

&#x20;       cipher.init(Cipher.ENCRYPT\_MODE, keySpec);

&#x20;       return cipher.doFinal(data);

&#x20;   }



&#x20;   /\*\*

&#x20;    \* Decrypts the provided encrypted byte array using AES decryption.

&#x20;    \*/

&#x20;   public static byte\[] decrypt(byte\[] encryptedData) throws Exception {

&#x20;       SecretKeySpec keySpec = new SecretKeySpec(SECRET\_KEY.getBytes(StandardCharsets.UTF\_8), ALGORITHM);

&#x20;       Cipher cipher = Cipher.getInstance(ALGORITHM);

&#x20;       cipher.init(Cipher.DECRYPT\_MODE, keySpec);

&#x20;       return cipher.doFinal(encryptedData);

&#x20;   }

}

```



\---



\## 13. FileStorageException.java

Path: src/main/java/com/cryptovault/exception/FileStorageException.java



```java

package com.cryptovault.exception;



import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.ResponseStatus;



@ResponseStatus(HttpStatus.NOT\_FOUND)

public class FileStorageException extends RuntimeException {

&#x20;   public FileStorageException(String message) { super(message); }

&#x20;   public FileStorageException(String message, Throwable cause) { super(message, cause); }

}

```



\---



\## 14. GlobalExceptionHandler.java

Path: src/main/java/com/cryptovault/exception/GlobalExceptionHandler.java



```java

package com.cryptovault.exception;



import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ControllerAdvice;

import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

import java.util.LinkedHashMap;

import java.util.Map;



@ControllerAdvice

public class GlobalExceptionHandler {



&#x20;   @ExceptionHandler(FileStorageException.class)

&#x20;   public ResponseEntity<Object> handleFileStorageException(FileStorageException ex) {

&#x20;       Map<String, Object> body = new LinkedHashMap<>();

&#x20;       body.put("timestamp", LocalDateTime.now());

&#x20;       body.put("message", ex.getMessage());

&#x20;       body.put("error", "File Storage Error");

&#x20;       return new ResponseEntity<>(body, HttpStatus.NOT\_FOUND);

&#x20;   }



&#x20;   @ExceptionHandler(Exception.class)

&#x20;   public ResponseEntity<Object> handleGeneralException(Exception ex) {

&#x20;       Map<String, Object> body = new LinkedHashMap<>();

&#x20;       body.put("timestamp", LocalDateTime.now());

&#x20;       body.put("message", "An unexpected error occurred: " + ex.getMessage());

&#x20;       body.put("error", "Internal Server Error");

&#x20;       return new ResponseEntity<>(body, HttpStatus.INTERNAL\_SERVER\_ERROR);

&#x20;   }

}

```



\---



\## 15. AuthController.java

Path: src/main/java/com/cryptovault/controller/AuthController.java



```java

package com.cryptovault.controller;



import com.cryptovault.service.FileService;

import com.cryptovault.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.\*;



@Controller

public class AuthController {



&#x20;   @Autowired

&#x20;   private UserService userService;



&#x20;   @Autowired

&#x20;   private FileService fileService;



&#x20;   @GetMapping("/login")

&#x20;   public String loginPage(@RequestParam(name = "error", required = false) String error,

&#x20;                           @RequestParam(name = "logout", required = false) String logout,

&#x20;                           Model model) {

&#x20;       if (error != null) model.addAttribute("error", "Invalid username or password.");

&#x20;       if (logout != null) model.addAttribute("message", "You have been logged out safely.");

&#x20;       return "login";

&#x20;   }



&#x20;   @GetMapping("/register")

&#x20;   public String registerPage() { return "register"; }



&#x20;   @PostMapping("/register")

&#x20;   public String doRegister(@RequestParam(name = "username") String username,

&#x20;                            @RequestParam(name = "password") String password,

&#x20;                            Model model) {

&#x20;       try {

&#x20;           userService.registerUser(username, password);

&#x20;           return "redirect:/login?registered=true";

&#x20;       } catch (RuntimeException e) {

&#x20;           model.addAttribute("error", e.getMessage());

&#x20;           return "register";

&#x20;       }

&#x20;   }



&#x20;   @GetMapping("/dashboard")

&#x20;   public String dashboard(Authentication auth, Model model) {

&#x20;       String username = auth.getName();

&#x20;       boolean isAdmin = auth.getAuthorities().stream()

&#x20;               .anyMatch(a -> a.getAuthority().equals("ROLE\_ADMIN"));

&#x20;       model.addAttribute("username", username);

&#x20;       model.addAttribute("isAdmin", isAdmin);

&#x20;       model.addAttribute("files", fileService.getFilesForUser(username));

&#x20;       return "dashboard";

&#x20;   }



&#x20;   @GetMapping("/admin")

&#x20;   public String adminPanel(Model model) {

&#x20;       model.addAttribute("users", userService.getAllUsers());

&#x20;       model.addAttribute("files", fileService.getAllFiles());

&#x20;       model.addAttribute("userCount", userService.getUserCount());

&#x20;       model.addAttribute("fileCount", fileService.getTotalFileCount());

&#x20;       return "admin";

&#x20;   }

}

```



\---



\## 16. FileController.java

Path: src/main/java/com/cryptovault/controller/FileController.java



```java

package com.cryptovault.controller;



import com.cryptovault.entity.FileMetadata;

import com.cryptovault.service.FileService;

import com.cryptovault.service.FileService.DecryptedFile;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.ByteArrayResource;

import org.springframework.core.io.Resource;

import org.springframework.http.\*;

import org.springframework.web.bind.annotation.\*;

import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

import java.util.Map;



@RestController

@RequestMapping("/api/files")

@CrossOrigin(origins = "\*")

public class FileController {



&#x20;   @Autowired

&#x20;   private FileService fileService;



&#x20;   @PostMapping("/upload")

&#x20;   public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {

&#x20;       try {

&#x20;           FileMetadata metadata = fileService.storeFile(file);

&#x20;           Map<String, String> response = new HashMap<>();

&#x20;           response.put("message", "File uploaded and encrypted successfully!");

&#x20;           response.put("fileId", String.valueOf(metadata.getId()));

&#x20;           response.put("fileName", metadata.getFileName());

&#x20;           return ResponseEntity.status(HttpStatus.CREATED).body(response);

&#x20;       } catch (Exception e) {

&#x20;           Map<String, String> response = new HashMap<>();

&#x20;           response.put("error", "Failed to upload file: " + e.getMessage());

&#x20;           return ResponseEntity.status(HttpStatus.INTERNAL\_SERVER\_ERROR).body(response);

&#x20;       }

&#x20;   }



&#x20;   @GetMapping("/download/{id}")

&#x20;   public ResponseEntity<Resource> downloadFile(@PathVariable("id") Long id) {

&#x20;       try {

&#x20;           DecryptedFile decryptedFile = fileService.getFile(id);

&#x20;           return ResponseEntity.ok()

&#x20;                   .contentType(MediaType.APPLICATION\_OCTET\_STREAM)

&#x20;                   .header(HttpHeaders.CONTENT\_DISPOSITION,

&#x20;                           "attachment; filename=\\"" + decryptedFile.getFileName() + "\\"")

&#x20;                   .body(new ByteArrayResource(decryptedFile.getContent()));

&#x20;       } catch (Exception e) {

&#x20;           return ResponseEntity.status(HttpStatus.NOT\_FOUND).build();

&#x20;       }

&#x20;   }

}

```



\---



\## 17. index.html (Home Page)

Path: src/main/resources/static/index.html





The full index.html is a single-page landing site with animated orbs, star particles, a hero section, features grid, creator card, tech stack badges, and footer. Key sections:



\- Navbar with logo, nav links (Features, About, Login, Get Started)

\- Hero with animated title, CTA buttons, trust badges, and API preview card

\- Features grid (6 cards: AES-128, User Auth, Private Vault, Admin Panel, REST API, Dark UI)

\- About section with project description and creator card (Jevin)

\- Tech stack badges (Java 17, Spring Boot 3.2, Spring Security, JPA, AES-128, BCrypt, Thymeleaf, H2, REST API)

\- Footer with links



See full file at: src/main/resources/static/index.html



\---



\## 18. login.html

Path: src/main/resources/templates/login.html



Glassmorphism login card with:

\- Animated gradient orbs and floating particles

\- Logo ring with pulse-glow animation

\- Username and password fields with icons

\- Thymeleaf error/success/logout message display

\- "Sign In" button with shimmer hover effect

\- Link to register page

\- Security badges (AES-128, BCrypt, Spring Boot)



See full file at: src/main/resources/templates/login.html



\---



\## 19. register.html

Path: src/main/resources/templates/register.html



Registration card with:

\- Teal/blue animated orbs

\- Username and password fields

\- Live password strength bar (5 levels, color-coded)

\- 4 perk cards (AES-128, BCrypt, Private, Fast)

\- Link back to login



See full file at: src/main/resources/templates/register.html



\---



\## 20. dashboard.html

Path: src/main/resources/templates/dashboard.html



Main user dashboard with:

\- Sticky navbar with username, role badge, admin panel link, sign out

\- Stats row (Files Stored, AES Encryption, 100% Private)

\- Drag-and-drop upload zone with progress bar and status messages

\- Encrypted files table (name, size, upload date, decrypt \& download button)

\- Empty state when no files uploaded

\- JavaScript: drag/drop handling, fetch API upload, download redirect



See full file at: src/main/resources/templates/dashboard.html



\---



\## 21. admin.html

Path: src/main/resources/templates/admin.html



Admin control panel with:

\- Gold-themed navbar with ADMINISTRATOR badge

\- 3 stat cards (Registered Users, Encrypted Files, AES-128)

\- All Users table (avatar, username, ID, role badge)

\- All Files table (file name, owner, size, upload date)

\- Gold animated grid background with orange/gold orbs



See full file at: src/main/resources/templates/admin.html



\---



\## 22. AESUtilsTest.java

Path: src/test/java/com/cryptovault/util/AESUtilsTest.java



```java

package com.cryptovault.util;



import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.\*;

import java.nio.charset.StandardCharsets;



public class AESUtilsTest {



&#x20;   @Test

&#x20;   public void testEncryptionAndDecryption() throws Exception {

&#x20;       String originalText = "This is a strictly confidential file content!!";

&#x20;       byte\[] originalBytes = originalText.getBytes(StandardCharsets.UTF\_8);



&#x20;       // Encrypt

&#x20;       byte\[] encryptedBytes = AESUtils.encrypt(originalBytes);

&#x20;       assertNotNull(encryptedBytes);

&#x20;       assertNotEquals(originalBytes.length, 0);



&#x20;       // Decrypt

&#x20;       byte\[] decryptedBytes = AESUtils.decrypt(encryptedBytes);

&#x20;       String decryptedText = new String(decryptedBytes, StandardCharsets.UTF\_8);



&#x20;       // Verify decrypted matches original

&#x20;       assertEquals(originalText, decryptedText);

&#x20;       System.out.println("AES Validation Successful. Original text matching the decrypted text.");

&#x20;   }

}

```



\---



\## Project Structure



```

CryptoVault/

├── pom.xml

├── src/

│   ├── main/

│   │   ├── java/com/cryptovault/

│   │   │   ├── CryptoVaultApplication.java

│   │   │   ├── config/

│   │   │   │   ├── SecurityConfig.java

│   │   │   │   └── DataInitializer.java

│   │   │   ├── controller/

│   │   │   │   ├── AuthController.java

│   │   │   │   └── FileController.java

│   │   │   ├── entity/

│   │   │   │   ├── User.java

│   │   │   │   └── FileMetadata.java

│   │   │   ├── repository/

│   │   │   │   ├── UserRepository.java

│   │   │   │   └── FileMetadataRepository.java

│   │   │   ├── service/

│   │   │   │   ├── UserService.java

│   │   │   │   └── FileService.java

│   │   │   ├── util/

│   │   │   │   └── AESUtils.java

│   │   │   └── exception/

│   │   │       ├── FileStorageException.java

│   │   │       └── GlobalExceptionHandler.java

│   │   └── resources/

│   │       ├── application.properties

│   │       ├── static/

│   │       │   └── index.html

│   │       └── templates/

│   │           ├── login.html

│   │           ├── register.html

│   │           ├── dashboard.html

│   │           └── admin.html

│   └── test/

│       └── java/com/cryptovault/util/

│           └── AESUtilsTest.java

└── uploads/   (encrypted .enc files stored here)

```



\---



\## Default Credentials



| Role  | Username | Password  |

|-------|----------|-----------|

| Admin | admin    | admin123  |



\---



\## How to Run



```bash

./apache-maven-3.9.6/bin/mvn spring-boot:run

```



Then open: http://localhost:8080



\## How to Test



```bash

./apache-maven-3.9.6/bin/mvn test

```



Test result: 1 test passed — AES encrypt/decrypt validation successful.



