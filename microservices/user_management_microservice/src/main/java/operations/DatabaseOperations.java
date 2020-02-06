package operations;

import CryptoHandler.Crypto;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import staticfields.Constants;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.*;
import java.util.Arrays;


public class DatabaseOperations {

    Connection conn = Constants.connect();
    public Boolean signUp(String name, String email, String password, Producer<String, String> producer,String key){
        boolean returnFlag = true;
        PreparedStatement st;
        try {
            st = conn.prepareStatement("INSERT INTO userdetails (name, email, password) VALUES (?, ?, ?)");
            st.setString(1, name);
            st.setString(2, email);
            st.setString(3, Crypto.getSHAPassword(password));
            if(st.executeUpdate() == 1){
                producer.send(new ProducerRecord<String, String>("API_Consumer", key, "Signup Sucessful"));
            }
            else
            {
                producer.send(new ProducerRecord<String, String>("API_Consumer", key, "There was a problem signin up"));
            }
            st.close();
        }
        catch (Exception e){
            e.printStackTrace();
            byte[] ascii = email.getBytes(StandardCharsets.US_ASCII);
            String email_encoded = "";
            for(int i = 0;i<ascii.length;i++)
            {
                email_encoded = email_encoded + ascii[i];
            }
            System.out.println(email_encoded);
            producer.send(new ProducerRecord<String, String>(email_encoded, email_encoded, "Email already exists"));
            returnFlag = false;
        }
        return returnFlag;
    }
    public Boolean logIn(String email, String password, Producer<String, String> producer, String key){
        PreparedStatement st;
        try {
            st = conn.prepareStatement("Select Password from userdetails where email=?");
            st.setString(1, email);
            ResultSet rs = st.executeQuery();
            rs.next();
            if(rs.getRow() == 1)
            {
                String passwordFromDatabase = rs.getString("password");
                if(Crypto.validatePassword(passwordFromDatabase,password))
                {
                    producer.send(new ProducerRecord<String, String>("API_Consumer",key, "login Successful"));
                }
                else
                {
                    producer.send(new ProducerRecord<String, String>("API_Consumer",key, "Invalid Credentials"));
                }
            }
            else
            {
                producer.send(new ProducerRecord<String, String>("API_Consumer",key, "User not registered"));
            }
            return true;
        }
        catch (Exception e){
            producer.send(new ProducerRecord<String, String>("API_Consumer",key, e.toString()));
            return false;
        }
    }

}
