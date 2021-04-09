import {createDecipher, createCipher} from "crypto";
const bcrypt = require("bcrypt");

export namespace Crypto {
    export class Hash {
        public static decode(hash: string, password: string): string {
            let key = createDecipher('aes-128-cbc', password);
            let decodedString = key.update(hash, 'hex', 'utf8')
            decodedString += key.final('utf8');
            return decodedString;
        }

        public static encode(text: string, password: string): string {
            let key = createCipher('aes-128-cbc', password);
            let encodedString = key.update(text, 'utf8', 'hex')
            encodedString += key.final('hex');
            return encodedString;
        }
    }

    export class Password {
        public static hash(password: string): string {
            return bcrypt.hashSync(password, 10);
        }

        public static verify(hash:string, password: string): boolean {
            return bcrypt.compareSync(password, hash);
        }
    }
}
