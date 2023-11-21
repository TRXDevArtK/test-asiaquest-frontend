import { Component, OnInit } from '@angular/core';
import { IonGrid, IonCol, IonRow, IonCheckbox, IonButton, IonInput } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { TaskInterface } from '../interfaces/task-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ResultInterface } from '../interfaces/result-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-of-task',
  templateUrl: './list-of-task.component.html',
  styleUrls: ['./list-of-task.component.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonCheckbox, IonGrid, IonCol, IonRow, CommonModule, FormsModule],
})


export class ListOfTaskComponent  implements OnInit {

  formNotf = '';
  taskData: TaskInterface[] = []; // Initialize as an empty array of TaskInterface objects
  selectedTaskId: number[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getAllTask();
  }

  getAllTask(){
    this.apiService.getAllTask().subscribe(
      (data: ResultInterface) => {
        //waiting for data to be assigned because subscribe is async operations
        if (Array.isArray(data.data) && data.data.length > 0 && typeof data.data[0] === 'object') {
          this.taskData = data.data;
          localStorage.setItem('taskData', JSON.stringify(this.taskData));
        } else {
          // empty everything if no data arrive
          this.taskData = [];
          this.selectedTaskId = [];
        }
    });
  }

  addToSelected(taskId: number, event: any) {
    if (event.detail.checked) {
      this.selectedTaskId.push(taskId); // Add task ID to selectedTaskIds array
    } else {
      const index = this.selectedTaskId.indexOf(taskId);
      if (index !== -1) {
        this.selectedTaskId.splice(index, 1); // Remove task ID if unchecked
      }
    }
  }

  deleteSelected() {
    this.apiService.deleteTask(this.selectedTaskId).subscribe(
      (data: ResultInterface) => {
        this.getAllTask();
    });
  }

  markCompleteAt() {
    this.apiService.markCompleteTask(this.selectedTaskId).subscribe(
      (data: ResultInterface) => {
        this.getAllTask();
    });
  }

}
