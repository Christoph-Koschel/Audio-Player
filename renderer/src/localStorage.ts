import * as fs from "fs";
import {remote} from "electron";
import * as path from "path";
import {Crypto} from "./crypto";
import Hash = Crypto.Hash;

export class LocalStorage {
    private static storagePath = path.join(remote.app.getPath("userData"), "localstorage")

    public getItem(key: string): string {
        let storage: any = this.load();
        if (storage[key]) {
            return storage[key];
        } else {
            return "";
        }
    }

    public setItem(key:string, value: string): void {
        let storage: any = this.load();

        storage[key] = value;
        this.update(storage);
    }

    public hasItem(key:string): boolean {
        let storage = this.load();
        return (storage[key]);
    }

    private load(): any {
        if (fs.existsSync(LocalStorage.storagePath)) {
            let storage: string = fs.readFileSync(LocalStorage.storagePath, "utf8");
            storage = Hash.decode(storage, "localStorage");
            try {
                let json: any = JSON.parse(storage);
                if (typeof json === "object") {
                    return json;
                } else {
                    throw "Error on LocalStorage";
                }
            } catch {
                throw "Error on LocalStorage";
            }
        } else {
            fs.writeFileSync(LocalStorage.storagePath, Hash.encode("{}", "localStorage"));
            return {};
        }
    }

    private update(storage: any): void {
        fs.writeFileSync(LocalStorage.storagePath, Hash.encode(JSON.stringify(storage), "localStorage"));
    }
}
