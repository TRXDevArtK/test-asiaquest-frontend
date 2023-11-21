import { Injectable } from '@angular/core';
import { TaskInterface } from '../interfaces/task-interface';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ResultInterface } from '../interfaces/result-interface';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl: string;
  private apiKey: string;
  private envMode: boolean;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.apiKey = environment.apiKey;
    this.envMode = environment.production;
  }

  getAllTask(): Observable<ResultInterface> {
    return this.http.get<ResultInterface>(this.apiUrl+'/api/get/task', {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  editTaskOrder(taskData: TaskInterface): Observable<ResultInterface> {
    return this.http.post<ResultInterface>(this.apiUrl+'/api/edit/task/order', taskData, {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  editTaskDescription(taskData: TaskInterface): Observable<ResultInterface> {
    return this.http.post<ResultInterface>(this.apiUrl+'/api/edit/task/description', taskData, {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  createNewTask(taskData: TaskInterface): Observable<ResultInterface> {
    return this.http.post<ResultInterface>(this.apiUrl+'/api/create/task', taskData, {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  deleteTask(taskData: Array<number>): Observable<ResultInterface> {
    return this.http.post<ResultInterface>(this.apiUrl+'/api/delete/task', {"id":taskData}, {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  markCompleteTask(taskData: Array<number>): Observable<ResultInterface> {
    return this.http.post<ResultInterface>(this.apiUrl+'/api/edit/task/complete_at', {"id":taskData}, {
      headers: {'X-API-KEY': this.apiKey}
    }).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// check the error
    );
  }

  private handleError(error: HttpErrorResponse) {
    if(this.envMode == true){
      return throwError(() => new Error('Something bad happened; please try again later.'));
    }

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
