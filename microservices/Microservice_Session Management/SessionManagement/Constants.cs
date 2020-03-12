using Confluent.Kafka;
using System;
using System.Collections.Generic;
using System.Text;

namespace SessionManagement
{
    public class Constants
    {
        // mysql/mariadb variables
        public static String serverEndPoint = "remotemysql.com";
        public static String serverUserName = "2fVTo72kDN";
        public static String serverPassword = "hOPiiqlhGj";
        public static String serverPort = "3306";
        public static String serverDatabaseName = "2fVTo72kDN";

        // kafka endpoint variables
        public static String kafkaEndPoint = "149.165.169.31:31330";
        public static String kafkaGroupId = "kafkagroupid";
        public static String kafkaConsumerTopics = "session_management_and_logging_service";
        public static String kafkaAPIGatewayTopic = "API_Consumer";
        public static ConsumerConfig consumerConfig = new ConsumerConfig
        {
            GroupId = Constants.kafkaGroupId,
            BootstrapServers = Constants.kafkaEndPoint,
            AutoOffsetReset = AutoOffsetReset.Earliest
        };
        public static ProducerConfig producerconfig = new ProducerConfig 
        { 
            BootstrapServers = Constants.kafkaEndPoint
        };

        // consumer key for the api consumer side
        public static string generateApiConsumerKey(String email, String action)
        {
            string returnString = "";
            for(int i=0;i<email.Length;i++)
            {
                returnString = returnString + ((int)email[i]).ToString();
            }
            return returnString + "_" + action;

        }


    }
}
