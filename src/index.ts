import timestamp from 'monotonic-timestamp'
import { publicKeyToDid } from '@oddjs/odd/did/transformers'
import { toString } from 'uint8arrays'
import { Crypto } from '@oddjs/odd'
import * as BrowserCrypto from '@oddjs/odd/components/crypto/implementation/browser'
import { writeKeyToDid } from '@ssc-hermes/util'
import { create as createMsg, SignedRequest } from '@ssc-hermes/message'
import kebabCase from 'just-kebab-case'

export interface Profile {
    humanName:string
    urlName:string
    image?:string
    author:string
    username:string
    rootDID:string
    description?:string
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
        urlName: toUrl(args.humanName),
        image: args.image || null,
        username: (args.username || await createUsername(crypto)),
        rootDID: (args.rootDID || await writeKeyToDid(crypto))
    }))
}

export function toUrl (str:string) {
    return encodeURIComponent(kebabCase(str))
}

export async function createUsername (crypto:Crypto.Implementation|string):
Promise<string> {
    let did:string
    if (typeof crypto === 'string') {
        did = crypto
    } else {
        did = await createDID(crypto as Crypto.Implementation)
    }

    const normalizedDid = did.normalize('NFD')
    const hashedUsername = await BrowserCrypto.sha256(
        new TextEncoder().encode(normalizedDid)
    )

    return toString(hashedUsername, 'base32').slice(0, 32)
}

export async function createDID (crypto: Crypto.Implementation): Promise<string> {
    const pubKey = await crypto.keystore.publicExchangeKey()
    const ksAlg = await crypto.keystore.getAlgorithm()
    return publicKeyToDid(crypto, pubKey, ksAlg)
}
