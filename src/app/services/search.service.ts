import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

// Injectable — отмечает, что это сервис, его можно внедрять в другие компоненты или сервисы
// BehaviorSubject — специальный объект из библиотеки RxJS, который хранит и «распространяет» значения (такой как поток данных)

@Injectable({
  providedIn: 'root'

//   @Injectable({ providedIn: 'root' }) — означает, что этот сервис создается один раз и доступен из всего приложения (глобально)
})
export class SearchService {
  private searchTermsSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermsSubject.asObservable();
  // $ показывает, что это не обычная переменная, а именно поток или observable

  setSearchTerm(term: string){
    this.searchTermsSubject.next(term);
  }
}


