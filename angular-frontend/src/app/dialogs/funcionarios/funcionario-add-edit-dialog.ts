import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../utils/date-formats';
import { cpfValidator } from '../../utils/cpf-validators';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { F } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-funcionario-add-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    NgxMaskDirective,
    MatIconModule,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter(),  {
     provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    DatePipe],
  templateUrl: './funcionario-add-edit-dialog.html',
  styleUrls: ['./funcionario-add-edit-dialog.scss']
})
export class FuncionarioAddEditDialog {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  fotoFile: File | null = null;
  fotoPreview: string | ArrayBuffer | null = null;
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FuncionarioAddEditDialog>,
    private http: HttpClient,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any  
  ) {
    this.fotoPreview = data?.foto || null;
    this.firstFormGroup = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      email: [data?.email || '', Validators.required],
      dataContratacao: [this.parseDateFromString(data?.dataContratacao) || '', Validators.required],
      cpf: [data?.cpf || '', [Validators.required, cpfValidator]],
      ativo: [this.getAtivoLabel(data?.ativo) || '', Validators.required]
    });

    this.secondFormGroup = this.fb.group({
      cep: [data?.endereco.cep || '', Validators.required],
      rua: [data?.endereco.rua || '', Validators.required],
      bairro: [data?.endereco.bairro || '', Validators.required],
      cidade: [data?.endereco.cidade || '', Validators.required],
      estado: [data?.endereco.estado || '', Validators.required]
    });
  }

  onSalvar() {
    const dataFormatada = this.datePipe.transform(this.firstFormGroup.value.dataContratacao, 'dd-MM-yyyy') || '';
    
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const formData = new FormData();
      if(this.fotoFile){
        formData.append('foto', this.fotoFile);
      }else if(this.fotoPreview){
        formData.append('foto', this.fotoPreview as string);
      }
      if(this.data?.id){
        formData.append('id', this.data.id);
      }
      formData.append('nome', this.firstFormGroup.value.nome);
      formData.append('email', this.firstFormGroup.value.email);
      formData.append('dataContratacao', dataFormatada);
      formData.append('cpf', this.firstFormGroup.value.cpf);
      formData.append('ativo', this.firstFormGroup.value.ativo === 'sim' || this.firstFormGroup.value.ativo === true ? 'true' : 'false');
      formData.append('endereco[rua]', this.secondFormGroup.value.rua);
      formData.append('endereco[cep]', this.secondFormGroup.value.cep);
      formData.append('endereco[bairro]', this.secondFormGroup.value.bairro);
      formData.append('endereco[cidade]', this.secondFormGroup.value.cidade);
      formData.append('endereco[estado]', this.secondFormGroup.value.estado);
      this.dialogRef.close(formData);
    }
  }

  onCancelar() {
    this.dialogRef.close(null);
  }


onFotoSelecionada(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files && input.files.length > 0) {
    this.fotoFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () =>  this.fotoPreview = reader.result;
    reader.readAsDataURL(this.fotoFile);
  }
}
buscarCep() {
  const cep = this.secondFormGroup.get('cep')?.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    return; // Ou exibe erro customizado
  }

  this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
    next: (data: any) => {
      if (data.erro) {
        alert('CEP não encontrado.');
        return;
      }

      this.secondFormGroup.patchValue({
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      });
    },
    error: () => {
      alert('Erro ao buscar o CEP.');
    },
  });
}
getAtivoLabel(ativo: boolean | number | string): string {
  return ativo === true || ativo === 1 || ativo === '1' || ativo === 'true' ? 'sim' : 'nao';
}
parseDateFromString(dateString: string | undefined): Date | null {
  if(!dateString) return null;
  const parts = dateString.split('-');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // mês começa do zero
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}
}

