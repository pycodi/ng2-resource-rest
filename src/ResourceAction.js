import { RequestMethod, Headers, URLSearchParams, RequestOptions, Request } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ReflectiveInjector } from '@angular/core';
export function ResourceAction(methodOptions) {
    methodOptions = methodOptions || {};
    if (methodOptions.method === undefined) {
        methodOptions.method = RequestMethod.Get;
    }
    if (methodOptions.useModel === undefined) {
        methodOptions.useModel = true;
    }
    return function (target, propertyKey) {
        target[propertyKey] = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var resourceOptions = this._getResourceOptions();
            var isGetRequest = methodOptions.method === RequestMethod.Get;
            var ret;
            var resourceModel;
            if (methodOptions.useModel) {
                if (this.constructor.hasOwnProperty('getResourceModel') && !methodOptions.model) {
                    resourceModel = this.constructor.getResourceModel(args);
                }
                else {
                    resourceModel = methodOptions.model || this.constructor['model'];
                }
            }
            if (resourceModel && !methodOptions.isArray) {
                ret = resourceModel.create({}, false);
            }
            else if (methodOptions.isLazy) {
                ret = {};
            }
            else {
                ret = methodOptions.isArray ? [] : {};
            }
            var mainDeferredSubscriber = null;
            var mainObservable = null;
            ret.$resolved = false;
            ret.$observable = Observable.create(function (subscriber) {
                mainDeferredSubscriber = subscriber;
            }).flatMap(function () { return mainObservable; });
            ret.$abortRequest = function () {
                ret.$resolved = true;
            };
            function releaseMainDeferredSubscriber() {
                if (mainDeferredSubscriber) {
                    mainDeferredSubscriber.next();
                    mainDeferredSubscriber.complete();
                    mainDeferredSubscriber = null;
                }
            }
            if (!methodOptions.isLazy) {
                ret.$observable = ret.$observable.publish();
                ret.$observable.connect();
            }
            Promise.all([
                Promise.resolve(methodOptions.url || this.getUrl()),
                Promise.resolve(methodOptions.path || this.getPath()),
                Promise.resolve(methodOptions.headers || this.getHeaders()),
                Promise.resolve(methodOptions.params || this.getParams()),
                Promise.resolve(methodOptions.data || this.getData())
            ])
                .then(function (dataAll) {
                if (ret.$resolved) {
                    mainObservable = Observable.create(function (observer) {
                        observer.next(null);
                    });
                    releaseMainDeferredSubscriber();
                }
                var url = dataAll[0] + dataAll[1];
                var headers = new Headers(dataAll[2]);
                var defPathParams = dataAll[3];
                var data = args.length ? args[0] : null;
                var callback = args.length > 1 ? args[1] : null;
                if (typeof data === 'function') {
                    if (!callback) {
                        callback = data;
                        data = null;
                    }
                    else if (typeof callback !== 'function') {
                        var tmpData = callback;
                        callback = data;
                        data = tmpData;
                    }
                    else {
                        data = null;
                    }
                }
                var usedPathParams = {};
                if (!Array.isArray(data)) {
                    data = Object.assign({}, dataAll[4], data);
                    var pathParams = url.match(/{([^}]*)}/g) || [];
                    var _loop_1 = function(i) {
                        var pathParam = pathParams[i];
                        var pathKey = pathParam.substr(1, pathParam.length - 2);
                        var isMandatory = pathKey[0] === '!';
                        if (isMandatory) {
                            pathKey = pathKey.substr(1);
                        }
                        var isGetOnly = pathKey[0] === ':';
                        if (isGetOnly) {
                            pathKey = pathKey.substr(1);
                        }
                        var value = getValueForPath(pathKey, defPathParams, data, usedPathParams);
                        if (isGetOnly) {
                            delete data[pathKey];
                        }
                        if (!value) {
                            if (isMandatory) {
                                var consoleMsg_1 = "Mandatory " + pathParam + " path parameter is missing";
                                mainObservable = Observable.create(function (observer) {
                                    observer.error(new Error(consoleMsg_1));
                                });
                                console.warn(consoleMsg_1);
                                releaseMainDeferredSubscriber();
                                return { value: void 0 };
                            }
                            url = url.substr(0, url.indexOf(pathParam));
                            return "break";
                        }
                        // Replacing in the url
                        url = url.replace(pathParam, value);
                    };
                    for (var i = 0; i < pathParams.length; i++) {
                        var state_1 = _loop_1(i);
                        if (typeof state_1 === "object") return state_1.value;
                        if (state_1 === "break") break;
                    }
                }
                // Removing double slashed from final url
                url = url.replace(/\/\/+/g, '/');
                if (url.startsWith('http')) {
                    url = url.replace(':/', '://');
                }
                // Remove trailing slash
                if (typeof methodOptions.removeTrailingSlash === 'undefined') {
                    methodOptions.removeTrailingSlash = _this.removeTrailingSlash();
                }
                if (methodOptions.removeTrailingSlash) {
                    while (url[url.length - 1] === '/') {
                        url = url.substr(0, url.length - 1);
                    }
                }
                // Remove mapped params
                for (var key in defPathParams) {
                    if (defPathParams[key][0] === '@') {
                        delete defPathParams[key];
                    }
                }
                // Default search params or data
                var body = null;
                var searchParams;
                if (isGetRequest) {
                    // GET
                    searchParams = Object.assign({}, defPathParams, data);
                }
                else {
                    // NON GET
                    if (data) {
                        body = JSON.stringify(data);
                    }
                    searchParams = defPathParams;
                }
                // Setting search params
                var search = new URLSearchParams();
                for (var key in searchParams) {
                    if (!usedPathParams[key]) {
                        var value = searchParams[key];
                        if (Array.isArray(value)) {
                            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                                var arr_value = value_1[_i];
                                search.append(key, arr_value);
                            }
                        }
                        else {
                            if (typeof value === 'object') {
                                /// Convert dates to ISO format string
                                if (value instanceof Date) {
                                    value = value.toISOString();
                                }
                                else {
                                    value = JSON.stringify(value);
                                }
                            }
                            search.append(key, value);
                        }
                    }
                }
                // Adding TS if needed
                var tsName = methodOptions.addTimestamp || resourceOptions.addTimestamp;
                if (tsName) {
                    if (tsName === true) {
                        tsName = 'ts';
                    }
                    search.append(tsName, '' + new Date().getTime());
                }
                // Removing Content-Type header if no body
                if (!body) {
                    headers.delete('content-type');
                }
                // Creating request options
                var requestOptions = new RequestOptions({
                    method: methodOptions.method,
                    headers: headers,
                    body: body,
                    url: url,
                    search: search
                });
                // Creating request object
                var req = new Request(requestOptions);
                req = methodOptions.requestInterceptor ?
                    methodOptions.requestInterceptor(req) :
                    _this.requestInterceptor(req);
                if (!req) {
                    mainObservable = Observable.create(function (observer) {
                        observer.error(new Error('Request is null'));
                    });
                    console.warn('Request is null');
                    releaseMainDeferredSubscriber();
                    return;
                }
                // Doing the request
                var requestObservable = _this.http.request(req);
                // noinspection TypeScriptValidateTypes
                requestObservable = methodOptions.responseInterceptor ?
                    methodOptions.responseInterceptor.bind(_this)(requestObservable, req) :
                    _this.responseInterceptor(requestObservable, req);
                if (methodOptions.isLazy) {
                    mainObservable = requestObservable;
                }
                else {
                    mainObservable = Observable.create(function (subscriber) {
                        var reqSubscr = requestObservable.subscribe(function (resp) {
                            if (resp !== null) {
                                var map = methodOptions.map ? methodOptions.map : _this.map;
                                var filter = methodOptions.filter ? methodOptions.filter : _this.filter;
                                if (methodOptions.isArray) {
                                    if (!Array.isArray(resp)) {
                                        console.error('Returned data should be an array. Received', resp);
                                    }
                                    else {
                                        var result = resp.filter(filter).map(map);
                                        result = !!resourceModel ? mapToModel.bind(_this)(result, resourceModel) : result;
                                        Array.prototype.push.apply(ret, result);
                                    }
                                }
                                else {
                                    if (Array.isArray(resp)) {
                                        console.error('Returned data should be an object. Received', resp);
                                    }
                                    else {
                                        if (filter(resp)) {
                                            if (!!resourceModel) {
                                                ret.$fillFromObject(map(resp));
                                            }
                                            else {
                                                Object.assign(ret, map(resp));
                                            }
                                        }
                                    }
                                }
                            }
                            subscriber.next(resp);
                        }, function (err) { return subscriber.error(err); }, function () {
                            ret.$resolved = true;
                            subscriber.complete();
                            if (callback) {
                                callback(ret);
                            }
                        });
                        ret.$abortRequest = function () {
                            if (ret.$resolved) {
                                return;
                            }
                            reqSubscr.unsubscribe();
                            ret.$resolved = true;
                        };
                    });
                }
                releaseMainDeferredSubscriber();
            });
            if (resourceModel) {
                ret.$observable = ret.$observable.map(function (resp) {
                    return mapToModel.bind(_this)(resp, resourceModel);
                });
            }
            return ret;
        };
    };
}
export function mapToModel(resp, model) {
    var modelProviders = Reflect.getMetadata('providers', model) || [];
    var providers = ReflectiveInjector.resolve(modelProviders);
    var injector = ReflectiveInjector.fromResolvedProviders(providers, this.injector);
    var properties = Reflect.getMetadata('design:paramtypes', model) || [];
    var injection = [];
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        injection.push(injector.get(property));
    }
    var result;
    if (Array.isArray(resp)) {
        result = [];
        for (var _a = 0, resp_1 = resp; _a < resp_1.length; _a++) {
            var item = resp_1[_a];
            var modelInstance = new (model.bind.apply(model, [void 0].concat(injection)))().$fillFromObject(item);
            modelInstance.$resource = this;
            result.push(modelInstance);
        }
    }
    else {
        result = new (model.bind.apply(model, [void 0].concat(injection)))().$fillFromObject(resp);
        result.$resource = this;
    }
    return result;
}
function getValueForPath(key, params, data, usedPathParams) {
    if (typeof data[key] !== 'object') {
        usedPathParams[key] = true;
        return data[key];
    }
    if (!params[key]) {
        return null;
    }
    if (params[key][0] === '@') {
        return getValueForPath(params[key].substr(1), params, data, usedPathParams);
    }
    usedPathParams[key] = true;
    return params[key];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNvdXJjZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFFLGFBQWEsRUFBWSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlO09BQ25HLEVBQWMsVUFBVSxFQUF1QyxNQUFNLFNBQVM7T0FDOUUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGVBQWU7QUFPbEQsK0JBQStCLGFBQWtDO0lBRS9ELGFBQWEsR0FBRyxhQUFhLElBQUksRUFBRSxDQUFDO0lBRXBDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2QyxhQUFhLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7SUFDM0MsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN6QyxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBR0QsTUFBTSxDQUFDLFVBQVUsTUFBZ0IsRUFBRSxXQUFtQjtRQUU5QyxNQUFPLENBQUMsV0FBVyxDQUFDLEdBQUc7WUFBQSxpQkFtVjVCO1lBblZzQyxjQUFjO2lCQUFkLFdBQWMsQ0FBZCxzQkFBYyxDQUFkLElBQWM7Z0JBQWQsNkJBQWM7O1lBRW5ELElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRWpELElBQUksWUFBWSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEtBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUU5RCxJQUFJLEdBQXdDLENBQUM7WUFFN0MsSUFBSSxhQUFrQixDQUFDO1lBRXZCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMs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QU0sQ0FBQztBQUNoQixDQUFDO0FBRUQseUJBQXlCLEdBQVcsRUFBRSxNQUFXLEVBQUUsSUFBUyxFQUFFLGNBQW1CO0lBRS9FLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMzQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0TWV0aG9kLCBSZXNwb25zZSwgSGVhZGVycywgVVJMU2VhcmNoUGFyYW1zLCBSZXF1ZXN0T3B0aW9ucywgUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciwgT2JzZXJ2YWJsZSwgQ29ubmVjdGFibGVPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzL1J4JztcbmltcG9ydCB7IFJlZmxlY3RpdmVJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3R5cGUnO1xuaW1wb3J0IHsgUmVzb3VyY2VBY3Rpb25CYXNlLCBSZXNvdXJjZVJlc3VsdCwgUmVzb3VyY2VSZXNwb25zZU1hcCwgUmVzb3VyY2VSZXNwb25zZUZpbHRlciB9IGZyb20gJy4vSW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJy4vUmVzb3VyY2UnO1xuaW1wb3J0IHsgUmVzb3VyY2VNb2RlbCB9IGZyb20gJy4vUmVzb3VyY2VNb2RlbCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFJlc291cmNlQWN0aW9uKG1ldGhvZE9wdGlvbnM/OiBSZXNvdXJjZUFjdGlvbkJhc2UpIHtcblxuICBtZXRob2RPcHRpb25zID0gbWV0aG9kT3B0aW9ucyB8fCB7fTtcblxuICBpZiAobWV0aG9kT3B0aW9ucy5tZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgIG1ldGhvZE9wdGlvbnMubWV0aG9kID0gUmVxdWVzdE1ldGhvZC5HZXQ7XG4gIH1cblxuICBpZiAobWV0aG9kT3B0aW9ucy51c2VNb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWV0aG9kT3B0aW9ucy51c2VNb2RlbCA9IHRydWU7XG4gIH1cblxuXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBSZXNvdXJjZSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXG4gICAgKDxhbnk+dGFyZ2V0KVtwcm9wZXJ0eUtleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pOiBSZXNvdXJjZVJlc3VsdDxhbnk+IHwgUmVzb3VyY2VNb2RlbCB7XG5cbiAgICAgIGxldCByZXNvdXJjZU9wdGlvbnMgPSB0aGlzLl9nZXRSZXNvdXJjZU9wdGlvbnMoKTtcblxuICAgICAgbGV0IGlzR2V0UmVxdWVzdCA9IG1ldGhvZE9wdGlvbnMubWV0aG9kID09PSBSZXF1ZXN0TWV0aG9kLkdldDtcblxuICAgICAgbGV0IHJldDogUmVzb3VyY2VSZXN1bHQ8YW55PiB8IFJlc291cmNlTW9kZWw7XG5cbiAgICAgIGxldCByZXNvdXJjZU1vZGVsOiBhbnk7XG5cbiAgICAgIGlmIChtZXRob2RPcHRpb25zLnVzZU1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLmhhc093blByb3BlcnR5KCdnZXRSZXNvdXJjZU1vZGVsJykgJiYgIW1ldGhvZE9wdGlvbnMubW9kZWwpIHtcbiAgICAgICAgICByZXNvdXJjZU1vZGVsID0gdGhpcy5jb25zdHJ1Y3Rvci5nZXRSZXNvdXJjZU1vZGVsKGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc291cmNlTW9kZWwgPSBtZXRob2RPcHRpb25zLm1vZGVsIHx8IHRoaXMuY29uc3RydWN0b3JbJ21vZGVsJ107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJlc291cmNlTW9kZWwgJiYgIW1ldGhvZE9wdGlvbnMuaXNBcnJheSkge1xuICAgICAgICByZXQgPSByZXNvdXJjZU1vZGVsLmNyZWF0ZSh7fSwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChtZXRob2RPcHRpb25zLmlzTGF6eSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldCA9IG1ldGhvZE9wdGlvbnMuaXNBcnJheSA/IFtdIDoge307XG4gICAgICB9XG5cbiAgICAgIGxldCBtYWluRGVmZXJyZWRTdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4gPSBudWxsO1xuICAgICAgbGV0IG1haW5PYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFJlc3BvbnNlPiA9IG51bGw7XG5cbiAgICAgIHJldC4kcmVzb2x2ZWQgPSBmYWxzZTtcbiAgICAgIHJldC4kb2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pID0+IHtcbiAgICAgICAgbWFpbkRlZmVycmVkU3Vic2NyaWJlciA9IHN1YnNjcmliZXI7XG4gICAgICB9KS5mbGF0TWFwKCgpID0+IG1haW5PYnNlcnZhYmxlKTtcbiAgICAgIHJldC4kYWJvcnRSZXF1ZXN0ID0gKCkgPT4ge1xuICAgICAgICByZXQuJHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIHJlbGVhc2VNYWluRGVmZXJyZWRTdWJzY3JpYmVyKCkge1xuICAgICAgICBpZiAobWFpbkRlZmVycmVkU3Vic2NyaWJlcikge1xuICAgICAgICAgIG1haW5EZWZlcnJlZFN1YnNjcmliZXIubmV4dCgpO1xuICAgICAgICAgIG1haW5EZWZlcnJlZFN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBtYWluRGVmZXJyZWRTdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIGlmICghbWV0aG9kT3B0aW9ucy5pc0xhenkpIHtcbiAgICAgICAgcmV0LiRvYnNlcnZhYmxlID0gcmV0LiRvYnNlcnZhYmxlLnB1Ymxpc2goKTtcbiAgICAgICAgKDxDb25uZWN0YWJsZU9ic2VydmFibGU8YW55Pj5yZXQuJG9ic2VydmFibGUpLmNvbm5lY3QoKTtcbiAgICAgIH1cblxuICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy51cmwgfHwgdGhpcy5nZXRVcmwoKSksXG4gICAgICAgIFByb21pc2UucmVzb2x2ZShtZXRob2RPcHRpb25zLnBhdGggfHwgdGhpcy5nZXRQYXRoKCkpLFxuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy5oZWFkZXJzIHx8IHRoaXMuZ2V0SGVhZGVycygpKSxcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKG1ldGhvZE9wdGlvbnMucGFyYW1zIHx8IHRoaXMuZ2V0UGFyYW1zKCkpLFxuICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kT3B0aW9ucy5kYXRhIHx8IHRoaXMuZ2V0RGF0YSgpKVxuICAgICAgXSlcbiAgICAgICAgLnRoZW4oKGRhdGFBbGw6IGFueVtdKSA9PiB7XG5cbiAgICAgICAgICBpZiAocmV0LiRyZXNvbHZlZCkge1xuICAgICAgICAgICAgbWFpbk9ic2VydmFibGUgPSBPYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KG51bGwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlbGVhc2VNYWluRGVmZXJyZWRTdWJzY3JpYmVyKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZGF0YUFsbFswXSArIGRhdGFBbGxbMV07XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhkYXRhQWxsWzJdKTtcbiAgICAgICAgICBsZXQgZGVmUGF0aFBhcmFtcyA9IGRhdGFBbGxbM107XG5cbiAgICAgICAgICBsZXQgZGF0YSA9IGFyZ3MubGVuZ3RoID8gYXJnc1swXSA6IG51bGw7XG4gICAgICAgICAgbGV0IGNhbGxiYWNrID0gYXJncy5sZW5ndGggPiAxID8gYXJnc1sxXSA6IG51bGw7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sgPSBkYXRhO1xuICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGxldCB0bXBEYXRhID0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgIGNhbGxiYWNrID0gZGF0YTtcbiAgICAgICAgICAgICAgZGF0YSA9IHRtcERhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBkYXRhID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCB1c2VkUGF0aFBhcmFtczogYW55ID0ge307XG5cbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkpIHtcblxuICAgICAgICAgICAgZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGFBbGxbNF0sIGRhdGEpO1xuXG4gICAgICAgICAgICBsZXQgcGF0aFBhcmFtcyA9IHVybC5tYXRjaCgveyhbXn1dKil9L2cpIHx8IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhQYXJhbXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICBsZXQgcGF0aFBhcmFtID0gcGF0aFBhcmFtc1tpXTtcblxuICAgICAgICAgICAgICBsZXQgcGF0aEtleSA9IHBhdGhQYXJhbS5zdWJzdHIoMSwgcGF0aFBhcmFtLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgICBsZXQgaXNNYW5kYXRvcnkgPSBwYXRoS2V5WzBdID09PSAnISc7XG4gICAgICAgICAgICAgIGlmIChpc01hbmRhdG9yeSkge1xuICAgICAgICAgICAgICAgIHBhdGhLZXkgPSBwYXRoS2V5LnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxldCBpc0dldE9ubHkgPSBwYXRoS2V5WzBdID09PSAnOic7XG4gICAgICAgICAgICAgIGlmIChpc0dldE9ubHkpIHtcbiAgICAgICAgICAgICAgICBwYXRoS2V5ID0gcGF0aEtleS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBnZXRWYWx1ZUZvclBhdGgocGF0aEtleSwgZGVmUGF0aFBhcmFtcywgZGF0YSwgdXNlZFBhdGhQYXJhbXMpO1xuICAgICAgICAgICAgICBpZiAoaXNHZXRPbmx5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFbcGF0aEtleV07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzTWFuZGF0b3J5KSB7XG5cbiAgICAgICAgICAgICAgICAgIGxldCBjb25zb2xlTXNnID0gYE1hbmRhdG9yeSAke3BhdGhQYXJhbX0gcGF0aCBwYXJhbWV0ZXIgaXMgbWlzc2luZ2A7XG5cbiAgICAgICAgICAgICAgICAgIG1haW5PYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IobmV3IEVycm9yKGNvbnNvbGVNc2cpKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oY29uc29sZU1zZyk7XG5cbiAgICAgICAgICAgICAgICAgIHJlbGVhc2VNYWluRGVmZXJyZWRTdWJzY3JpYmVyKCk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwuaW5kZXhPZihwYXRoUGFyYW0pKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFJlcGxhY2luZyBpbiB0aGUgdXJsXG4gICAgICAgICAgICAgIHVybCA9IHVybC5yZXBsYWNlKHBhdGhQYXJhbSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG5cblxuICAgICAgICAgIC8vIFJlbW92aW5nIGRvdWJsZSBzbGFzaGVkIGZyb20gZmluYWwgdXJsXG4gICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcL1xcLysvZywgJy8nKTtcbiAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xuICAgICAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoJzovJywgJzovLycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlbW92ZSB0cmFpbGluZyBzbGFzaFxuICAgICAgICAgIGlmICh0eXBlb2YgbWV0aG9kT3B0aW9ucy5yZW1vdmVUcmFpbGluZ1NsYXNoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5yZW1vdmVUcmFpbGluZ1NsYXNoID0gdGhpcy5yZW1vdmVUcmFpbGluZ1NsYXNoKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtZXRob2RPcHRpb25zLnJlbW92ZVRyYWlsaW5nU2xhc2gpIHtcbiAgICAgICAgICAgIHdoaWxlICh1cmxbdXJsLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICAvLyBSZW1vdmUgbWFwcGVkIHBhcmFtc1xuICAgICAgICAgIGZvciAobGV0IGtleSBpbiBkZWZQYXRoUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAoZGVmUGF0aFBhcmFtc1trZXldWzBdID09PSAnQCcpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGRlZlBhdGhQYXJhbXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIC8vIERlZmF1bHQgc2VhcmNoIHBhcmFtcyBvciBkYXRhXG4gICAgICAgICAgbGV0IGJvZHk6IHN0cmluZyA9IG51bGw7XG5cbiAgICAgICAgICBsZXQgc2VhcmNoUGFyYW1zOiBhbnk7XG4gICAgICAgICAgaWYgKGlzR2V0UmVxdWVzdCkge1xuICAgICAgICAgICAgLy8gR0VUXG4gICAgICAgICAgICBzZWFyY2hQYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZQYXRoUGFyYW1zLCBkYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTk9OIEdFVFxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VhcmNoUGFyYW1zID0gZGVmUGF0aFBhcmFtcztcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIC8vIFNldHRpbmcgc2VhcmNoIHBhcmFtc1xuICAgICAgICAgIGxldCBzZWFyY2g6IFVSTFNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gc2VhcmNoUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAoIXVzZWRQYXRoUGFyYW1zW2tleV0pIHtcblxuICAgICAgICAgICAgICBsZXQgdmFsdWU6IGFueSA9IHNlYXJjaFBhcmFtc1trZXldO1xuXG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgYXJyX3ZhbHVlIG9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICBzZWFyY2guYXBwZW5kKGtleSwgYXJyX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAvLy8gQ29udmVydCBkYXRlcyB0byBJU08gZm9ybWF0IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VhcmNoLmFwcGVuZChrZXksIHZhbHVlKTtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWRkaW5nIFRTIGlmIG5lZWRlZFxuICAgICAgICAgIGxldCB0c05hbWUgPSBtZXRob2RPcHRpb25zLmFkZFRpbWVzdGFtcCB8fCByZXNvdXJjZU9wdGlvbnMuYWRkVGltZXN0YW1wO1xuICAgICAgICAgIGlmICh0c05hbWUpIHtcbiAgICAgICAgICAgIGlmICh0c05hbWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdHNOYW1lID0gJ3RzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlYXJjaC5hcHBlbmQodHNOYW1lLCAnJyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZW1vdmluZyBDb250ZW50LVR5cGUgaGVhZGVyIGlmIG5vIGJvZHlcbiAgICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuZGVsZXRlKCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIC8vIENyZWF0aW5nIHJlcXVlc3Qgb3B0aW9uc1xuICAgICAgICAgIGxldCByZXF1ZXN0T3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7XG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZE9wdGlvbnMubWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHNlYXJjaDogc2VhcmNoXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBDcmVhdGluZyByZXF1ZXN0IG9iamVjdFxuICAgICAgICAgIGxldCByZXEgPSBuZXcgUmVxdWVzdChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgICAgICAgICByZXEgPSBtZXRob2RPcHRpb25zLnJlcXVlc3RJbnRlcmNlcHRvciA/XG4gICAgICAgICAgICBtZXRob2RPcHRpb25zLnJlcXVlc3RJbnRlcmNlcHRvcihyZXEpIDpcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEludGVyY2VwdG9yKHJlcSk7XG5cbiAgICAgICAgICBpZiAoIXJlcSkge1xuICAgICAgICAgICAgbWFpbk9ic2VydmFibGUgPSBPYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihuZXcgRXJyb3IoJ1JlcXVlc3QgaXMgbnVsbCcpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlcXVlc3QgaXMgbnVsbCcpO1xuXG4gICAgICAgICAgICByZWxlYXNlTWFpbkRlZmVycmVkU3Vic2NyaWJlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERvaW5nIHRoZSByZXF1ZXN0XG4gICAgICAgICAgbGV0IHJlcXVlc3RPYnNlcnZhYmxlID0gdGhpcy5odHRwLnJlcXVlc3QocmVxKTtcblxuICAgICAgICAgIC8vIG5vaW5zcGVjdGlvbiBUeXBlU2NyaXB0VmFsaWRhdGVUeXBlc1xuICAgICAgICAgIHJlcXVlc3RPYnNlcnZhYmxlID0gbWV0aG9kT3B0aW9ucy5yZXNwb25zZUludGVyY2VwdG9yID9cbiAgICAgICAgICAgIG1ldGhvZE9wdGlvbnMucmVzcG9uc2VJbnRlcmNlcHRvci5iaW5kKHRoaXMpKHJlcXVlc3RPYnNlcnZhYmxlLCByZXEpIDpcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VJbnRlcmNlcHRvcihyZXF1ZXN0T2JzZXJ2YWJsZSwgcmVxKTtcblxuXG4gICAgICAgICAgaWYgKG1ldGhvZE9wdGlvbnMuaXNMYXp5KSB7XG4gICAgICAgICAgICBtYWluT2JzZXJ2YWJsZSA9IHJlcXVlc3RPYnNlcnZhYmxlO1xuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIG1haW5PYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5jcmVhdGUoKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55PikgPT4ge1xuXG4gICAgICAgICAgICAgIGxldCByZXFTdWJzY3I6IFN1YnNjcmlwdGlvbiA9IHJlcXVlc3RPYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAocmVzcDogYW55KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChyZXNwICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hcDogUmVzb3VyY2VSZXNwb25zZU1hcCA9IG1ldGhvZE9wdGlvbnMubWFwID8gbWV0aG9kT3B0aW9ucy5tYXAgOiB0aGlzLm1hcDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcjogUmVzb3VyY2VSZXNwb25zZUZpbHRlciA9IG1ldGhvZE9wdGlvbnMuZmlsdGVyID8gbWV0aG9kT3B0aW9ucy5maWx0ZXIgOiB0aGlzLmZpbHRlcjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kT3B0aW9ucy5pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZXR1cm5lZCBkYXRhIHNob3VsZCBiZSBhbiBhcnJheS4gUmVjZWl2ZWQnLCByZXNwKTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHJlc3AuZmlsdGVyKGZpbHRlcikubWFwKG1hcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAhIXJlc291cmNlTW9kZWwgPyBtYXBUb01vZGVsLmJpbmQodGhpcykocmVzdWx0LCByZXNvdXJjZU1vZGVsKSA6IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJldCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JldHVybmVkIGRhdGEgc2hvdWxkIGJlIGFuIG9iamVjdC4gUmVjZWl2ZWQnLCByZXNwKTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbHRlcihyZXNwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFyZXNvdXJjZU1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDxSZXNvdXJjZU1vZGVsPnJldCkuJGZpbGxGcm9tT2JqZWN0KG1hcChyZXNwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXQsIG1hcChyZXNwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHJlc3ApO1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyOiBhbnkpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXQuJHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXQpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICByZXQuJGFib3J0UmVxdWVzdCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmV0LiRyZXNvbHZlZCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXFTdWJzY3IudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICByZXQuJHJlc29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZWxlYXNlTWFpbkRlZmVycmVkU3Vic2NyaWJlcigpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICBpZiAocmVzb3VyY2VNb2RlbCkge1xuICAgICAgICByZXQuJG9ic2VydmFibGUgPSByZXQuJG9ic2VydmFibGUubWFwKChyZXNwOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gbWFwVG9Nb2RlbC5iaW5kKHRoaXMpKHJlc3AsIHJlc291cmNlTW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldDtcblxuICAgIH07XG5cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvTW9kZWwocmVzcDogYW55LCBtb2RlbDogVHlwZTxSZXNvdXJjZU1vZGVsPikge1xuICBsZXQgbW9kZWxQcm92aWRlcnMgPSAoPGFueT5SZWZsZWN0KS5nZXRNZXRhZGF0YSgncHJvdmlkZXJzJywgbW9kZWwpIHx8IFtdO1xuICBsZXQgcHJvdmlkZXJzID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmUobW9kZWxQcm92aWRlcnMpO1xuICBsZXQgaW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKHByb3ZpZGVycywgdGhpcy5pbmplY3Rvcik7XG4gIGxldCBwcm9wZXJ0aWVzID0gKDxhbnk+UmVmbGVjdCkuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgbW9kZWwpIHx8IFtdO1xuICBsZXQgaW5qZWN0aW9uOiBhbnlbXSA9IFtdO1xuICBmb3IgKGxldCBwcm9wZXJ0eSBvZiBwcm9wZXJ0aWVzKSB7XG4gICAgaW5qZWN0aW9uLnB1c2goaW5qZWN0b3IuZ2V0KHByb3BlcnR5KSk7XG4gIH1cblxuICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkocmVzcCkpIHtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3ApIHtcbiAgICAgIGxldCBtb2RlbEluc3RhbmNlID0gbmV3IG1vZGVsKC4uLmluamVjdGlvbikuJGZpbGxGcm9tT2JqZWN0KGl0ZW0pO1xuICAgICAgbW9kZWxJbnN0YW5jZS4kcmVzb3VyY2UgPSB0aGlzO1xuICAgICAgcmVzdWx0LnB1c2gobW9kZWxJbnN0YW5jZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IG5ldyBtb2RlbCguLi5pbmplY3Rpb24pLiRmaWxsRnJvbU9iamVjdChyZXNwKTtcbiAgICByZXN1bHQuJHJlc291cmNlID0gdGhpcztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlRm9yUGF0aChrZXk6IHN0cmluZywgcGFyYW1zOiBhbnksIGRhdGE6IGFueSwgdXNlZFBhdGhQYXJhbXM6IGFueSk6IHN0cmluZyB7XG5cbiAgaWYgKHR5cGVvZiBkYXRhW2tleV0gIT09ICdvYmplY3QnKSB7XG4gICAgdXNlZFBhdGhQYXJhbXNba2V5XSA9IHRydWU7XG4gICAgcmV0dXJuIGRhdGFba2V5XTtcbiAgfVxuXG4gIGlmICghcGFyYW1zW2tleV0pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChwYXJhbXNba2V5XVswXSA9PT0gJ0AnKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlRm9yUGF0aChwYXJhbXNba2V5XS5zdWJzdHIoMSksIHBhcmFtcywgZGF0YSwgdXNlZFBhdGhQYXJhbXMpO1xuICB9XG5cbiAgdXNlZFBhdGhQYXJhbXNba2V5XSA9IHRydWU7XG4gIHJldHVybiBwYXJhbXNba2V5XTtcblxufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=