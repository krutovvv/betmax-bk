import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaxlineService {

  constructor() { }

  public parseHtml(html: string): {text: string, team1: string, team2: string, bet: string}[] {

    return [];
  }

  public parseBetString(betString: string, team1: string, team2: string, sportId: number): string {
    return '';
  }
}
