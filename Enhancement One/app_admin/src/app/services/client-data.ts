import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientData {

  private baseUrl = 'http://localhost:3000';
  private clientsUrl = `${this.baseUrl}/api/clients`; // use API route

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  // Helper to add Authorization header if token exists
  private getAuthHeaders(): { headers?: HttpHeaders } {
    const token = this.storage.getItem('snhu-token');
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
    return {};
  }

  /** Fetch all clients */
  getClients(): Observable<Client[]> {
  return this.http.get<Client[]>(this.clientsUrl, this.getAuthHeaders());
}

  /** Fetch a single client by _id */
  getClient(clientId: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientsUrl}/${clientId}`, {
      ...this.getAuthHeaders(),
      responseType: 'json'
    });
  }

  /** Add a new client */
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.clientsUrl, client, {
      ...this.getAuthHeaders(),
      responseType: 'json'
    });
  }

  /** Update an existing client */
  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.clientsUrl}/${client._id}`, client, {
      ...this.getAuthHeaders(),
      responseType: 'json'
    });
  }

  /** Login call */
  login(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, password);
  }

  /** Register call */
  register(user: User, password: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, password);
  }

  /** Helper for login/register */
  private handleAuthAPICall(endpoint: string, user: User, password: string): Observable<AuthResponse> {
    const body = { name: user.name, email: user.email, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, body, { responseType: 'json' });
  }
}
