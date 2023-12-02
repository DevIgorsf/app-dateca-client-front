import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private http: HttpClient,
  ) { }

  getQuestaoAleatoria(): Observable<any> {
    return this.http.get(`${API}/questao/aluno`);
  }

  answerQuestion(id: any, question: any): any {
    return this.http.post<any>(`${API}/questao/answerQuestion/${id}`, question);
  }
}
