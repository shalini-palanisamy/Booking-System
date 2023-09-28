import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusSelectedService {
  SelectedBus;
  constructor(private http: HttpClient) {}
}
