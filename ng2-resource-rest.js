import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ResourceProviders } from './src/ResourceProviders';
export * from './src/Interfaces';
export * from './src/Resource';
export * from './src/ResourceAction';
export * from './src/ResourceCRUD';
export * from './src/ResourceCRUDBase';
export * from './src/ResourceGlobalConfig';
export * from './src/ResourceModel';
export * from './src/ResourceParams';
export * from './src/ResourceProviders';
export var ResourceModule = (function () {
    function ResourceModule() {
    }
    ResourceModule.forRoot = function () {
        return {
            ngModule: ResourceModule,
            providers: ResourceProviders.providers[ResourceProviders.mainProvidersName]
        };
    };
    ResourceModule.forChild = function (subSet) {
        return {
            ngModule: ResourceModule,
            providers: ResourceProviders.providers[subSet] ? ResourceProviders.providers[subSet] : []
        };
    };
    ResourceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, HttpModule]
                },] },
    ];
    /** @nocollapse */
    ResourceModule.ctorParameters = [];
    return ResourceModule;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLXJlc291cmNlLXJlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzItcmVzb3VyY2UtcmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFFBQVEsRUFBc0IsTUFBTSxlQUFlO09BQ3BELEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCO09BQ3JDLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZTtPQUNqQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0seUJBQXlCO0FBRXpELGNBQWMsa0JBQWtCLENBQUM7QUFDakMsY0FBYyxnQkFBZ0IsQ0FBQztBQUMvQixjQUFjLHNCQUFzQixDQUFDO0FBQ3JDLGNBQWMsb0JBQW9CLENBQUM7QUFDbkMsY0FBYyx3QkFBd0IsQ0FBQztBQUN2QyxjQUFjLDRCQUE0QixDQUFDO0FBQzNDLGNBQWMscUJBQXFCLENBQUM7QUFDcEMsY0FBYyxzQkFBc0IsQ0FBQztBQUNyQyxjQUFjLHlCQUF5QixDQUFDO0FBR3hDO0lBQUE7SUF1QkEsQ0FBQztJQXRCUSxzQkFBTyxHQUFkO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGNBQWM7WUFDeEIsU0FBUyxFQUFFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztTQUM1RSxDQUFDO0lBQ0osQ0FBQztJQUVNLHVCQUFRLEdBQWYsVUFBZ0IsTUFBYztRQUM1QixNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1NBQzFGLENBQUM7SUFDSixDQUFDO0lBRUkseUJBQVUsR0FBMEI7UUFDM0MsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2lCQUNwQyxFQUFHLEVBQUU7S0FDTCxDQUFDO0lBQ0Ysa0JBQWtCO0lBQ1gsNkJBQWMsR0FBNkQsRUFDakYsQ0FBQztJQUNGLHFCQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0h0dHBNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHtSZXNvdXJjZVByb3ZpZGVyc30gZnJvbSAnLi9zcmMvUmVzb3VyY2VQcm92aWRlcnMnO1xuXG5leHBvcnQgKiBmcm9tICcuL3NyYy9JbnRlcmZhY2VzJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlQWN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlQ1JVRCc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9SZXNvdXJjZUNSVURCYXNlJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlR2xvYmFsQ29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL1Jlc291cmNlTW9kZWwnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvUmVzb3VyY2VQYXJhbXMnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvUmVzb3VyY2VQcm92aWRlcnMnO1xuXG5cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVzb3VyY2VNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFJlc291cmNlUHJvdmlkZXJzLnByb3ZpZGVyc1tSZXNvdXJjZVByb3ZpZGVycy5tYWluUHJvdmlkZXJzTmFtZV1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZvckNoaWxkKHN1YlNldDogc3RyaW5nKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBSZXNvdXJjZU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogUmVzb3VyY2VQcm92aWRlcnMucHJvdmlkZXJzW3N1YlNldF0gPyBSZXNvdXJjZVByb3ZpZGVycy5wcm92aWRlcnNbc3ViU2V0XSA6IFtdXG4gICAgfTtcbiAgfVxuXG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSHR0cE1vZHVsZV1cbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSBbXG5dO1xufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=