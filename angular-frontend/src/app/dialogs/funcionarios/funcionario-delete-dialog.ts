import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material-module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-funcionario-delete-dialog',
    standalone: true,
    imports: [MaterialModule, MatCardModule],
    providers: [],
    templateUrl: './funcionario-delete-dialog.html',
    styleUrls: ['./funcionario-add-edit-dialog.scss']
})
export class FuncionarioDeleteDialog {

    Nome: string = "";
    id: number = 0;
    constructor(public dialogRef: MatDialogRef<FuncionarioDeleteDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.Nome = data.nome;
        this.id = data.id;

    }
    onCancelar() {
        this.dialogRef.close(null);
    }
    onDelete() {
        this.dialogRef.close(this.id);

    }

}