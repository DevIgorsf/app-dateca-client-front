import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prova, ProvaRequest, ProvaSummary } from 'src/app/interfaces/prova';

const API = environment.ApiUrl;

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

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

  getMinhasProvas(page = 0, size = 20): Observable<Page<ProvaSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<ProvaSummary>>(`${API}/me/provas`, { params });
  }

  getProva(id: string): Observable<Prova> {
    return this.http.get<Prova>(`${API}/provas/${id}`);
  }

  criarProva(request: ProvaRequest): Observable<Prova> {
    return this.http.post<Prova>(`${API}/provas`, request);
  }

  atualizarProva(id: string, request: ProvaRequest): Observable<Prova> {
    return this.http.put<Prova>(`${API}/provas/${id}`, request);
  }

  excluirProva(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/provas/${id}`);
  }
}
