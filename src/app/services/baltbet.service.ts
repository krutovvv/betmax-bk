import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaltbetService {
  private excludedMarkets = [
    'Результативная ничья',
    'Будет ли в матче в любое время определенный счет',
    'на момент времени',
  ];

  constructor() { }

  public parseBetString(betType: string, team1: string, team2: string, sport: string): string {
    if (this.isUnsupported(betType, team1, team2)) {
      return '';
    }
    let periodPrefix = '';
    const periodMatches = betType.toLowerCase().match(/(\d+)\-?(й|я|ом)? (тайм|период|партия|сет|четверть|половина)/);
    if (periodMatches) {
      if (['четверть', 'сет', 'период', 'партия'].includes(periodMatches[3])) {
        periodPrefix = `SET_${periodMatches[1]}__`;
      } else {
        periodPrefix = `HALF_${periodMatches[1]}__`;
      }
    }
    let bet = '';
    switch (true) {
      case /Результат в гейме/.test(betType): {
        const gameMatch = betType.match(/\((\d+)\-й сет (\d+)\-й гейм\)/);
        const playerMatch = betType.match(/Поб\. (\d)/);
        if (gameMatch && playerMatch) {
          bet = `GAME__${gameMatch[1]}_${parseInt(gameMatch[2], 10) > 9 ? gameMatch[2] : '0' + gameMatch[2]}__P${playerMatch[1]}`;
        }
      }
        break;
      case /^(По таймам )?(Результат|Двойной шанс|исход)/.test(betType): {
        if (!/\(\d+:\d+\)/.test(betType)) {
          const betValueMatch = betType.match(/([12X]{1,2})\)$/)[1];
          bet = `WIN__${betValueMatch.length > 1 ? '' : 'P'}${betValueMatch}`;
        }
      }
        break;
      case /(Фора) по (партиям|сетам)/.test(betType): {
        const betValueMatch = betType.match(/Ф([12])[КкИи]? по (?:партиям|сетам) ([+-0-9,]+)\)$/);
        bet = `SETS_HANDICAP__P${betValueMatch[1]}(${parseFloat(betValueMatch[2].replace(',', '.'))})`;
      }
        break;
      case /^(Дополнительная |По таймам |Доп\. )?[Фф]ора/.test(betType): {
        const betValueMatch = betType.match(/Ф([12])[КкИи]? ([+-0-9,]+)\)$/);
        bet = `HANDICAP__P${betValueMatch[1]}(${parseFloat(betValueMatch[2].replace(',', '.'))})`;
      }
        break;
      case /Инд\. тотал в партии/.test(betType): {
        const betValueMatch = betType.match(/ИТ ([0-9,]+) (Бол|Мен)/);
        const player = betType.includes(team1) ? '1' : '2';
        if (betValueMatch) {
          bet = `P${player}__TOTALS__${betValueMatch[2] === 'Бол' ? 'OVER' : 'UNDER'}(${parseFloat(betValueMatch[1].replace(',', '.'))})`;
        }
      }
        break;
      case /^Инд(ивидуальные|\.) тоталы?/.test(betType): {
        const betValueMatch = betType.match(/([12])[КкИи] \(([\d,]+) (Бол|Мен)/);
        if (betValueMatch) {
          bet = `P${betValueMatch[1]}__TOTALS__${betValueMatch[3] === 'Бол' ? 'OVER' : 'UNDER'}(${parseFloat(betValueMatch[2].replace(',', '.'))})`;
        }
      }
        break;
      case /^Индивидуальный тотал/.test(betType): {
        const betValueMatch = betType.match(/([\d,]+) (Бол|Мен)/);
        const teamMatch = betType.match(/(\d)(\-й команд|К )/);
        if (betValueMatch && teamMatch) {
          bet = `P${teamMatch[1]}__TOTALS__${betValueMatch[2] === 'Бол' ? 'OVER' : 'UNDER'}(${parseFloat(betValueMatch[1].replace(',', '.'))})`;
        }
      }
        break;
      case /^(Дополнительный |По таймам |Доп\. )?[Тт]отал( по (партиям|сетам))?/.test(betType): {
        const betValueMatch = betType.match(/([\d,]+) (Бол|Мен)/);
        if (betValueMatch) {
          bet = `TOTALS__${betValueMatch[2] === 'Бол' ? 'OVER' : 'UNDER'}(${parseFloat(betValueMatch[1].replace(',', '.'))})`;
          if (/по (партиям|сетам)/.test(betType)) {
            bet = `SETS_${bet}`;
          }
        } else if (/\d+ и более|Да\)/.test(betType)) {
          const longexactMatch = betType.match(/\((\d+) или (\d+)/);
          if (longexactMatch) {
            bet = `TOTALS__EXACT(${longexactMatch[1]}-${longexactMatch[2]})`;
          } else {
            const exactMatch = betType.match(/ровно ?(\d+)/);
            if (exactMatch) {
              bet = `TOTALS__EXACT(${exactMatch[1]})`;
            } else {
              const overMatch = betType.match(/(\d+) и более/);
              if (overMatch) {
                const isOver = !!betType.match(/Да\)$/);
                const value = isOver ? parseFloat(overMatch[1]) - 0.5 : parseFloat(overMatch[1]) + 0.5;
                bet = `TOTALS__${isOver ? 'OVER' : 'UNDER'}(${value})`;
              }
            }
          }
        }
      }
        break;
      case /^Обе забьют/.test(betType): {
        bet = `BOTH_TEAMS_TO_SCORE__${betType.match(/[Дд]а\)/) ? 'YES' : 'NO'}`;
      }
        break;
      case /По партиям \(\d+\-я партия/.test(betType): {
        const totalMatch = betType.match(/\(([\d,]+)\) (Бол|Мен)/);
        const handicapMatch = betType.match(/Ф([12])[КкИи]? \(([+-0-9,]+)\) Кф\)$/);
        const winMatch = betType.match(/Поб\. (\d)/);
        switch (true) {
          case !!totalMatch: {
            bet = `TOTALS__${totalMatch[2] === 'Бол' ? 'OVER' : 'UNDER'}(${parseFloat(totalMatch[1].replace(',', '.'))})`;
          }
            break;
          case !!handicapMatch: {
            bet = `HANDICAP__P${handicapMatch[1]}(${parseFloat(handicapMatch[2].replace(',', '.'))})`;
          }
            break;
          case !!winMatch: {
            bet = `WIN__P${winMatch[1]}`;
          }
            break;
        }
      }
        break;
      case /Забьет \(\d+\-й гол \dК\)$/.test(betType): {
        const betMatch = betType.match(/Забьет \((\d+)\-й гол (\d)К\)$/);
        bet = `WHO_SCORE__${betMatch[1].length > 1 ? betMatch[1] : `0${betMatch[1]}`}__P${betMatch[2]}`;
      }
        break;
      case /Чет\/нечет|Четность/.test(betType): {
        bet = `TOTALS__${betType.endsWith(' Чет)') ? 'EVEN' : 'ODD'}`;
      }
        break;
      case /[Сс]чет( по партиям| по сетам)? \(\d+[\:\-]\d+\)/.test(betType): {
        const betMatch = betType.match(/[Сс]чет( по партиям| по сетам)? \((\d+)[\:\-](\d+)\)/);
        bet = `CORRECT_SCORE(${betMatch[2]}:${betMatch[3]})`;
      }
        break;
      case /Гонка до \(\d+/.test(betType): {
        const score = betType.match(/Гонка до \((\d+)/)[1];
        const team = betType.match(/(\d)К?\)$/)[1];
        bet = `FIRST_TO_SCORE__${score.length > 1 ? score : '0' + score}__P${team}`;
      }
        break;
      case /Выиграет очко в партии/.test(betType): {
        const score = betType.match(/(\d+)\-е очко/)[1];
        const team = betType.match(/(\d)К?\)$/)[1];
        bet = `WHO_SCORE__${score.length > 1 ? score : `0${score}`}__P${team}`;
      }
        break;
      case /тайм\/матч/i.test(betType): {
        const scoreMatch = betType.match(/\(([0-9X])\/([0-9X])\)/);
        bet = `WIN_HALF_MATCH__P${scoreMatch[1]}_P${scoreMatch[2]}`;
      }
        break;
      case /Откроет счет/.test(betType): {
        bet = `WHO_SCORE__01__P${betType.includes(team1) ? '1' : '2'}`;
      }
        break;
      case /\dК выиграет матч и не пропустит/.test(betType): {
        bet = `CLEAN_SHEET__P${betType[0]}__${betType.includes('(да)') ? 'YES' : 'NO'}`;
      }
        break;
      case /Забьет кол\-во/.test(betType) && /\d+ и более|Да\)/.test(betType): {
        const longexactMatch = betType.match(/\((\d+) или (\d+)/);
        if (longexactMatch) {
          bet = `P${betType.includes(team1) ? '1' : '2'}__TOTALS__EXACT(${longexactMatch[1]}-${longexactMatch[2]})`;
        } else {
          const exactMatch = betType.match(/ровно ?(\d+)/);
          if (exactMatch) {
            bet = `P${betType.includes(team1) ? '1' : '2'}__TOTALS__EXACT(${exactMatch[1]})`;
          } else {
            const overMatch = betType.match(/(\d+) и более/);
            if (overMatch) {
              const isOver = !!betType.match(/Да\)$/);
              const value = isOver ? parseFloat(overMatch[1]) - 0.5 : parseFloat(overMatch[1]) + 0.5;
              bet = `P${betType.includes(team1) ? '1' : '2'}__TOTALS__${isOver ? 'OVER' : 'UNDER'}(${value})`;
            }
          }
        }
      }
        break;
      case /Гонка до/.test(betType): {
        const postfix = /голов|шайб/.test(betType) ? '_3W' : '';
        const value = betType.match(/(\d+) (голов|шайб)/)[1];
        const teamMatch  = betType.match(/(\d)К?\)$/);
        const team = teamMatch ? `P${teamMatch[1]}` : 'NO';
        bet = `FIRST_TO_SCORE${postfix}__${team}(${value})`;
      }
        break;
      case /Розыгрыш очка \(\d-й сет \d+-й гейм, \d+-е\)/.test(betType): {
        const pointMatch = betType.match(/Розыгрыш очка \((\d)-й сет (\d+)-й гейм, (\d+)-е\)/);
        bet = `WHO_SCORE__${pointMatch[2].length > 1 ? pointMatch[2] : '0' + pointMatch[2]}_${pointMatch[3].length > 1 ? pointMatch[3] : '0' + pointMatch[3]}__P${betType.match(/1\)$/) ? '1' : '2'}`;
      }
        break;
      case /Выход в /.test(betType): {
        bet = `WIN_OT__P${betType.includes(team1) ? '1' : '2'}`;
      }
        break;
    }
    if (bet && periodPrefix && !bet.startsWith('GAME')) {
      bet = periodPrefix + bet;
    }
    return bet;
  }

  private isUnsupported(betType: string, team1: string, team2: string): boolean {
    betType = betType
      .replace(team1, '')
      .replace(team2, '')
      .replace(/ и более/g, '')
      .replace('выиграет матч и не пропустит', '')
      .replace(/(\(|, )\d+ или \d+/g, '');
    if (this.excludedMarkets.some(m => betType.includes(m))) {
      return true;
    }
    if (/ (или|\+|и) /.test(betType)) {
      return true;
    }
  }
}
