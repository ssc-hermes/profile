# profile ![tests](https://github.com/ssc-hermes/profile/actions/workflows/nodejs.yml/badge.svg)

Profile data for *hermes*.

## install
Install from github because this is a private repo

```bash
npm i -S ssc-hermes/profile
```

## example
This creates `profile` objects in memory. You would then want to save it somehow.

```js
import * as odd from '@oddjs/odd'
import * as profile from '@ssc-hermes/profile'

const program = await odd.program({
    namespace: { creator: 'creator', name: 'test' },
    debug: true
})

const { crypto } = program.components

// minimum parameters
const newProfile = await profile.create(crypto, {
    humanName: 'Alice'
})
// this assumes that the rootDID is the current machine

// => {
//   humanName: 'Alice',
//   timestamp: 1683435717111,
//   username: 'fyrckpeigjv23y7bc572af6o7jyovstt',
//   rootDID: 'did:key:z13V3S...',
//   author: 'did:key:z13V3S...',
//   signature: 'i5rb0sMDx...'
// }
```

```js
const newProfile2 = await profile.create(crypto, {
    humanName: 'Alice',
    username: 'abc123',
    // can also create a description
    description: 'describing things',
    // if you are writing from a machine that is not the root
    // machine, pass in the rootDID
    rootDID: 'did:key:z13V3...'
})

// then whoever is reading this message would need to see a UCAN that says that
// the given `newProfileTwo.author` has been authorized by the given `rootDID`
// to make changes to this username, and also check that the given username is
// related to the given `rootDID`
```

## profile type

```ts
interface Profile {
    humanName: string
    author: string
    username: string
    rootDID: string
    description?: string
    timestamp:number
}
```
