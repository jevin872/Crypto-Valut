package com.cryptovault.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.nio.charset.StandardCharsets;

public class AESUtilsTest {

    @Test
    public void testEncryptionAndDecryption() throws Exception {
        String originalText = "This is a strictly confidential file content!!";
        byte[] originalBytes = originalText.getBytes(StandardCharsets.UTF_8);

        // Encrypt
        byte[] encryptedBytes = AESUtils.encrypt(originalBytes);
        assertNotNull(encryptedBytes);
        assertNotEquals(originalBytes.length, 0);
        
        // Decrypt
        byte[] decryptedBytes = AESUtils.decrypt(encryptedBytes);
        String decryptedText = new String(decryptedBytes, StandardCharsets.UTF_8);

        // Verify that decrypted matches original
        assertEquals(originalText, decryptedText);
        System.out.println("AES Validation Successful. Original text matching the decrypted text.");
    }
}
