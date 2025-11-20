#!/usr/bin/env node
import 'reflect-metadata';
export declare function readFile(path: string): Promise<string>;
export declare function writeFile(path: string, fileData: string): Promise<void>;
export declare function validateOptionFormat(name: string, value: string, path: string): string;
export declare function validateOptionPath(name: string, value: string, existsCheck?: boolean): string;
