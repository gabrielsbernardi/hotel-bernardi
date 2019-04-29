import { Component, OnInit, ViewChild, SimpleChanges, OnChanges, Inject } from '@angular/core';

import { CheckinService } from '../../services/checkin/checkin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HospedeService } from 'src/app/services/hospede/hospede.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
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
    this.getHospedes('');
  }

  createFormGroup() {
    this.checkinFormGroup = new FormGroup({
      hospedeAutoCompControl: new FormControl('', Validators.required),
      dataEntradaControl: new FormControl('', Validators.required),
      horaEntradaControl: new FormControl('', Validators.required),
      dataSaidaControl: new FormControl(''),
      horaSaidaControl: new FormControl(''),
      adicionalVeiculoCheckControl: new FormControl('')
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

  getHospedes(filter) {
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
      var dataSaida = this.checkinFormGroup.get('dataSaidaControl').value;
      var horaSaida = this.checkinFormGroup.get('horaSaidaControl').value;

      var dataSaidaSemHora = (dataSaida != null || dataSaida != "") && (horaSaida == null || horaSaida == "");
      var horaSaidaSemData = (horaSaida != null || horaSaida != "") && (dataSaida == null || dataSaida == "");

      var salvar = true;

      if (dataSaidaSemHora) {
        salvar = false;
        this.snackbarError("Hora de Saída não informada");
      } else if (horaSaidaSemData)  {
        salvar = false;
        this.snackbarError("Data de Saída não informada");
      }

      if (salvar) {
        var horaEntrada = this.checkinFormGroup.get('horaEntradaControl').value.split(":");
        var dataEntrada = new Date(this.checkinFormGroup.get('dataEntradaControl').value);
        dataEntrada.setHours(horaEntrada[0], horaEntrada[1]);

        var horaMinutoSaida = horaSaida.split(":");
        var dataSaidaFinal = new Date(dataSaida);
        dataSaidaFinal.setHours(horaMinutoSaida[0], horaMinutoSaida[1]);

        this.checkinService.saveCheckin(this.checkinFormGroup.get('hospedeAutoCompControl').value,
                                        dataEntrada,
                                        dataSaidaFinal,
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
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(HospedeDialog, {
      width: '450px',
      data: {nome: '', documento: '', telefone: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHospedes('');
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

