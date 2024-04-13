import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class EnadeService {
  private answer: any;
  private year: any;
  private number: any;
  private statement: any;
  private alternativeA: any;
  private alternativeB: any;
  private alternativeC: any;
  private alternativeD: any;
  private alternativeE: any;

  constructor(
    private http: HttpClient,
  ) { }

  getAnswer(): any {
    return this.answer;
  }

  getYear(): any {
    return this.year;
  }

  getNumber(): any {
    return this.number;
  }

  getStatement(): any {
    return this.statement;
  }

  getAlternativeA(): any {
    return this.alternativeA;
  }

  getAlternativeB(): any {
    return this.alternativeB;
  }

  getAlternativeC(): any {
    return this.alternativeC;
  }

  getAlternativeD(): any {
    return this.alternativeD;
  }

  getAlternativeE(): any {
    return this.alternativeE;
  }

   setAnswer(data: any) {
    this.answer = data;
  }

  setYear(data: any): any {
    this.year = data;
  }

  setNumber(data: any): any {
    this.number = data;
  }

  setStatement(data: any) {
    this.statement = data;
  }

  setAlternativeA(data: any) {
    this.alternativeA = data;
  }

  setAlternativeB(data: any) {
    this.alternativeB = data;
  }

  setAlternativeC(data: any) {
    this.alternativeC = data;
  }

  setAlternativeD(data: any) {
    this.alternativeD = data;
  }

  setAlternativeE(data: any) {
    this.alternativeE = data;
  }

  getEnadeAleatoria(): Observable<any> {
    return this.http.get(`${API}/enade/aluno`);
  }

  getImages(idImages: any): Observable<any> {
    return this.http.get(`${API}/enade/imagens/${idImages}`);
  }

  answerEnade(id: any, enade: any): any {
    return this.http.post<any>(`${API}/enade/answerEnade/${id}`, enade);
  }
}
