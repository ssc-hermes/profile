import { test } from 'tapzero'
import * as odd from '@oddjs/odd'
import { verify } from '@ssc-hermes/message'
import { components } from '@ssc-hermes/node-components'
import { writeKeyToDid } from '@ssc-hermes/util'
import * as profile from '../dist/index.js'

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
        humanName: 'Alice'
    })

    t.ok(newProfile, 'should return a new profile')
    t.equal(newProfile.humanName, 'Alice', 'should have the right human name')
    const did = await writeKeyToDid(crypto)

    t.equal(newProfile.author, did, 'should have .author')
    t.equal(newProfile.rootDID, did, 'should have a `rootDID` property')

    const isValid = await verify(newProfile)
    t.equal(isValid, true, 'the new profile should have a valid signature')
})

test('create username', async t => {
    const { crypto } = program.components
    const username = await profile.createUsername(crypto)
    t.ok(username, 'should create a username')
    t.equal(typeof username, 'string', 'usernmae should be a string')
    t.equal(username.length, 32, 'should be 32 chars long')
})
