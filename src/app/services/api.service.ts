import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _httpClient: HttpClient = inject(HttpClient);

  post(url: string, body: any, token: boolean = false) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };

    return this._httpClient.post(url, body, token ? headers : {}).pipe(
      map((response: any) => {
        if (response.status) {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      })
    );
  }
}
