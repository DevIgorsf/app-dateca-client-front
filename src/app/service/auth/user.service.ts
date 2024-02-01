import { Injectable } from '@angular/core';
import { User } from './../../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { jwtDecode as jwt_decode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuarioSubject = new BehaviorSubject<User>({});

  constructor(private tokenService: TokenService) {
    if (this.tokenService.possuiToken()) {
      this.decodificaJWT();
    }
  }

  private decodificaJWT() {
    const token = this.tokenService.retornaToken();
    const usuario = jwt_decode(token) as User;
    this.usuarioSubject.next(usuario);
  }

  retornaUsuario() {
    return this.usuarioSubject.asObservable();
  }

  verificarRole(token: string) {
    const usuario = jwt_decode(token) as User;
    if (usuario.role !== "ALUNO"){
      throw new Error('Usuário não tem permissão ALUNO');
    }
  }

  salvaToken(token: string) {
    this.tokenService.salvaToken(token);
    this.decodificaJWT();
  }

  logout() {
    this.tokenService.excluiToken();
    this.usuarioSubject.next({});
  }

  estaLogado() {
    return this.tokenService.possuiToken();
  }
}

