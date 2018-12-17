/**
 * This object holds references to subscription callbacks.  Each attribute
 * of this object is itself an object corresponding to a message context (or
 * the special gloal context).  Each of those objects has attributes
 * where each corresponds to a message and the value of which is an
 * array of function references.
 */
app.subscriptions = {
  messageBus_contextGlobal : { }
};


/**
 * Allows client code to subscribe to a given message in a given context.
 *
 * @param  inContext  The context to listen in for the message.  If not
 *                    supplied then the message is "global".  Optional.
 * @param  inMessage  The message to subscribe to.  Required.
 * @param  inCallback The function to call.  Required.
 * @return            An ID associated with the subscription.  This is used
 *                    to unsubscribe later if needed.
 */
app.subscribe = function(inContext, inMessage, inCallback) {

  // Input validation.
  if (!inMessage || !inCallback) { return; }

  // Account for global messages.
  if (!inContext) {
    inContext = "messageBus_contextGlobal";
  }

  // Find the specified context.
  var context = app.subscriptions[inContext];
  // Specified context doesn't exist, create it.
  if (!context) {
    context = { };
    app.subscriptions[inContext] = context;
  }
  // Find subscribers to the specified message.
  var messageSubscribers = context[inMessage];
  // No subscribers to specified message yet, create array for this one.
  if (!messageSubscribers) {
    messageSubscribers = [ ];
    context[inMessage] = messageSubscribers;
  }

  // Add subscribers to this message and return its ID.
  messageSubscribers.push(inCallback);
  return messageSubscribers.length - 1;

}; // End subscribe().


/**
 * Publish a message to a given context.
 *
 * @param inContext The context to publish the message in.  If not
 *                  supplied then the message is "global".  Optional.
 * @param inMessage The message to publish.  Required.
 * @param inPayload An object that will be passed to the subscribed
 *                  function.  Optional.
 */
app.publish = function(inContext, inMessage, inPayload) {

  // Input validation.
  if (!inMessage) { return; }

  // Account for global messages.
  if (!inContext) {
    inContext = "messageBus_contextGlobal";
  }

  // Find the specified context.
  var context = app.subscriptions[inContext];
  if (context) {
    // Find subscribers to the specified message.
    var messageSubscribers = context[inMessage];
    if (messageSubscribers) {
      // Execute the subscribed callback function.
      var numSubscribers = messageSubscribers.length;
      for (var i = 0; i < numSubscribers; i++) {
        messageSubscribers[i](inPayload);
      }
    }
  }

}; // End publish().
