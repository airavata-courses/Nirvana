using System;
using System.Threading;
using Confluent.Kafka;
namespace SessionManagement
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var consumer = new ConsumerBuilder<Ignore, string>(Constants.consumerConfig).Build())
            {
                consumer.Subscribe(Constants.kafkaConsumerTopics);

                CancellationTokenSource cts = new CancellationTokenSource();
                Console.CancelKeyPress += (_, e) =>
                {
                    e.Cancel = true; // prevent the process from terminating.
                    cts.Cancel();
                };
                try
                {
                    while (true)
                    {
                        try
                        {
                            var message = consumer.Consume(cts.Token);
                            Console.WriteLine($"Consumed message '{message.Value}'");
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
