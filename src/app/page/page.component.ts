import * as _ from "lodash";

import { Component, OnInit } from '@angular/core';
import { Observable, first, map, startWith } from 'rxjs';

import { FormControl } from '@angular/forms';
import { HttpResponseConversion } from './../../interfaces/http-response-conversion';
import { RequestService } from './../../services/request.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

	objectKeys = Object.keys;
	symbols: any = {};

	filteredFrom: any = {};
	filteredTo: any = {};

	feePercent: number = 0;
	feeAmount: number = 0;
	convertAmount: number = 1;
	convertFrom: string = "";
	convertTo: string = "";

	interbankRate: string = "";
	customInterbankRate!: number;
	response!: HttpResponseConversion;

	constructor(
		private requestService: RequestService
	) { }

	ngOnInit(): void {
		this.requestService.getSymbols().pipe(first()).subscribe(res => {
			this.symbols = this.filteredFrom = this.filteredTo = _.cloneDeep(res.symbols);
		});
	}

	public filter(term: string): Object {
		term = term.toLowerCase();
		const asArray = Object.entries(this.symbols);
		const filtered = asArray.filter(([key, value]) => {
				return key.toLowerCase().indexOf(term) != -1 ||
					this.symbols[key].toLowerCase().indexOf(term) != -1;
			}
		);
		
		return Object.fromEntries(filtered);    
	}

	public filterFrom(event: any): void {
		this.filteredFrom = this.filter(event.target.value);
	}

	public filterTo(event: any): void {
		this.filteredTo = this.filter(event.target.value);
	}

	public swap(): void {
		let temp = this.convertFrom;
		this.convertFrom = this.convertTo;
		this.convertTo = temp;
		this.filteredFrom = this.filter(this.convertFrom);
		this.filteredTo = this.filter(this.convertTo);
	}

	public convert(): void {
		this.feePercent = this.interbankRate == 'c' ? this.customInterbankRate : Number(this.interbankRate);
		
		this.requestService.getConversion(this.convertFrom, this.convertTo, this.convertAmount)
            .pipe(first())
            .subscribe(res => {
                this.response = res;
                this.feeAmount = this.response.result * (this.feePercent / 100);
		});
	}

}
