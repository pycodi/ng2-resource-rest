import { Provider } from '@angular/core';
import { Type } from '@angular/core/src/type';
import { Resource } from './Resource';
export declare class ResourceProviders {
    static mainProvidersName: string;
    static providers: {
        [id: string]: Provider[];
    };
    static add(resource: Type<Resource>, subSet?: string): void;
    static get(subSet?: string): Provider[];
}
