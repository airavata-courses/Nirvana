package CryptoHandler;
import org.mindrot.jbcrypt.BCrypt;
public class Crypto {
    public static String getSHAPassword(String originalPassword)
    {
        return BCrypt.hashpw(originalPassword, BCrypt.gensalt(12));
    }
    public static Boolean validatePassword(String hashedPassword, String origianlPassword)
    {
        return BCrypt.checkpw(origianlPassword,hashedPassword);
    }
}
