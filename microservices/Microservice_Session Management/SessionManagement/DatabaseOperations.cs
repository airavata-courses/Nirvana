using Confluent.Kafka;
using MySql.Data.MySqlClient;
using System;

namespace SessionManagement
{
    public class DatabaseOperations
    {

        public static string connStr = "server=" + Constants.serverEndPoint + "" +
            ";user=" + Constants.serverUserName +
            ";database=" + Constants.serverDatabaseName +
            ";port=" + Constants.serverPort +
            ";password=" + Constants.serverPassword;
        public static MySqlConnection conn = new MySqlConnection(connStr);

        public async void insertIntoSessionTable(string user_email)
        {
            // start_date will be the current timestamp by default
            // end_date will be NULL by default
            // id is autoincrement
            // the user_id out here is actually the useremail

            //process
            //1. enter in session table
            //2. take the session id and enter in log table


            if (conn != null && conn.State == System.Data.ConnectionState.Closed)
            {
                conn.Open();
            }
            var query = "INSERT INTO sessiondetails(user_id) VALUES(@userid); SELECT LAST_INSERT_ID();";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@userid", user_email);
            cmd.Prepare();
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while (rdr.Read())
            {
                int sessionId = rdr.GetInt32(0);
                rdr.Close();

                // send the session id to the api gateway so the user doesnt have to wait longer
                using (var p = new ProducerBuilder<String, string>(Constants.producerconfig).Build())
                {
                    try
                    {
                        Console.WriteLine(Constants.generateApiConsumerKey(user_email, "session_service"));
                        var dr = await p.ProduceAsync(Constants.kafkaAPIGatewayTopic, new Message<string, string> { Key = Constants.generateApiConsumerKey(user_email, "session_service"), Value = sessionId.ToString() });
                    }
                    catch (ProduceException<Null, string> e)
                    {
                        Console.WriteLine($"Delivery failed: {e.Error.Reason}");
                    }
                }


                insertIntoLogsTable(sessionId, "user logged in");
                break;
            }

        }

        public void insertIntoLogsTable(int sessionId, string log_action)
        {

            if (conn != null && conn.State == System.Data.ConnectionState.Closed)
            {
                conn.Open();
            }
            var query = "INSERT INTO logdetails(session_id,log_action) VALUES(@sessionId, @logAction);";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@sessionId", sessionId);
            cmd.Parameters.AddWithValue("@logAction", log_action);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }

        public void updateEndDateInSessionTable(Int64 sessionId)
        {
            DateTime endDate = DateTime.Now;
            string query = "UPDATE sessiondetails SET end_date=@endDate,WHERE id=@sessionId";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@endDate", endDate);
            cmd.Parameters.AddWithValue("@sessionId", sessionId);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}
