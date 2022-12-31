import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  get(path, params) {
    return this.http.get<any> (path,
      {
        headers: this.headers(),
        observe: 'response',
        params
      }
    );
  }

  post(path, body, params?) {
    return this.http.post<any> ( path,
      body,
      {
        headers: this.headers(),
        observe: 'response',
        params
      }
    );
  }

  put(path, body, params?) {
    return this.http.put<any> ( path,
      body,
      {
        headers: this.headers(),
        observe: 'response',
        params
      }
    );
  }

  delete(path, params?) {
    return this.http.delete<any> ( path,
      {
        headers: this.headers(),
        observe: 'response',
        params
      }
    );
  }

  private headers() {
    const currentUserToken = localStorage.getItem('token');
    if (currentUserToken) {
      return new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*')
        .set('Accept', '*')
        .set('Authorization', 'Bearer ' + currentUserToken)
        .set('Content-Type', 'application/json')
    } else {
      return new HttpHeaders();
    }
  }

}
