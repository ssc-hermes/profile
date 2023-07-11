# profile ![tests](https://github.com/ssc-hermes/profile/actions/workflows/nodejs.yml/badge.svg)

Profile data for *hermes*.

## install
```bash
npm i -S @ssc-hermes/profile
```

## profile type

```ts
interface Profile {
    humanName: string
    url: string  // <- a URL encoded string of the human name
    author: string
    username: string
    rootDID: string
    description?: string
    timestamp:number
}
```

## example
This creates a `profile` object in memory. You would then want to save the profile
somehow.

### minimal parameters
```js
import * as odd from '@oddjs/odd'
import * as profile from '@ssc-hermes/profile'

const program = await odd.program({
    namespace: { creator: 'creator', name: 'test' },
    debug: true
})

const { crypto } = program.components

// minimal parameters
// this assumes that the rootDID is the current machine
const newProfile = await profile.create(crypto, {
    humanName: 'Alice 🐙'
})

// => {
//   humanName: 'Alice 🐙'
//   url: 'alice-%F0%9F%90%99'  // <- a URL encoded string of the `humanName`
//   timestamp: 1683435717111,
//   username: 'fyrckpeigjv23y7bc572af6o7jyovstt',
//   rootDID: 'did:key:z13V3S...',
//   author: 'did:key:z13V3S...',
//   signature: 'i5rb0sMDx...'
// }
```

### more parameters
```js
const newProfile2 = await profile.create(crypto, {
    humanName: 'Alice',
    // can also create a description
    description: 'describing things',
    // if you are writing from a machine that is not the root
    // machine, pass in the rootDID
    rootDID: 'did:key:z13V3...'
})
```

### util.createUsername
Helper that will create a DNS friendly, unique username based on your public key.

```js
import * as util from '@ssc-hermes/profile/util'

test('create username', async t => {
    const { crypto } = program.components
    const username = await util.createUsername(crypto)
    t.ok(username, 'should create a username')
    t.equal(typeof username, 'string', 'usernmae should be a string')
    t.equal(username.length, 32, 'should be 32 chars long')
})
```
