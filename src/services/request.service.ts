import { HttpClient } from '@angular/common/http';
import { HttpResponseConversion } from './../interfaces/http-response-conversion';
import { HttpResponseSymbols } from './../interfaces/http-response-symbols';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {

    private options = {
        headers: {
            "apikey": "y1RRQNLb0bN3LBcbRTe91974j5VYI6I7"
        }
    }
    
    constructor(
        private httpClient: HttpClient
    ) {}

    getSymbols(): Observable<HttpResponseSymbols> {
        return this.httpClient.get<HttpResponseSymbols>("https://api.apilayer.com/exchangerates_data/symbols", this.options);
    }

    getConversion(from: string, to: string, amount: number): Observable<HttpResponseConversion> {
        return this.httpClient.get<HttpResponseConversion>("https://api.apilayer.com/exchangerates_data/convert?to=" + to + "&from=" + from + "&amount=" + amount, this.options);
    }

}