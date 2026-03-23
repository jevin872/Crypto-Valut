package com.cryptovault.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;


public class AESUtils {

    // AES algorithm type
    private static final String ALGORITHM = "AES";
    
    // Hardcoded secret key (must be 16 characters for AES-128)
    private static final String SECRET_KEY = "CryptoVaultKey12"; 

    /**
     * Encrypts the provided byte array using AES encryption.
     * @param data The data to be encrypted.
     * @return The encrypted byte array.
     * @throws Exception if an error occurs during encryption.
     */
    public static byte[] encrypt(byte[] data) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        return cipher.doFinal(data);
    }

    /**
     * Decrypts the provided encrypted byte array using AES decryption.
     * @param encryptedData The data to be decrypted.
     * @return The decrypted byte array.
     * @throws Exception if an error occurs during decryption.
     */
    public static byte[] decrypt(byte[] encryptedData) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        return cipher.doFinal(encryptedData);
    }
}
