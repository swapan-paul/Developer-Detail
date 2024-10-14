import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  // Show the loader
  show() {
    this.isLoadingSubject.next(true);
  }

  // Hide the loader
  hide() {
    this.isLoadingSubject.next(false);
  }
}

