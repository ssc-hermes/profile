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
    humanName: 'Alice',
    username: 'abc123'
})
```

```js
const newProfileTwo = await profile.create(crypto, {
    humanName: 'Alice',
    username: 'abc123',
    // can also create a description
    description: 'describing things',
    // if you are writing from a machine that is not the root machine,
    // pass in the rootDID
    rootDID: 'did:key:z13V3...'
})
```
