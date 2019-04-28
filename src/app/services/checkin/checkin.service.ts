import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {

  private PATH = "http://localhost:8080/HotelService/restHotel/checkinService/"

  constructor(private http: HttpClient) { }

  getCheckins(somenteAberto) {
    var aberto = somenteAberto == 1 ? true : false;

    return this.http.post<any[]>(this.PATH + 'getCheckins', {somenteAbertoFilter: aberto});
  }

  saveCheckin(hospede, dataEntrada, dataSaida, adicionalVeiculo) {
    adicionalVeiculo = adicionalVeiculo == null ? false : adicionalVeiculo;
    
    return this.http.post<any>(this.PATH + 'insertUpdateCheckIn', {
      hospedeId: hospede,
      dataEntrada: dataEntrada,
      dataSaida: dataSaida,
      adicionalVeiculo: adicionalVeiculo
    });
  }
}
