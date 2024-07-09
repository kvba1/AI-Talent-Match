import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from './candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  numberCandidates = 50;
  private apiUrl = 'http://localhost:5001/top_candidates';

  constructor(private http: HttpClient) { }

  setNumberCandidates(count: number) {
    this.numberCandidates = count;
  }

  private getApiUrl(): string {
    return `${this.apiUrl}?n=${this.numberCandidates}`;
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.getApiUrl());
  }
}
