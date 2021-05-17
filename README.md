# Topic

Simple pipe-based pub/sub

## API

### Topic
`const t = new Topic()`

Creates a new Topic.

### .publish
`await t.publish(someData)`

Publishes data on the topic. May block if any of the subscribers message queues are full.

### .subscribe
`const unsub = t.subscribe(async value => {...})`

Subscribes to published values. The supplied function is called for each value published.

Returns an unsubscribe function.

### .subscribeStream
`const unsub = t.subscribeStream(teme => {...})`

Provides the subscription as a teme stream
