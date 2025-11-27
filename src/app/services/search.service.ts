import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermsSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermsSubject.asObservable();

  setSearchTerm(term: string){
    this.searchTermsSubject.next(term);
  }
}
