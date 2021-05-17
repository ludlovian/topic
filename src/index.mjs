import Pipe from 'pipe'
import teme from 'teme'

export default function Topic () {
  const subs = new Set()
  return {
    publish (value) {
      return Promise.all([...subs].map(sub => sub.write(value)))
    },

    subscribeStream (fn) {
      const [reader, writer] = new Pipe()
      subs.add(writer)
      fn(teme(reader))
      return () => subs.delete(writer) && writer.close()
    },

    subscribe (handler) {
      return this.subscribeStream(t => t.each(handler).consume())
    }
  }
}
