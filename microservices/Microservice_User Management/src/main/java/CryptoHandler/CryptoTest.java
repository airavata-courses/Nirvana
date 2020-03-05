package CryptoHandler;

import org.junit.Test;

import static org.junit.jupiter.api.Assertions.*;

class CryptoTest {

    public Crypto crypto;
    public CryptoTest()
    {
        crypto = new Crypto();
    }
    @org.junit.jupiter.api.Test
    void Test_getSHAPassword() {
        String encryptedpassword = crypto.getSHAPassword("abc");
        assertEquals(encryptedpassword.length(), encryptedpassword.length());
    }

    @org.junit.jupiter.api.Test
    void Test_validatePassword() {
        String encryptedpassword = crypto.getSHAPassword("abc");
        boolean result = crypto.validatePassword(encryptedpassword, "abc");
        assertEquals(result, true);
    }
}