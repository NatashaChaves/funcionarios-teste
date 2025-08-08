import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material-module';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { NotificationService } from '../../services/notificationService';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [MaterialModule, CommonModule],  
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  hidePassword: boolean = true;  
  senha: string = '';
  email: string = '';
  error: string = '';
  errorMessage: string = '';

  constructor (private authService: AuthService, private router: Router, private notificationService: NotificationService) {}
  async login() {
    try {
      const token = await this.authService.login(this.email, this.senha);
      this.router.navigate(['/funcionarios']);
    } catch (error: any) {
      if(error.code === 'auth/user-not-found') {
        this.errorMessage = 'Usuário não encontrado';
        this.notificationService.showError('Erro ao editar funcionário: ' + this.errorMessage);
      }else if(error.code === 'auth/wrong-password') {
        this.errorMessage = 'Senha incorreta';
        this.notificationService.showError('Erro ao editar funcionário: ' + this.errorMessage);

      }
      else {
        this.errorMessage = 'Erro ao fazer login';
        this.notificationService.showError('Erro ao editar funcionário: ' + this.errorMessage);
      } 
    }
  }
  togglePasswordVisibility() {
    this.  hidePassword =!this.hidePassword;
  }
}
