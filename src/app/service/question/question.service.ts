import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private http: HttpClient,
    ) { }

  answerQuestion(question: any): any {
    return this.http.post<any>(`${API}/questao/answerQuestion`, question);
  }
}
