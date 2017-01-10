import { ResourceGlobalConfig } from './ResourceGlobalConfig';
export var Resource = (function () {
    function Resource(http, injector) {
        this.http = http;
        this.injector = injector;
        this._url = null;
        this._path = null;
        this._headers = null;
        this._params = null;
        this._data = null;
        if (this.constructor.model) {
            this.constructor.model.resourceInstance = this;
        }
    }
    /**
     * Get main url of the resource
     * @returns {string|Promise<string>}
     */
    Resource.prototype.getUrl = function () {
        return this._url || this._getUrl() || ResourceGlobalConfig.url || '';
    };
    /**
     * Set resource url
     * @param url
     */
    Resource.prototype.setUrl = function (url) {
        this._url = url;
    };
    /**
     * Get path of the resource
     * @returns {string|Promise<string>}
     */
    Resource.prototype.getPath = function () {
        return this._path || this._getPath() || ResourceGlobalConfig.path || '';
    };
    /**
     * Set resource path
     * @param path
     */
    Resource.prototype.setPath = function (path) {
        this._path = path;
    };
    /**
     * Get headers
     * @returns {any|Promise<any>}
     */
    Resource.prototype.getHeaders = function () {
        return this._headers || this._getHeaders() || ResourceGlobalConfig.headers || {};
    };
    /**
     * Set resource headers
     * @param headers
     */
    Resource.prototype.setHeaders = function (headers) {
        this._headers = headers;
    };
    /**
     * Get default params
     * @returns {any|Promise<any>|{}}
     */
    Resource.prototype.getParams = function () {
        return this._params || this._getParams() || ResourceGlobalConfig.params || {};
    };
    /**
     * Set default resource params
     * @param params
     */
    Resource.prototype.setParams = function (params) {
        this._params = params;
    };
    /**
     * Get default data
     * @returns {any|Promise<any>|{}}
     */
    Resource.prototype.getData = function () {
        return this._data || this._getData() || ResourceGlobalConfig.data || {};
    };
    /**
     * Set default resource params
     * @param data
     */
    Resource.prototype.setData = function (data) {
        this._data = data;
    };
    /**
     * That is called before executing request
     * @param req
     */
    Resource.prototype.requestInterceptor = function (req) {
        return req;
    };
    /**
     * Request observable interceptor
     * @param observable
     * @returns {Observable<any>}
     */
    Resource.prototype.responseInterceptor = function (observable, req) {
        return observable.map(function (res) { return res._body ? res.json() : null; });
    };
    Resource.prototype.removeTrailingSlash = function () {
        return true;
    };
    Resource.prototype.map = function (item) {
        return item;
    };
    Resource.prototype.filter = function (item) {
        return true;
    };
    Resource.prototype._getUrl = function () {
        return null;
    };
    Resource.prototype._getPath = function () {
        return null;
    };
    Resource.prototype._getHeaders = function () {
        return null;
    };
    Resource.prototype._getParams = function () {
        return null;
    };
    Resource.prototype._getData = function () {
        return null;
    };
    Resource.prototype._getResourceOptions = function () {
        return null;
    };
    return Resource;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FJTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCO0FBSTdEO0lBVUUsa0JBQXNCLElBQVUsRUFBWSxRQUFrQjtRQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQU50RCxTQUFJLEdBQVcsSUFBSSxDQUFDO1FBQ3BCLFVBQUssR0FBVyxJQUFJLENBQUM7UUFDckIsYUFBUSxHQUFRLElBQUksQ0FBQztRQUNyQixZQUFPLEdBQVEsSUFBSSxDQUFDO1FBQ3BCLFVBQUssR0FBUSxJQUFJLENBQUM7UUFHeEIsRUFBRSxDQUFDLENBQU8sSUFBSSxDQUFDLFdBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxXQUFZLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUN4RCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlCQUFNLEdBQU47UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksb0JBQW9CLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQU0sR0FBTixVQUFPLEdBQVc7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDBCQUFPLEdBQVA7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksb0JBQW9CLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMEJBQU8sR0FBUCxVQUFRLElBQVk7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDZCQUFVLEdBQVY7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksb0JBQW9CLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUNuRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsNkJBQVUsR0FBVixVQUFXLE9BQVk7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDRCQUFTLEdBQVQ7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksb0JBQW9CLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsNEJBQVMsR0FBVCxVQUFVLE1BQVc7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILDBCQUFPLEdBQVA7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksb0JBQW9CLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMEJBQU8sR0FBUCxVQUFRLElBQVM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gscUNBQWtCLEdBQWxCLFVBQW1CLEdBQVk7UUFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsc0NBQW1CLEdBQW5CLFVBQW9CLFVBQTJCLEVBQUUsR0FBWTtRQUMzRCxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxzQ0FBbUIsR0FBbkI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHNCQUFHLEdBQUgsVUFBSSxJQUFTO1FBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCx5QkFBTSxHQUFOLFVBQU8sSUFBUztRQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBR08sMEJBQU8sR0FBZjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sMkJBQVEsR0FBaEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLDhCQUFXLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyw2QkFBVSxHQUFsQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sMkJBQVEsR0FBaEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLHNDQUFtQixHQUEzQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUgsZUFBQztBQUFELENBQUMsQUF2SkQsSUF1SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwLCBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3R5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgUmVzb3VyY2VHbG9iYWxDb25maWcgfSBmcm9tICcuL1Jlc291cmNlR2xvYmFsQ29uZmlnJztcbmltcG9ydCB7IFJlc291cmNlTW9kZWwgfSBmcm9tICcuL1Jlc291cmNlTW9kZWwnO1xuaW1wb3J0IHsgUmVzb3VyY2VQYXJhbXNCYXNlIH0gZnJvbSAnLi9JbnRlcmZhY2VzJztcblxuZXhwb3J0IGNsYXNzIFJlc291cmNlIHtcblxuICBzdGF0aWMgbW9kZWw6IFR5cGU8UmVzb3VyY2VNb2RlbD47XG5cbiAgcHJpdmF0ZSBfdXJsOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIF9wYXRoOiBzdHJpbmcgPSBudWxsO1xuICBwcml2YXRlIF9oZWFkZXJzOiBhbnkgPSBudWxsO1xuICBwcml2YXRlIF9wYXJhbXM6IGFueSA9IG51bGw7XG4gIHByaXZhdGUgX2RhdGE6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHAsIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBpZiAoKDxhbnk+dGhpcy5jb25zdHJ1Y3RvcikubW9kZWwpIHtcbiAgICAgICg8YW55PnRoaXMuY29uc3RydWN0b3IpLm1vZGVsLnJlc291cmNlSW5zdGFuY2UgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbWFpbiB1cmwgb2YgdGhlIHJlc291cmNlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8UHJvbWlzZTxzdHJpbmc+fVxuICAgKi9cbiAgZ2V0VXJsKCk6IHN0cmluZyB8IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuX3VybCB8fCB0aGlzLl9nZXRVcmwoKSB8fCBSZXNvdXJjZUdsb2JhbENvbmZpZy51cmwgfHwgJyc7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHJlc291cmNlIHVybFxuICAgKiBAcGFyYW0gdXJsXG4gICAqL1xuICBzZXRVcmwodXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cmwgPSB1cmw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHBhdGggb2YgdGhlIHJlc291cmNlXG4gICAqIEByZXR1cm5zIHtzdHJpbmd8UHJvbWlzZTxzdHJpbmc+fVxuICAgKi9cbiAgZ2V0UGF0aCgpOiBzdHJpbmcgfCBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9wYXRoIHx8IHRoaXMuX2dldFBhdGgoKSB8fCBSZXNvdXJjZUdsb2JhbENvbmZpZy5wYXRoIHx8ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCByZXNvdXJjZSBwYXRoXG4gICAqIEBwYXJhbSBwYXRoXG4gICAqL1xuICBzZXRQYXRoKHBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBoZWFkZXJzXG4gICAqIEByZXR1cm5zIHthbnl8UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgZ2V0SGVhZGVycygpOiBhbnkgfCBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJzIHx8IHRoaXMuX2dldEhlYWRlcnMoKSB8fCBSZXNvdXJjZUdsb2JhbENvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCByZXNvdXJjZSBoZWFkZXJzXG4gICAqIEBwYXJhbSBoZWFkZXJzXG4gICAqL1xuICBzZXRIZWFkZXJzKGhlYWRlcnM6IGFueSkge1xuICAgIHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkZWZhdWx0IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7YW55fFByb21pc2U8YW55Pnx7fX1cbiAgICovXG4gIGdldFBhcmFtcygpOiBhbnkgfCBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9wYXJhbXMgfHwgdGhpcy5fZ2V0UGFyYW1zKCkgfHwgUmVzb3VyY2VHbG9iYWxDb25maWcucGFyYW1zIHx8IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBkZWZhdWx0IHJlc291cmNlIHBhcmFtc1xuICAgKiBAcGFyYW0gcGFyYW1zXG4gICAqL1xuICBzZXRQYXJhbXMocGFyYW1zOiBhbnkpIHtcbiAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGRlZmF1bHQgZGF0YVxuICAgKiBAcmV0dXJucyB7YW55fFByb21pc2U8YW55Pnx7fX1cbiAgICovXG4gIGdldERhdGEoKTogYW55IHwgUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YSB8fCB0aGlzLl9nZXREYXRhKCkgfHwgUmVzb3VyY2VHbG9iYWxDb25maWcuZGF0YSB8fCB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgZGVmYXVsdCByZXNvdXJjZSBwYXJhbXNcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHNldERhdGEoZGF0YTogYW55KSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGF0IGlzIGNhbGxlZCBiZWZvcmUgZXhlY3V0aW5nIHJlcXVlc3RcbiAgICogQHBhcmFtIHJlcVxuICAgKi9cbiAgcmVxdWVzdEludGVyY2VwdG9yKHJlcTogUmVxdWVzdCk6IFJlcXVlc3Qge1xuICAgIHJldHVybiByZXE7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBvYnNlcnZhYmxlIGludGVyY2VwdG9yXG4gICAqIEBwYXJhbSBvYnNlcnZhYmxlXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPGFueT59XG4gICAqL1xuICByZXNwb25zZUludGVyY2VwdG9yKG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PiwgcmVxOiBSZXF1ZXN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZS5tYXAocmVzID0+IHJlcy5fYm9keSA/IHJlcy5qc29uKCkgOiBudWxsKTtcbiAgfVxuXG4gIHJlbW92ZVRyYWlsaW5nU2xhc2goKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtYXAoaXRlbTogYW55KTogYW55IHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGZpbHRlcihpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfZ2V0VXJsKCk6IHN0cmluZ3xQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGF0aCgpOiBzdHJpbmd8UHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEhlYWRlcnMoKTogYW55IHwgUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFBhcmFtcygpOiBhbnkgfCBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RGF0YSgpOiBhbnkgfCBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UmVzb3VyY2VPcHRpb25zKCk6IFJlc291cmNlUGFyYW1zQmFzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=