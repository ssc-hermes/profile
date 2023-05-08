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
    humanName: 'Alice'
})

// => {
//   humanName: 'Alice',
//   timestamp: 1683435717111,
//   username: 'fyrckpeigjv23y7bc572af6o7jyovstt',
//   rootDID: 'did:key:z13V3S...',
//   author: 'did:key:z13V3S...',
//   signature: 'i5rb0sMDx...'
// }
```

Then a server reading this message would need to see a UCAN that says that
the given `newProfileTwo.author` has been authorized by the `rootDID`
to make changes to this username, and also check that the given username is
related to the `rootDID`.
