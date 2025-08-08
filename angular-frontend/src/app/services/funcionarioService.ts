import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService{
  private apiUrl = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) {}

  listarFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }
  adicionarFuncionario(formData: FormData): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, formData);
  }
  atualizarFuncionario(id: string, formData: FormData): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, formData);
  } 
  excluirFuncionario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
