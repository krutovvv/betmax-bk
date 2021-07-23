import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnewinService {

  constructor() { }

  public render() {

  }

  private parser(betString: string, team1: string, team2: string, sport: string): string {
    let betOnTeam = 0;
    [team1, team2].forEach((t, i) => {
      if (betString.includes(t)) {
        betString = betString.replace(t, '');
        betOnTeam = i + 1;
      }
    });
    if (['unknown'].includes(sport)) {
      const playerMatch = betString.match(/игрок (\d),/i);
      if (playerMatch) {
        betOnTeam = parseFloat(playerMatch[1]);
        betString = betString.replace(playerMatch[0], '');
      }
    }
    let isOT = false;
    const otMatch = betString.match(/,? \(?(вкл\.|,?включая) (овертайм|от|доп\. ?иннин?ги?)( и буллиты)?\)?/i);
    if (otMatch) {
      isOT = true;
      betString = betString.replace(otMatch[0], '');
    }
    let [betType, betValue, betSubValue] = betString.split(',').map(s => s.trim());
    let periodPrefix = '';
    const numericPeriodMatches = betType.match(/(в )?(?<periodNum>\d+)\-(й|я|м|го) (?<periodType>тайм[еа]?|период|партия|сета?|четверть|половина( матча)?|иннинг|карта)( -)? ?/i);
    if (numericPeriodMatches) {
      if (/четверть|сета?|период|партия|иннинг|карта/.test(numericPeriodMatches.groups.periodType)) {
        periodPrefix = `SET_${numericPeriodMatches.groups.periodNum}__`;
      } else {
        periodPrefix = `HALF_${numericPeriodMatches.groups.periodNum}__`;
      }
      betType = betType.replace(numericPeriodMatches[0], '');
      betType = betType.trim();
    } else {
      const wordPeriodMatches = betType.match(/(втор|перв)ого тайма/i);
      if (wordPeriodMatches) {
        periodPrefix = `HALF_${['перв', 'втор'].indexOf(wordPeriodMatches[1]) + 1}__`;
        betType = betType.replace(wordPeriodMatches[0], '').trim();
      }
    }
    let bet = '';
    switch (true) {
      case /^(Результат матча \(основное время\)|Победа( по угловым)?|Результат|Результат матча|победа в матче|победитель( в матче)?|1[xх]2)$/i.test(betType): {
        bet = `WIN__P${betOnTeam || 'X'}`;
      }
        break;
      case /^(кто выиграет иннинг|победа в сете)$/i.test(betType): {
        const periodNum = betSubValue.match(/\d+/)[0];
        bet = `SET_${periodNum}__WIN__P${betOnTeam || 'X'}`;
      }
        break;
      case /^Результат к перерыву$/.test(betType): {
        bet = `HALF_01__WIN__P${betOnTeam || 'X'}`;
      }
        break;
      case /^(Фор[аы]|азиатский гандикап)( на угловые)?$/i.test(betType): {
        bet = `HANDICAP__P${betOnTeam}(${parseFloat(betSubValue)})`;
      }
        break;
      case /^Фора по сетам/i.test(betType): {
        bet = `SETS_HANDICAP__P${betOnTeam}(${parseFloat(betSubValue)})`;
      }
        break;
      case /^Двойной шанс( в периоде)?$/.test(betType): {
        bet = `WIN__${betValue.replace('Х', 'X')}`;
        if (/в периоде/i.test(betType)) {
          bet = `SET_${betSubValue.match(/\d+/)[0]}__${bet}`;
        }
      }
        break;
      case /^(азиатский )?Тотал( раундов| - гости| гости| гостей| - хозяева?| хозяева?| угловых( \(осн\. время\))?)?$/i.test(betType)
      || (/^Тотал - геймы$/i.test(betType) && sport === 'unknown'): {
        betOnTeam = /гост(и|ей)/.test(betType) ? 2 : /хозяева?/.test(betType) ? 1 : betOnTeam;
        bet = `${betOnTeam ? `P${betOnTeam}__` : ''}TOTALS__${betValue === 'Больше' ? 'OVER' : 'UNDER'}(${parseFloat(betSubValue)})`;
      }
        break;
      case /^тотал( - хозяева| - гости)? в периоде$/i.test(betType): {
        betOnTeam = /гост(и|ей)/i.test(betType) ? 2 : /хозяева?/i.test(betType) ? 1 : betOnTeam;
        const vallMatch = betSubValue.match(/период (\d)\/([\d\.]+)/i);
        bet = `SET_${vallMatch[1]}${betOnTeam ? `__P${betOnTeam}` : ''}__TOTALS__${betValue === 'Больше' ? 'OVER' : 'UNDER'}(${parseFloat(vallMatch[2])})`;
      }
        break;
      case /^тотал ?\(3 исхода\)$/i.test(betType): {
        const resultsArray: Array<[number, string]> = [[0.5, 'OVER'], [0, 'EXACT'], [-0.5, 'UNDER']];
        const resultIndex = [/больше/i, /равно/i, /меньше/i].findIndex(r => r.test(betValue));
        bet = `TOTALS__${resultsArray[resultIndex][1]}(${parseFloat(betSubValue) + resultsArray[resultIndex][0]})`;
      }
        break;
      case /^(точное число|точное количество|количество|мультигол|голы|общее число|сколько)( - Ставка на несколько вариантов количества голов| голов забьют| голов в матче| угловых| голов| забитых голов)?( -)?( гости| хозяева| гостей| хозяев)?( в периоде)?$/i.test(betType): {
        betOnTeam = /гост(и|ей)/.test(betType) ? 2 : /хозяева?/.test(betType) ? 1 : betOnTeam;
        betValue = betValue.replace(/ гол(а|ов)/, '');
        const overUnderMatch = betValue.match(/(?<num>\d+) и(ли)? (?<overunder>более|менее)/) || betValue.match(/(?<overunder>более|менее) (?<num>\d+)/i) || betValue.match(/^(?<num>\d+)(?<overunder>\+)$/i);
        if (overUnderMatch) {
          const isOver = /\+|более/i.test(overUnderMatch.groups.overunder);
          const val = isOver ? parseFloat(overUnderMatch.groups.num) - 0.5 :  parseFloat(overUnderMatch.groups.num) + 0.5;
          bet = `${betOnTeam ? `P${betOnTeam}__` : ''}TOTALS__${isOver ? 'OVER' : 'UNDER'}(${val})`;
        } else {
          bet = `${betOnTeam ? `P${betOnTeam}__` : ''}TOTALS__EXACT(${betValue})`;
        }
        if (/в периоде/i.test(betType)) {
          bet = `SET_${betSubValue.match(/\d+/)[0]}__${bet}`;
        }
      }
        break;
      case /^количество? сетов в матче$/i.test(betType): {
        bet = `SETS_TOTALS__EXACT(${betValue.match(/\d+/)[0]})`;
      }
        break;
      case /^тотал карт$/i.test(betType): {
        bet = `SETS_TOTALS__${betValue === 'Больше' ? 'OVER' : 'UNDER'}(${parseFloat(betSubValue)})`;
      }
        break;
      case /^обе( команды) ? забьют( в периоде)?$/i.test(betType): {
        bet = `BOTH_TEAMS_TO_SCORE__${betValue === 'Нет' ? 'NO' : 'YES'}`;
        if (/в периоде/i.test(betType)) {
          bet = `SET_${betSubValue.match(/\d+/)[0]}__${bet}`;
        }
      }
        break;
      case /^(какая )?команда забьет последн(ий гол|ей)$/i.test(betType): {
        bet = `LAST_TEAM_TO_SCORE__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^(какая команда забьет )?(следующий гол|забросят следующими)( в периоде)?$/i.test(betType): {
        let set = '';
        if (/в периоде/i.test(betType)) {
          [set, betSubValue] = betSubValue.split('/');
        }
        const currentScoreMatch = betSubValue.match(/(\d+):(\d+)$/);
        const goalnum = parseInt(currentScoreMatch[1], 10) + parseInt(currentScoreMatch[2], 10) + 1;
        bet = `WHO_SCORE_3W__${goalnum > 9 ? goalnum : `0${goalnum}`}__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
        if (set) {
          bet = `SET_${set}__${bet}`;
        }
      }
        break;
      case /^набер[её]т очко$/i.test(betType): {
        const goalnum = betSubValue.match(/\d+/)[0];
        bet = `WHO_SCORE_3W__${goalnum.length > 1 ? goalnum : `0${goalnum}`}__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^Первыми забьют гол [xх] по сч[её]ту$/i.test(betType): {
        const goalnum = betSubValue.match(/\d+/)[0];
        bet = `WHO_SCORE__${goalnum.length > 1 ? goalnum : `0${goalnum}`}__P${betOnTeam}`;
      }
        break;
      case /^(какая Команда забьет первой|Команда забьет первой|кто откроет счет)$/i.test(betType): {
        bet = `FIRST_TO_SCORE_3W__01__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^кто выиграет гонку до [хx] очков$/i.test(betType): {
        const point = betSubValue.match(/\d+/)[0];
        bet = `FIRST_TO_SCORE_3W__${point.length > 1 ? point : '0' + point}__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^(сет|карта) - кто быстрее выиграет ("[хx]" геймов|количество раундов)$/i.test(betType): {
        const valMatch = betSubValue.match(/(сет|карта) (?<set>\d+)\/(?<game>\d+)/i);
        bet = `SET_${valMatch.groups.set}__FIRST_TO_SCORE__${valMatch.groups.game.length > 1 ? valMatch.groups.game : '0' + valMatch.groups.game}__P${betOnTeam}`;
      }
        break;
      case /^(кто первым набер[её]т очко|Первыми забьют гол [xх])$/i.test(betType): {
        const goalnum = betSubValue.match(/\d+/)[0];
        bet = `FIRST_TO_SCORE__${goalnum.length > 1 ? goalnum : `0${goalnum}`}__P${betOnTeam}`;
      }
        break;
      case /^гандикап( в периоде)?$/i.test(betType): {
        let set = '';
        if (/в периоде/i.test(betType)) {
          [set, betSubValue] = betSubValue.split('/');
        }
        const [point1, point2] = betSubValue.split(':').map(s => parseFloat(s));
        const val = betOnTeam === 1 ? point2 - point1 : point1 - point2;
        bet = `HANDICAP_3W__P${betOnTeam || 'X'}(${val})`;
        if (set) {
          bet = `SET_${set}__${bet}`;
        }
      }
        break;
      case /^(хозяева|гости) не пропустят( в периоде)?$/i.test(betType): {
        bet = `TEAM_TO_SCORE__P${/хозяева/i.test(betType) ? 2 : 1}__${betValue === 'Нет' ? 'YES' : 'NO'}`;
        if (/в периоде/i.test(betType)) {
          bet = `SET_${betSubValue.match(/\d+/)[0]}__${bet}`;
        }
      }
        break;
      case /^Последний угловой$/i.test(betType): {
        bet = `LAST_TEAM_TO_SCORE__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^Чет\/Нечет( - голы| очки| геймы| - геймы в матче)?$/i.test(betType): {
        bet = `TOTALS__${/нечет/i.test(betValue) ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^Чет\/Нечет (хозяева|гости)$/i.test(betType): {
        betOnTeam = /гости/.test(betType) ? 2 : /хозяева/.test(betType) ? 1 : betOnTeam;
        bet = `P${betOnTeam}__TOTALS__${/нечет/i.test(betValue) ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^(карта - )?Ч[её]т\/Неч[её]т (- геймы в сете|раундов с учетом дополнительных)$/i.test(betType): {
        const period = betSubValue.match(/\d+/)[0];
        bet = `SET_${period}__TOTALS__${/неч[её]т/i.test(betValue) ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^точный сч[её]т( в матче| в периоде)?$/i.test(betType): {
        bet = `CORRECT_SCORE(${/^\d+:\d+$/.test(betValue) ? betValue : 'ANY_OTHER'})`;
        if (/в периоде/i.test(betType)) {
          bet = `SET_${betSubValue.match(/\d+/)[0]}__${bet}`;
        }
      }
        break;
      case /^(хозяева|гости) выиграют и не пропустят/i.test(betType): {
        bet = `CLEAN_SHEET__P${/хозяева/i.test(betType) ? 1 : 2}__${betValue === 'Нет' ? 'NO' : 'YES'}`;
      }
        break;
      case /^\/матч$/.test(betType): {
        const [timeValue, matchValue] = betValue.split('/').map(s => s.replace('Х', 'X'));
        bet = `WIN_HALF_MATCH__P${timeValue}_P${matchValue}`;
      }
        break;
      case /^какая команда забьет$/i.test(betType): {
        switch (true) {
          case /^обе забьют$/i.test(betValue): {
            bet = `BOTH_TEAMS_TO_SCORE__YES`;
          }
            break;
          case /^гола не будет$/i.test(betValue): {
            bet = `NO_ONE_TO_SCORE__YES`;
          }
            break;
          case /^только/i.test(betValue): {
            bet = `ONLY_TEAM_TO_SCORE__P${betOnTeam}__YES`;
          }
            break;
        }
      }
        break;
      case /^(будет ли )?(овертайм|доп\.иннинг)$/i.test(betType): {
        bet = `WILL_BE_OT__${betValue === 'Нет' ? 'NO' : 'YES'}`;
      }
        break;
      case /^победа в гейме$/i.test(betType): {
        const set = periodPrefix.match(/SET_(\d+)/)[1];
        const game = betSubValue.match(/\d+/)[0];
        bet = `GAME__${set}_${game.length > 1 ? game : '0' + game}__P${betOnTeam}`;
      }
        break;
    }
    if (bet && periodPrefix && !/^(GAME|WIN_HALF)/.test(bet)) {
      bet = periodPrefix + bet;
    }
    if (!/^(SET|HALF)/.test(bet)) {
      if (sport === 'hockey' || sport === 'basketball') {
        if (isOT || (sport === 'basketball' && betType === 'Победитель') ) {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_OT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_RT__');
        }
      }
    }
    return bet;
  }
}
