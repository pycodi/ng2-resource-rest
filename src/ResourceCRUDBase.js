var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { RequestMethod } from '@angular/http';
import { Resource } from './Resource';
import { ResourceAction } from './ResourceAction';
export var ResourceCRUDBase = (function (_super) {
    __extends(ResourceCRUDBase, _super);
    function ResourceCRUDBase() {
        _super.apply(this, arguments);
    }
    // Alias to save
    ResourceCRUDBase.prototype.create = function (data, callback) {
        return this.save(data, callback);
    };
    __decorate([
        ResourceAction({
            isArray: true
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "query", void 0);
    __decorate([
        ResourceAction(), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "get", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Post
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "save", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Put
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "update", void 0);
    __decorate([
        ResourceAction({
            method: RequestMethod.Delete
        }), 
        __metadata('design:type', Function)
    ], ResourceCRUDBase.prototype, "remove", void 0);
    return ResourceCRUDBase;
}(Resource));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VDUlVEQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJlc291cmNlQ1JVREJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7T0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWU7T0FDcEMsRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZO09BRTVCLEVBQUMsY0FBYyxFQUFDLE1BQU0sa0JBQWtCO0FBRS9DO0lBQW9FLG9DQUFRO0lBQTVFO1FBQW9FLDhCQUFRO0lBOEI1RSxDQUFDO0lBTEMsZ0JBQWdCO0lBQ2hCLGlDQUFNLEdBQU4sVUFBTyxJQUFXLEVBQUUsUUFBOEI7UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUExQkQ7UUFBQyxjQUFjLENBQUM7WUFDZCxPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7O21EQUFBO0lBR0Y7UUFBQyxjQUFjLEVBQUU7O2lEQUFBO0lBR2pCO1FBQUMsY0FBYyxDQUFDO1lBQ2QsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFJO1NBQzNCLENBQUM7O2tEQUFBO0lBR0Y7UUFBQyxjQUFjLENBQUM7WUFDZCxNQUFNLEVBQUUsYUFBYSxDQUFDLEdBQUc7U0FDMUIsQ0FBQzs7b0RBQUE7SUFHRjtRQUFDLGNBQWMsQ0FBQztZQUNkLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTTtTQUM3QixDQUFDOztvREFBQTtJQVFKLHVCQUFDO0FBQUQsQ0FBQyxBQTlCRCxDQUFvRSxRQUFRLEdBOEIzRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVxdWVzdE1ldGhvZH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQge1Jlc291cmNlfSBmcm9tICcuL1Jlc291cmNlJztcbmltcG9ydCB7UmVzb3VyY2VNZXRob2R9IGZyb20gJy4vSW50ZXJmYWNlcyc7XG5pbXBvcnQge1Jlc291cmNlQWN0aW9ufSBmcm9tICcuL1Jlc291cmNlQWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIFJlc291cmNlQ1JVREJhc2U8VFF1ZXJ5LCBUS2V5cywgVFNob3J0LCBURnVsbD4gZXh0ZW5kcyBSZXNvdXJjZSB7XG5cbiAgQFJlc291cmNlQWN0aW9uKHtcbiAgICBpc0FycmF5OiB0cnVlXG4gIH0pXG4gIHF1ZXJ5OiBSZXNvdXJjZU1ldGhvZDxUUXVlcnksIFRTaG9ydFtdPjtcblxuICBAUmVzb3VyY2VBY3Rpb24oKVxuICBnZXQ6IFJlc291cmNlTWV0aG9kPFRLZXlzLCBURnVsbD47XG5cbiAgQFJlc291cmNlQWN0aW9uKHtcbiAgICBtZXRob2Q6IFJlcXVlc3RNZXRob2QuUG9zdFxuICB9KVxuICBzYXZlOiBSZXNvdXJjZU1ldGhvZDxURnVsbCwgVEZ1bGw+O1xuXG4gIEBSZXNvdXJjZUFjdGlvbih7XG4gICAgbWV0aG9kOiBSZXF1ZXN0TWV0aG9kLlB1dFxuICB9KVxuICB1cGRhdGU6IFJlc291cmNlTWV0aG9kPFRGdWxsLCBURnVsbD47XG5cbiAgQFJlc291cmNlQWN0aW9uKHtcbiAgICBtZXRob2Q6IFJlcXVlc3RNZXRob2QuRGVsZXRlXG4gIH0pXG4gIHJlbW92ZTogUmVzb3VyY2VNZXRob2Q8VEtleXMsIGFueT47XG5cbiAgLy8gQWxpYXMgdG8gc2F2ZVxuICBjcmVhdGUoZGF0YTogVEZ1bGwsIGNhbGxiYWNrPzogKHJlczogVEZ1bGwpID0+IGFueSk6IFRGdWxsIHtcbiAgICByZXR1cm4gdGhpcy5zYXZlKGRhdGEsIGNhbGxiYWNrKTtcbiAgfVxuXG59XG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==