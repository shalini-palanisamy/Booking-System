// search-status.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchStatusService {
  private searchStatusSubject = new Subject<boolean>();
  searchStatus = this.searchStatusSubject.asObservable();

  setSearchStatus(status: boolean) {
    this.searchStatusSubject.next(status);
  }
}
