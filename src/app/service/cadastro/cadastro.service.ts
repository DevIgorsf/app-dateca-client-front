import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API = environment.ApiUrl;

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(
    private http: HttpClient,
  ) { }

  cadastrar(alunoForm: FormGroup<any>): Observable<any> {
    return this.http.post<any>(`${API}/aluno/cadastrar`, alunoForm);
  }
}
