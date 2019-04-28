import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, Inject } from '@angular/core';

import { CheckinService } from '../../services/checkin/checkin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { HospedeService } from 'src/app/services/hospede/hospede.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material'

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['nome', 'documento', 'dataEntrada', 'dataSaida', 'adicionalVeiculo', 'valorGasto'];
  somenteAberto = '1';
  checkins;
  hospedes;
  checkinFormGroup;

  constructor(private checkinService: CheckinService,
              private hospedeService: HospedeService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.createFormGroup();
    this.getCheckins();
    this.getHospedes();
  }

  createFormGroup() {
    this.checkinFormGroup = new FormGroup({
      hospedeAutoCompControl: new FormControl(null, Validators.required),
      dataEntradaControl: new FormControl(null, Validators.required),
      dataSaidaControl: new FormControl(null),
      adicionalVeiculoCheckControl: new FormControl(null)
    });
  }

  getCheckins() {
    this.checkinService.getCheckins(this.somenteAberto).subscribe(
      list => {
        let array = list.map(item => {
          return {
            nome: item.nome,
            documento: item.documento,
            dataEntrada: item.dataEntrada,
            dataSaida: item.dataSaida,
            adicionalVeiculo: item.adicionalVeiculo,
            valorGasto: item.valorGasto
          };
        });
        this.checkins = new MatTableDataSource(array);
        this.checkins.sort = this.sort;
        this.checkins.paginator = this.paginator;
      }
    )
  }

  getHospedes() {
    this.hospedeService.getHospedes('').subscribe(
      list => {
        let array = list.map(item => {
          return {
            id: item.id,
            nome: item.nome,
            documento: item.documento,
          };
        });
        this.hospedes = array;
      }
    )
  }

  saveCheckin() {
    if (this.checkinFormGroup.valid) {
      this.checkinService.saveCheckin(this.checkinFormGroup.get('hospedeAutoCompControl').value,
                                      this.checkinFormGroup.get('dataEntradaControl').value,
                                      this.checkinFormGroup.get('dataSaidaControl').value,
                                      this.checkinFormGroup.get('adicionalVeiculoCheckControl').value)
      .subscribe(item => {
        if (item.isSucess) {
          this.somenteAberto = '1';
          this.getCheckins();

          this.createFormGroup();

          this.snackbarSuccess(item.message);
        } else {
          this.snackbarError(item.message);
        }
      });
    }
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(HospedeDialog, {
      width: '450px',
      data: {nome: '', documento: '', telefone: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHospedes();
    });
  }

  private configSucces: MatSnackBarConfig = {
    duration: 7000,
    verticalPosition: 'top',
    panelClass: "style-succes",    
  };

  private configError: MatSnackBarConfig = {
    duration: 7000,
    verticalPosition: 'top',
    panelClass: ['style-error'],
  };

  public snackbarSuccess(message) {
    this.snackBar.open(message, 'Fechar', this.configSucces);
  }

  public snackbarError(message) {
    this.snackBar.open(message, 'Fechar', this.configError);
  }
}

/**
 * DIALOG
 */
export interface HospedeDataDialog {
  nome: string;
  documento: string;
  telefone: string;
}

@Component({
  selector: 'hospede-dialog',
  templateUrl: 'hospede-dialog.html',
})
export class HospedeDialog {

  hospedeFormGroup;

  constructor(public dialogRef: MatDialogRef<HospedeDialog>,
              @Inject(MAT_DIALOG_DATA) public data: HospedeDataDialog,
              private hospedeService: HospedeService,
              private snackBar: MatSnackBar) {
    this.createHospedeFormGroup();
  }

  nome = 'teste'

  createHospedeFormGroup() {
    this.hospedeFormGroup = new FormGroup({
      nome: new FormControl('', Validators.required),
      documento: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveHospede() {
    if (this.hospedeFormGroup.valid) {
      this.hospedeService.saveHospede(this.hospedeFormGroup.get('nome').value, 
                                      this.hospedeFormGroup.get('documento').value, 
                                      this.hospedeFormGroup.get('telefone').value)
        .subscribe(item => {
          if (item.isSucess) {
            this.snackbarSuccess(item.message);
            this.onNoClick();
          } else {
            this.snackbarError(item.message);
          }
      });
    }
  }

  private configSucces: MatSnackBarConfig = {
    duration: 7000,
    verticalPosition: 'top',
    panelClass: "style-succes",    
  };

  private configError: MatSnackBarConfig = {
    duration: 7000,
    verticalPosition: 'top',
    panelClass: ['style-error'],
  };

  public snackbarSuccess(message) {
    this.snackBar.open(message, 'Fechar', this.configSucces);
  }

  public snackbarError(message) {
    this.snackBar.open(message, 'Fechar', this.configError);
  }
}

