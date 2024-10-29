// map.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

interface ApiResponse {
  resultData: any[];
}


@Injectable({
  providedIn: 'root',
})
export class MapService {


  private apiUrl = 'http://206.189.41.105:5591/api/v1/locations';

  private accessToken = uuidv4();


  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    console.log(this.accessToken);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });
  }

  // getLocationById(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/:location_id`);
  // }

  getListLocation(offset = 0, limit = 10): Observable<ApiResponse> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
    return this.http.get<ApiResponse>(url, { headers: this.getHeaders() });
  }

  createLocation(location: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, location, { headers: this.getHeaders() });
  }


}
