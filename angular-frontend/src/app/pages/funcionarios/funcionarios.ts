import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material-module';
import { OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionarioService';
import { FuncionarioAddEditDialog } from '../../dialogs/funcionarios/funcionario-add-edit-dialog';
import { FuncionarioDeleteDialog } from '../../dialogs/funcionarios/funcionario-delete-dialog';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notificationService';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-funcionarios',
  imports: [MaterialModule, MatTableModule, MatPaginator, CommonModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.scss'
})
export class Funcionarios implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'dataContratacao', 'cpf', 'ativo', 'acoes'];
  funcionarios: Funcionario[] = [];

  totalFuncionarios = 0;
  paginaAtual = 0;
  tamanhoPagina = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private funcionarioService: FuncionarioService, private dialog: MatDialog, private authService: AuthService, private router: Router, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  async carregarFuncionarios() {
    const data = await firstValueFrom(this.funcionarioService.listarFuncionarios());
    this.funcionarios = data;
    this.funcionarios = data;
    this.totalFuncionarios = data.length; 
    this.paginator.length = this.totalFuncionarios; 
  }

  mudarPagina(event: PageEvent) {
    this.paginaAtual = event.pageIndex;
    this.tamanhoPagina = event.pageSize;
    this.carregarFuncionarios();
  }
  async abrirDialog(funcionario?: any) {
    const dialogRef = this.dialog.open(FuncionarioAddEditDialog, {
      width: '400px',
      data: funcionario || null
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        const id = resultado.get('id') || null;
        if (id) {
          this.funcionarioService.atualizarFuncionario(id, resultado).subscribe({
            next: () => {
              this.notificationService.showSuccess('Funcionário editado com sucesso!');
            },
            error: (err) => {
              this.notificationService.showError('Erro ao editar funcionário: ' + err.error?.error || err.message);
            }
          });
        } else {
          this.funcionarioService.adicionarFuncionario(resultado).subscribe({
            next: () => {
              this.notificationService.showSuccess('Funcionário adicionado com sucesso!');
            },
            error: (err) => {
              this.notificationService.showError('Erro ao adicionar funcionário: ' + err.error?.error || err.message);
            }
          });
        }
      }
    });
    await this.carregarFuncionarios();
  }

  async abrirDeleteDialog(funcionario?: any) {
    const dialogRef = this.dialog.open(FuncionarioDeleteDialog, {
      width: '400px',
      data: funcionario || null
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.funcionarioService.excluirFuncionario(resultado).subscribe({
          next: () => {
            this.notificationService.showSuccess('Funcionário excluído com sucesso!');
          },
          error: (err) => {
            this.notificationService.showError('Erro ao excluir funcionário: ' + err.error?.error || err.message);
          }
        });
      }
    });
    await this.carregarFuncionarios();
  }
  getAtivoLabel(ativo: boolean | number | string): string {
    return ativo === true || ativo === 1 || ativo === '1' || ativo === 'true' ? 'Sim' : 'Não';
  }

  getAtivoClass(ativo: boolean | number | string): string {
    return ativo === true || ativo === 1 || ativo === '1' || ativo === 'true'
      ? 'ativo-chip-sim'
      : 'ativo-chip-nao';
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/');
    });
  }
}

