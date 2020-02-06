using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;

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

        public void insertIntoSessionTable(String user_id)
        {
            // start_date will be the current timestamp by default
            // end_date will be 0 by default
            // id is autoincrement

            //process
            //1. enter in session table
            //2. take the session id and enter in log table

            Console.WriteLine("Connecting to MySQL...");
            conn.Open();
            var query = "INSERT INTO sessiondetails(user_id) VALUES(@userid); SELECT LAST_INSERT_ID();";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@userid", user_id);
            cmd.Prepare();
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while (rdr.Read())
            {
                Console.WriteLine("{0}", rdr.GetInt32(0));
            }
            conn.Close();
        }

        public void insertIntoLogsTable(int sessionId, String log_action)
        {
            conn.Open();
            var query = "INSERT INTO logdetails(session_id,log_action) VALUES(@sessionId, @logAction);";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@sessionId", sessionId);
            cmd.Parameters.AddWithValue("@logAction", log_action);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }

        public void updateEndDateInSessionTable(DateTime endDate, Int64 sessionId)
        {
            string query = "UPDATE sessiondetails SET end_date=@endDate,WHERE id=@sessionId";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@endDate", endDate);
            cmd.Parameters.AddWithValue("@sessionId", sessionId);
            cmd.Prepare();
            cmd.ExecuteNonQuery();
        }
    }
}
