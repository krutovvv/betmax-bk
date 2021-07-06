import { Injectable } from '@angular/core';
import { CheckService } from './check.service';
import { ParserService } from './parser.service';

@Injectable({
  providedIn: 'root'
})
export class FavbetService {

  constructor(private checkService: CheckService, private parserService: ParserService) { }

  public favbet(html: string, sport: number): {team1: string, team2: string, bet: string, value: string, check: null | {name: string, parts: string[]}} {
    const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
    const title = clear.replace(/.*<div[^>]*class="[^"]*nameContainer[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1');
    const split = title.split('-');
    const team1 = (split[0] || '').trim();
    const team2 = (split[1] || '').trim();
    const betString = `${clear.replace(/.*<div[^>]*class="[^"]*marketName[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1') || '-'} ${clear.replace(/.*<div[^>]*class="[^"]*outcomeName[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1') || '-'}`;
    const betValue = clear.replace(/.*<div[^>]*class="[^"]*outcomeCoef[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1');
    const betParse = this.parserService.parser(betString, team1, team2, sport);
    const betCheck = this.checkService.check(betParse);

    return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
  }
}
