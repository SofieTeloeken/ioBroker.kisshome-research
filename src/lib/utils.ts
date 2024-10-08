// @ts-expect-error no types
import { get_gateway_ip } from 'network';
import { toMAC } from '@network-utils/arp-lookup';
import { toVendor } from '@network-utils/vendor-lookup';
import crypto from 'node:crypto';

export async function getMacForIp(ip: string): Promise<{ mac: string; vendor?: string; ip: string } | null> {
    const mac = await toMAC(ip);
    if (mac) {
        return { mac: mac.toUpperCase(), vendor: toVendor(mac), ip };
    }
    return null
}

export function getDefaultGateway(): Promise<string> {
    return new Promise((resolve, reject) => get_gateway_ip((err: string, ip: string) => {
        if (err) {
            return reject(err);
        }
        return resolve(ip);
    }));
}

export function generateKeys(): { publicKey: string; privateKey: string } {
    // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    //     modulusLength: 4096, // bits - standard for RSA keys
    //     publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    //     privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    // });
    // const sshKeyBodyPublic = publicKey.toString();

    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const sshKeyBodyPublic = publicKey.toString().split('\n').slice(1, -2).join('');

    return { publicKey: sshKeyBodyPublic, privateKey: privateKey.toString() };
}
