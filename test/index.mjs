import { test } from 'uvu'
import * as assert from 'uvu/assert'

import sleep from 'pixutil/sleep'
import teme from 'teme'

import Topic from '../src/index.mjs'

test('basic pub/sub', async () => {
  const topic = new Topic()
  const calls = []

  const unsub = topic.subscribe(v => calls.push(v))
  for await (const v of [1, 2, 3]) await topic.publish(v)

  await unsub()
  await sleep(20)

  assert.equal(calls, [1, 2, 3])

  await topic.publish(4)

  await sleep(20)
  assert.is(calls.length, 3)
})

test('via stream', async () => {
  const topic = new Topic()

  let stream
  const unsub = topic.subscribeStream(t => (stream = t))

  teme([1, 2, 3])
    .toAsync()
    .each(v => topic.publish(v))
    .consume()

  await sleep(50)

  await unsub()
  const result = await stream.collect()

  assert.equal(result, [1, 2, 3])
})

test('multiple subscribers', async () => {
  const topic = new Topic()
  const calls = []
  let streamDone

  topic.subscribe(v => calls.push(v))

  const unsub2 = topic.subscribeStream(async t => {
    const result = await t.collect()
    assert.equal(result, [1, 2, 3])
    streamDone = true
  })

  for await (const v of [1, 2, 3]) await topic.publish(v)

  await sleep(20)
  await unsub2()
  await sleep(20)

  assert.equal(calls, [1, 2, 3])
  assert.is(streamDone, true)
})

test.run()
