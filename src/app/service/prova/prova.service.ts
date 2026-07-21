import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProvaDetalheDTO, ProvaForm, ProvaResumoDTO } from 'src/app/interfaces/prova';

const API = environment.ApiUrl;

export const DISCIPLINAS = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'Português',
  'História',
  'Geografia',
  'Inglês',
  'Programação',
  'Estatística',
  'Filosofia',
  'Sociologia',
];

@Injectable({
  providedIn: 'root'
})
export class ProvaService {

  constructor(
    private http: HttpClient,
  ) { }

  getMinhasProvas(): Observable<ProvaResumoDTO[]> {
    return this.http.get<ProvaResumoDTO[]>(`${API}/prova/minhas`);
  }

  getProva(id: string): Observable<ProvaDetalheDTO> {
    return this.http.get<ProvaDetalheDTO>(`${API}/prova/${id}`);
  }

  criarProva(form: ProvaForm): Observable<ProvaDetalheDTO> {
    return this.http.post<ProvaDetalheDTO>(`${API}/prova`, form);
  }

  atualizarProva(id: string, form: ProvaForm): Observable<ProvaDetalheDTO> {
    return this.http.put<ProvaDetalheDTO>(`${API}/prova/${id}`, form);
  }

  excluirProva(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/prova/${id}`);
  }
}
