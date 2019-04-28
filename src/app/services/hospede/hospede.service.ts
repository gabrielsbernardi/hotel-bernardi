import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HospedeService {

  private PATH = "http://localhost:8080/HotelService/restHotel/hospedeService/"

  constructor(private http: HttpClient) { }

  getHospedes(nomDocTel) {
    return this.http.post<any[]>(this.PATH + 'getHospedes', {nomDocTelFilter: nomDocTel});
  }

  saveHospede(nome, documento, telefone) {
    return this.http.post<any>(this.PATH + 'insertUpdateHospede', {
      nome: nome,
      documento: documento,
      telefone: telefone
    });
  }
}
