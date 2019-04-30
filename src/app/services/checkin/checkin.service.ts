import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

  private PATH = "https://hotel-bernardi-service.herokuapp.com/restHotel/checkinService/";

  constructor(private http: HttpClient) { }

  getCheckins(somenteAberto) {
    var aberto = somenteAberto == 1 ? true : false;

    return this.http.post<any[]>(this.PATH + 'getCheckins', {somenteAbertoFilter: aberto});
  }

  saveCheckin(idCheckin, hospede, dataEntrada, dataSaida, adicionalVeiculo) {
    adicionalVeiculo = (adicionalVeiculo == null || adicionalVeiculo == "") ? false : adicionalVeiculo;
    
    return this.http.post<any>(this.PATH + 'insertUpdateCheckIn', {
      id: idCheckin,
      hospedeDoc: hospede,
      dataEntrada: dataEntrada,
      dataSaida: dataSaida,
      adicionalVeiculo: adicionalVeiculo
    });
  }
}
