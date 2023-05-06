import { test } from 'tapzero'
import * as odd from '@oddjs/odd'
import { verify } from '@ssc-hermes/message'
import { components } from '@ssc-hermes/node-components'
import * as profile from '@ssc-hermes/profile'
import { writeKeyToDid } from '@ssc-hermes/util'

let program

test('setup', async t => {
    program = await odd.assemble({
        namespace: { creator: 'test', name: 'testing' },
        debug: false
    }, components)

    t.ok(program, 'create a program')
})

test('profile.create', async t => {
    const { crypto } = program.components
    const newProfile = await profile.create(crypto, {
        humanName: 'Alice',
        username: 'alice-123'
    })

    t.ok(newProfile, 'should return a new profile')
    t.equal(newProfile.humanName, 'Alice', 'should have the right human name')
    const did = await writeKeyToDid(crypto)

    t.equal(newProfile.author, did, 'should have .author')
    t.equal(newProfile.rootDID, did, 'should have a `rootDID` property')

    const isValid = await verify(newProfile)
    t.equal(isValid, true, 'the new profile should have a valid signature')
})
