package authentication;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import operations.DatabaseOperations;
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.producer.Producer;
import staticfields.Constants;
public class AuthConsumer{
    DatabaseOperations db = new DatabaseOperations();
    public void runConsumer() throws InterruptedException {
        final Consumer<String, String> consumer = Constants.createConsumer();
        final Producer<String, String> producer = Constants.createProducer();

        while (true) {
            final ConsumerRecords<String, String> consumerRecords = consumer.poll(1000);
            consumerRecords.forEach(record -> {
                JsonNode node=null;
                try {
                  node = new ObjectMapper().convertValue(record.value(), JsonNode.class);

                } catch (Exception e) {
                    e.printStackTrace();
                }
                switch(record.topic()){
                    case Constants.TOPIC_AUTHENTICATION_LOGIN:
                        db.logIn( node.get("email").toString().replace("\"", ""),node.get("password").toString().replace("\"", ""), producer, record.key());
                        break;
                    case Constants.TOPIC_AUTHENTICATION_SIGNUP:
                        db.signUp(node.get("first_name").toString().replace("\"", "")+node.get("last_name").toString().replace("\"", ""), node.get("email").toString().replace("\"", ""), node.get("password").toString().replace("\"", ""), producer,record.key());
                        break;
                };
            });
            consumer.commitAsync();
        }
    }

}