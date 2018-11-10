const PubSub = require('@google-cloud/pubsub');
const request = require('request');

const pubsub = new PubSub({
  projectId: 'seiu-demo',
  keyFilename: 'key.json'
});

function listenForMessages(subscriptionName, timeout) {
  // [START pubsub_subscriber_async_pull]
  // [START pubsub_quickstart_subscriber]
  // Imports the Google Cloud client library
  console.log('[START pubsub_subscriber_async_pull]');
  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const subscriptionName = 'my-sub';
  // const timeout = 60;

  // References an existing subscription
  const subscription = pubsub.subscription(subscriptionName);
  //....
  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    request.post('http://loopback4-example-todo-list.jx-staging/todos', {
      json: {
        todo: message.data
      }
      }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    })
    // "Ack" (acknowledge receipt of) the message
    message.ack();

    //listenForMessages(subscriptionName, timeout);
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);

  /*setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);*/
  // [END pubsub_subscriber_async_pull]
  // [END pubsub_quickstart_subscriber]
}
  
listenForMessages('student-training-changes-sub', 60);


