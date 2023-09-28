import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BusSelectedService {
  BusSelectedSubject: Subject<string>;
  constructor() {
    this.BusSelectedSubject = new Subject<any>();
  }

  dataToSend(Data) {
    this.BusSelectedSubject.next(Data);
  }
}
