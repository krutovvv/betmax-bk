import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BingoboomService {

  constructor() { }

  public parser(betString: string, team1: string, team2: string, sport: string): string {
    const betStringParts = betString.split(':');
    const [periodText, betType, betValue] = betStringParts.length > 2 ? betStringParts.map(s => s.trim()) : ['', ...betStringParts.map(s => s.trim())];
    if ((betType.includes(' и ') && !betType.includes('включая ОТ и буллиты')) || team2.includes('Желтые карточки')) {
      return '';
    }
    let periodPrefix = '';
    const periodMatches = periodText.match(/(\d+)\-(й|я|ом) (тайм|период|партия|сет|четверть|половина|карта)/);
    if (periodMatches) {
      if (['четверть', 'сет', 'период', 'партия', 'карта'].includes(periodMatches[3])) {
        if (periodMatches[3] === 'сет') {
          const gameMatch = periodText.match(/(\d+)\-й гейм$/);
          if (gameMatch) {
            periodPrefix = `GAME__${periodMatches[1]}_${parseFloat(gameMatch[1]) > 9 ? gameMatch[1] : '0' + gameMatch[1]}`;
          } else {
            periodPrefix = `SET_${periodMatches[1]}__`;
          }
        } else {
          periodPrefix = `SET_${periodMatches[1]}__`;
        }
      } else {
        periodPrefix = `HALF_${periodMatches[1]}__`;
      }
      betString = betString.replace(periodMatches[0], '');
    }
    let bet = '';
    switch (true) {
      case /^Исход$/.test(betType): {
        bet = `WIN__P${betValue[betValue.length - 1]}`;
      }
        break;
      case /^Победитель матча \(включая ОТ и буллиты\)$/.test(betType): {
        bet = `WIN_OT__P${betValue[betValue.length - 1]}`;
      }
        break;
      case /^Двойной шанс$/.test(betType): {
        bet = `WIN__${betValue}`;
      }
        break;
      case /^(Азиатский |Ком\.\d )?[Тт]отал( убийств)?( ком\.\d)?$/.test(betType): {
        const teamMatch = betType.match(/[кК]ом\.(\d)/);
        let teamPrefix = '';
        if (teamMatch) {
          teamPrefix = `P${teamMatch[1]}__`;
        }
        const valueMAtch = betValue.match(/\(([\d\.]+)\)$/);
        if (valueMAtch) {
          bet = `${teamPrefix}TOTALS__${betValue.includes('Больше') ? 'OVER' : 'UNDER'}(${valueMAtch[1]})`;
        } else if (/(не)?четный/.test(betValue)) {
          bet = `${teamPrefix}TOTALS__${betValue.includes('нечетный') ? 'ODD' : 'EVEN'}`;
        }
      }
        break;
      case /Тотал (по сетам|карт)/.test(betType): {
        const valueMAtch = betValue.match(/\(([\d\.]+)\)$/);
        if (valueMAtch) {
          bet = `SETS_TOTALS__${betValue.includes('Больше') ? 'OVER' : 'UNDER'}(${valueMAtch[1]})`;
        }
      }
        break;
      case /^(Азиатская )?Фора( убийств| по геймам)?$/.test(betType): {
        const valueMatch = betValue.match(/^Фора(\d) \(([\d\.+-]+)\)$/);
        if (valueMatch) {
          bet = `HANDICAP__P${valueMatch[1]}(${parseFloat(valueMatch[2])})`;
        }
      }
        break;
      case /^Фора по сетам$/.test(betType): {
        const valueMatch = betValue.match(/^Фора(\d) \(([\d\.+-]+)\)$/);
        if (valueMatch) {
          bet = `SETS_HANDICAP__P${valueMatch[1]}(${parseFloat(valueMatch[2])})`;
        }
      }
        break;
      case /Гандикап \(\d+:\d+\)/.test(betString): {
        const handicapMatch = betString.match(/Гандикап \((\d+):(\d+)\)/);
        const [point1, point2] = [handicapMatch[1], handicapMatch[2]];
        const playerMatch = betString.match(/(П\d|[XХ])$/);
        if (playerMatch) {
          const player = playerMatch[1].replace('П', 'P').replace(/[XХ]/, 'PX');
          const value = player === 'P1' ? parseFloat(point2) - parseFloat(point1) : parseFloat(point1) - parseFloat(point2);
          bet = `HANDICAP_3W__${player}(${value})`;
        }
      }
        break;
      case /^[Кк]ом\.\d забьет$/.test(betType): {
        const team = betType.match(/^[Кк]ом\.(\d) забьет$/)[1];
        bet = `TEAM_TO_SCORE__P${team}__${betValue === 'да' ? 'YES' : 'NO'}`;
      }
        break;
      case /^Обе команды забьют$/.test(betType): {
        bet = `BOTH_TEAMS_TO_SCORE__${betValue === 'да' ? 'YES' : 'NO'}`;
      }
        break;
      case /^Забьет только одна команда$/.test(betType): {
        bet = `ONLY_ONE_TEAM_TO_SCORE__${betValue === 'да' ? 'YES' : 'NO'}`;
      }
        break;
      case /^(Первый|Второй|Третий|Четвертый|Пятый|Шестой|Седьмой|Восьмой|Девятый|Десятый) гол$/.test(betType): {
        const goalNums = ['Первый', 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый'];
        const goalNum = goalNums.indexOf(betType.split(' ')[0]);
        bet = `WHO_SCORE_3W__${goalNum > 8 ? goalNum + 1 : `0${goalNum + 1}`}__${betValue.includes('ком.1') ? 'P1' : betValue.includes('ком.2') ? 'P2' : 'NO'}`;
      }
        break;
      case /^Следующий гол$/.test(betType): {
        const goalMatch = betString.match(/\((\d+)\)$/);
        const teamMatch = betString.match(/ком\.(\d)/i);
        if (goalMatch) {
          bet = `WHO_SCORE_3W__${goalMatch[1].length > 1 ? goalMatch[1] : '0' + goalMatch[1]}__${teamMatch ? `P${teamMatch[1]}` : 'NO'}`;
        }
      }
        break;
      case /^Кол\-во голов( ком\.\d)?$/.test(betType): {
        const team = betType.includes('ком.1') ? 'P1__' : betType.includes('ком.2') ? 'P2__' : '';
        const isOver = betValue.includes('и более');
        const valueMAtch = betValue.match(/^(\d+) /);
        if (valueMAtch) {
          const value = isOver ? parseFloat(valueMAtch[1]) - 0.5 : parseFloat(valueMAtch[1]);
          bet = `${team}TOTALS__${isOver ? 'OVER' : 'EXACT'}(${value})`;
        }
      }
        break;
      case /(Ком.1 )?[кК]ол-во голов \d+ - \d+/.test(betType) && betValue === 'да': {
        const team = betType.includes('Ком.1') ? 'P1__' : betType.includes('Ком.2') ? 'P2__' : '';
        const valueMatch = betType.match(/(\d+) - (\d+)/);
        bet = `${team}TOTALS__EXACT(${valueMatch[1]}-${valueMatch[2]})`;
      }
        break;
      case /Тайм\/матч/.test(betType): {
        if (betValue === 'да') {
          const betMatch = betType.match(/(П\d|Н)(П\d|Н)$/);
          bet = `WIN_HALF_MATCH__${betMatch[1].replace('П', 'P').replace('Н', 'PX')}_${betMatch[2].replace('П', 'P').replace('Н', 'PX')}`;
        } else if (betValue !== 'нет') {
          const betMatch = betValue.match(/^(П\d|Н)(П\d|Н)$/);
          bet = `WIN_HALF_MATCH__${betMatch[1].replace('П', 'P').replace('Н', 'PX')}_${betMatch[2].replace('П', 'P').replace('Н', 'PX')}`;
        }
      }
        break;
      case /^Счет( карт| партий| сетов| матча)$/.test(periodText): {
        bet = `CORRECT_SCORE(${betType}:${betValue})`;
      }
        break;
      case /^Тотал чет\/нечет$/.test(betType): {
        bet = `TOTALS__${/неч[её]т/.test(betValue) ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^Гонка до /.test(betType): {
        const valueMatch = betType.match(/^Гонка до (\d+)/);
        bet = `FIRST_TO_SCORE_3W__${valueMatch[1].length > 1 ? valueMatch[1] : '0' + valueMatch[1]}__${betValue.includes('1') ? 'P1' : betValue.includes('2') ? 'P2' : 'NO'}`;
      }
        break;
      case /Ком\.\d сухая победа/.test(betType): {
        bet = `CLEAN_SHEET__P${betType.match(/Ком\.(\d)/)[1]}__${betValue === 'да' ? 'YES' : 'NO'}`;
      }
        break;
      case /Перв(ые|ая) (\d+ убийств|кровь)/.test(betType): {
        const point = betType.includes('Первая') ? '1' : betType.match(/\d+/)[0];
        bet = `FIRST_TO_SCORE__${point.length > 1 ? point : '0' + point}__P${betValue[betValue.length - 1]}`;
      }
        break;
      case /Будет ли тай[- ]брей?к/.test(betType): {
        bet = `WILL_BE_OT__${betValue === 'да' ? 'YES' : 'NO'}`;
      }
        break;
      case /Результат без ничьи/.test(betType): {
        bet = `HANDICAP__P${betValue.includes('1') ? '1' : '2'}(0)`;
      }
        break;
    }
    if (bet && periodPrefix) {
      if (periodPrefix.startsWith('GAME')) {
        bet = periodPrefix + bet.replace('WIN', '');
      } else {
        bet = periodPrefix + bet;
      }
    }
    if (!/^(SET|HALF)/.test(bet)) {
      if (sport === 'basketball') {
        if (!betString.includes('(основное время)')) {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_OT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_RT__');
        }
      } else if (sport === 'hockey') {
        bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_RT__');
      }
    }
    return bet;
  }
}
