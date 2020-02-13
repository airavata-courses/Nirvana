using System;
using System.Threading;
using Confluent.Kafka;
using Newtonsoft.Json.Linq;

namespace SessionManagement
{
    class Program
    {
        public static DatabaseOperations databaseOperations = new DatabaseOperations();
        static void Main(string[] args)
        {
            using (var consumer = new ConsumerBuilder<string, string>(Constants.consumerConfig).Build())
            {
                consumer.Subscribe(Constants.kafkaConsumerTopics);

                CancellationTokenSource cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) =>
                {
                    e.Cancel = true;
                    cts.Cancel();
                };
                try
                {
                    while (true)
                    {
                        try
                        {
                            var message = consumer.Consume(cts.Token);
                            try
                            {
                                if (message.Key.ToString().Contains("session_start"))
                                {
                                    databaseOperations.insertIntoSessionTable(message.Value.ToString().Replace("'", ""));
                                }
                                else if (message.Key.ToString().Contains("user_log"))
                                {
                                    JObject json = JObject.Parse(message.Value.ToString());
                                    databaseOperations.insertIntoLogsTable(Int32.Parse(json.GetValue("session_id").ToString()), json.GetValue("user_action").ToString());
                                }
                                else if (message.Key.ToString().Contains("user_logout"))
                                {
                                    JObject json = JObject.Parse(message.Value.ToString());
                                    databaseOperations.updateEndDateInSessionTable(Int32.Parse(json.GetValue("session_id").ToString()));
                                }
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine(e.ToString());
                            }
                        }
                        catch (ConsumeException e)
                        {
                            Console.WriteLine($"Error occured: {e.Error.Reason}");
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    // Ensure the consumer leaves the group cleanly and final offsets are committed.
                    consumer.Close();
                }

            }
        }
    }
}
