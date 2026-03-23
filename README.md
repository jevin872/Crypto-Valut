# CryptoVault: Secure File Storage System with AES Encryption

## Project Overview
CryptoVault is a Spring Boot application designed to securely store files in local storage. Every file is encrypted using the Advanced Encryption Standard (AES) before being saved to disk and decrypted upon download, ensuring data privacy and security.

## Technology Stack
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** MySQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** AES-128 Encryption

## Project Components

1. **`CryptoVaultApplication.java`**:
   The entry point of the Spring Boot application.

2. **`controller/FileController.java`**:
   Contains the REST API endpoints:
   - `POST /api/files/upload`: Accepts a `MultipartFile` and returns a `fileId` upon successful encryption and storage.
   - `GET /api/files/download/{id}`: Retrieves the file, decrypts it using AES, and returns it as a downloadable resource.

3. **`service/FileService.java`**:
   The core business logic layer that:
   - Reads the file bytes.
   - Calls the AES encryption utility.
   - Stores the encrypted file in the `./uploads` folder.
   - Saves file metadata (original name, path, size, etc.) to MySQL.
   - Handles decryption during retrieval.

4. **`repository/FileMetadataRepository.java`**:
   A Spring Data JPA repository for CRUD operations on the `FileMetadata` table.

5. **`entity/FileMetadata.java`**:
   The JPA entity representing the `file_metadata` table in MySQL.

6. **`util/AESUtils.java`**:
   A utility class that performs the actual AES encryption and decryption. It uses a 16-character secret key for AES-128.

7. **`exception/`**:
   Includes a custom `FileStorageException` and a `GlobalExceptionHandler` to provide descriptive error messages to the client.

## Setup and Run Instructions

1. **Database Setup**:
   - Create a MySQL database named `cryptovault_db`.
   - Update `src/main/resources/application.properties` with your MySQL username and password.

2. **Run the Application**:
   Navigate to the project root and run:
   ```bash
   mvn spring-boot:run
   ```

## Postman API Testing Examples

### 1. Upload File
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/files/upload`
- **Body Type:** `form-data`
- **Key:** `file` (Select a file to upload)
- **Sample Response:**
  ```json
  {
      "message": "File uploaded and encrypted successfully!",
      "fileId": "1",
      "fileName": "document.pdf"
  }
  ```

### 2. Download File
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/files/download/1`
- **Outcome:** The browser or Postman will download the original, decrypted file.

---
*Created for secure storage experiments and learning.*
