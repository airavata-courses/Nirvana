package staticfields;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Properties;

public class Constants {
    public static final String KAFKA_BOOTSTRAP_SERVERS = "149.165.169.31:31330";
    public final static String TOPIC_AUTHENTICATION_LOGIN = "authentication_login";
    public final static String TOPIC_AUTHENTICATION_SIGNUP = "authentication_signup";

    // database details hosted on heroku
    // 10,000 rows limit
    // 20 connections limit
    public final static String DATABASE_URL = "ec2-3-229-210-93.compute-1.amazonaws.com";
    public final static String DATABASE_USERNAME = "uynymbalvuaitd";
    public final static String DATABASE_NAME = "d7efrbdtvvlp6b";
    public final static String DATABASE_PASSWORD = "601ae73db175db9dd9b8b0e0d5f4037e20fcf324433dc7bf9fd50156f5c11071";
    public final static String DATABASE_PORT = "5432";
    public final static String DATABASE_HEROKU_URI = "postgres://uynymbalvuaitd:601ae73db175db9dd9b8b0e0d5f4037e20fcf324433dc7bf9fd50156f5c11071@ec2-3-229-210-93.compute-1.amazonaws.com:5432/d7efrbdtvvlp6b";


    public static Consumer<String, String> createConsumer() {
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", Constants.KAFKA_BOOTSTRAP_SERVERS);
        properties.setProperty("group.id", "kafkagroupid");
        properties.setProperty("key.deserializer","org.apache.kafka.common.serialization.StringDeserializer");
        properties.setProperty("value.deserializer","org.apache.kafka.connect.json.JsonDeserializer");
        properties.setProperty("auto.offset.reset","earliest");
        properties.setProperty("enable.auto.commit", "false");
        KafkaConsumer consumer = new KafkaConsumer(properties);
        consumer.subscribe(Arrays.asList(Constants.TOPIC_AUTHENTICATION_SIGNUP, Constants.TOPIC_AUTHENTICATION_LOGIN));
        return consumer;
    }

    public static Producer<String, String> createProducer() {
        Properties properties = new Properties();
        properties.setProperty("bootstrap.servers", Constants.KAFKA_BOOTSTRAP_SERVERS);
        properties.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        properties.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        return new KafkaProducer<>(properties);
    }

        public static Connection connect() {
        Connection conn = null;
        try {
            Class.forName("org.postgresql.Driver");
            URI dbUri = new URI(DATABASE_HEROKU_URI);

            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath() + "?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory";

            conn =  DriverManager.getConnection(dbUrl, username, password);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return conn;
    }
}
