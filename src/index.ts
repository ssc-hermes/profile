import timestamp from 'monotonic-timestamp'
import { Crypto } from '@oddjs/odd'
import { writeKeyToDid } from '@ssc-hermes/util'
import { create as createMsg, SignedRequest } from '@ssc-hermes/message'
import { createUsername } from './util.js'

export interface Profile {
    humanName: string
    image: string|null
    author: string
    username: string
    rootDID: string
    description?: string
    timestamp:number
}

export type SignedProfile = SignedRequest<Profile>

interface ProfileArgs {
    humanName:string,
    username?:string,
    description?:string,
    rootDID?:string,
    image?:string  // a URL
}

/**
 * Create a signed Profile object in-memory. Root DID can be passed in, or if not we
 * assume that it is the DID being used to sign the message.
 * @param crypto {Crypto.Implementation}
 * @param args {{humanName, username, description?, rootDID?}}
 * @returns {Promise<SignedProfile>} The new profile + signature
 */
export async function create (crypto:Crypto.Implementation, args:ProfileArgs)
:Promise<SignedProfile> {
    return createMsg(crypto, Object.assign({}, args, {
        // author comes from `createMsg`
        timestamp: timestamp(),
        image: args.image || null,
        username: (args.username || await createUsername(crypto)),
        rootDID: (args.rootDID || await writeKeyToDid(crypto))
    }))
}
