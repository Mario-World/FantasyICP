declare module '*/query.idl.js' {
    import { IDL } from '@dfinity/candid';
    export const idlFactory: IDL.InterfaceFactory;
    export const init: (args: { IDL: IDL }) => [];
} 