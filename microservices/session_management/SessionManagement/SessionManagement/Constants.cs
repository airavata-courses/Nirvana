using Confluent.Kafka;
using System;
using System.Collections.Generic;
using System.Text;

namespace SessionManagement
{
    public class Constants
    {
        // mysql/mariadb variables
        public static String serverEndPoint = "localhost";
        public static String serverUserName = "root";
        public static String serverPassword = "mariadb123";
        public static String serverPort = "3306";
        public static String serverDatabaseName = "sessionmanagement";

        // kafka endpoint variables
        public static String kafkaEndPoint = "localhost:9092";
        public static String kafkaGroupId = "kafkagroupid";
        public static String kafkaConsumerTopics = "session_management_and_logging_service";
        public static ConsumerConfig consumerConfig = new ConsumerConfig
        {
            GroupId = Constants.kafkaGroupId,
            BootstrapServers = Constants.kafkaEndPoint,
            AutoOffsetReset = AutoOffsetReset.Earliest
        };


    }
}
