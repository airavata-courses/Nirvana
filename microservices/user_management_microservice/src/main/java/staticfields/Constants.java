package staticfields;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Properties;

public class Constants {
    public static final String KAFKA_BOOTSTRAP_SERVERS = "localhost:9092";
    public final static String TOPIC_AUTHENTICATION_LOGIN = "authentication_login";
    public final static String TOPIC_AUTHENTICATION_SIGNUP = "authentication_signup";
    public final static String DATABASE_URL = "userinformation.cm31wudacr8k.us-east-1.rds.amazonaws.com";
    public final static String DATABASE_USERNAME = "postgres";
    public final static String DATABASE_NAME = "postgres";
    public final static String DATABASE_PASSWORD = "postgres123";

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
            String dbName = DATABASE_NAME;
            String userName = DATABASE_USERNAME;
            String password = DATABASE_PASSWORD;
            String hostname = DATABASE_URL;
            String port = "5432";
            String jdbcUrl = "jdbc:postgresql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password;
            conn = DriverManager.getConnection(jdbcUrl);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return conn;
    }
}
