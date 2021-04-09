export declare namespace Crypto {
    class Hash {
        static decode(hash: string, password: string): string;
        static encode(text: string, password: string): string;
    }
    class Password {
        static hash(password: string): string;
        static verify(hash: string, password: string): boolean;
    }
}
//# sourceMappingURL=crypto.d.ts.map