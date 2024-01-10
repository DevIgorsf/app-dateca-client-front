import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient,
  ) { }

  rankingStudent(): Observable<any> {
    return this.http.get(`${API}/aluno/ranking`);
  }

  getStudent(): Observable<any> {
    return this.http.get(`${API}/aluno/perfil`);
  }

  updateStudent(value: any) {
    return this.http.put(`${API}/aluno/perfil`, value);
  }
}
