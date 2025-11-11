export declare class Logger {
    private static _instance;
    private readonly _debug;
    static get Instance(): Logger;
    info(msg: string): void;
    err(msg: string | Error | unknown): void;
    warn(msg: string): void;
    debug(msg: string): void;
    private log;
}
