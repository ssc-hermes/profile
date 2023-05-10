import { toString } from 'uint8arrays'
import * as BrowserCrypto from '@oddjs/odd/components/crypto/implementation/browser'
import type { Crypto } from '@oddjs/odd'
import { publicKeyToDid } from '@oddjs/odd/did/transformers'

export async function createUsername (crypto:Crypto.Implementation):Promise<string> {
    const did = await createDID(crypto)
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
