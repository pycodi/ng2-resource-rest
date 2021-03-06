import { Type } from '@angular/core/src/type';
import { Observable } from 'rxjs/Rx';
import { ResourceModelParamsBase } from './Interfaces';
import { Resource } from './Resource';
export declare function ResourceModelParams(params?: ResourceModelParamsBase): (target: Type<ResourceModel>) => void;
export declare class ResourceModel {
    static resourceClass: Type<Resource>;
    static resourceInstance: Resource;
    $resolved: boolean;
    $observable: Observable<any>;
    $abortRequest: () => void;
    $primaryKey: string;
    $resource: Resource;
    static create(data?: any, commit?: boolean): any;
    $fillFromObject(_object: any): this;
    $getData(): any;
    $save(): this;
    $update(): this;
    $remove(): this;
    private $resource_method(method_name);
    private $create();
}
