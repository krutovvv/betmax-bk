import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BwinService {

  constructor() { }

  public parser(betString: string, team1: string, team2: string, sport: string): string {
    let periodPrefix = '';
    const periodTypeMatches = betString.toLowerCase().match(/(тайм|период|парти[яю]| сет|четверт[ьи]|половин|четв\.)/);
    if (periodTypeMatches) {
      let periodType = '';
      if (['четв.', 'четверти', 'четверть', ' сет', 'период', 'партия', 'партию'].includes(periodTypeMatches[1])) {
        periodType = `SET`;
      } else {
        periodType = `HALF`;
      }
      const charPeriod = betString.toLowerCase().match(/(перв|втор|трет|четвертая)/);
      if (charPeriod) {
        periodPrefix = `${periodType}_${['перв', 'втор', 'трет', 'четвертая'].indexOf(charPeriod[1]) + 1}`;
      } else {
        const numPeriod = betString.toLowerCase().match(/(\d+)\-?(го|я|[ыо]?[йм]| период)(?!\sгейм|\sочко)/);
        if (numPeriod) {
          periodPrefix = `${periodType}_${numPeriod[1]}`;
        }
      }
    }

    let bet = '';
    switch (true) {
      case new RegExp(`одержит победу, не пропустив$`).test(betString) && !/ и /.test(betString): {
        bet = `CLEAN_SHEET__${this.HasTeam(betString.replace(' одержит победу, не пропустив', ''), team1) ? 'P1' : 'P2'}__YES`;
      }
        break;
      case /Кто выиг(ра|ар)ет \d+-е очко во? \d+-м гейме/.test(betString): {
        const scoreMatch = betString.match(/Кто выиг(?:ра|ар)ет (\d+)-е очко во? (\d+)-м гейме/);
        bet = `WHO_SCORE__${scoreMatch[2].length > 1 ? scoreMatch[2] : '0' + scoreMatch[2]}_${scoreMatch[1].length > 1 ? scoreMatch[1] : '0' + scoreMatch[1]}__${this.HasTeam(betString, team1) ? 'P1' : 'P2'}`;
      }
        break;
      case betString.match(/ и |\d+\-е очко|Преимущество победителя|\d\d:\d\d мин|первых|Понадобятся ли все/) && !/1 2 \(включая овертайм и пенальти\)|Ставка на победителя/.test(betString): {
        return '';
      }
        break;
      case /Выиграет ли команда \d, не пропустив гол/.test(betString): {
        bet = `CLEAN_SHEET__P${betString.includes('команда 1') ? '1' : '2'}__${betString === 'Нет' ? 'NO' : 'YES'}`;
      }
        break;
      case /К(акая команда|акой игрок|то)( забьет| подаст| наберет| выиграет)? перв(ой|ым)( забьет| подаст| наберет| выиграет)? \d+/.test(betString) || /1-м наберет \d+/.test(betString): {
        const suffix = ['football', 'hockey', 'baseball', 'hanball', 'futsal'].includes(sport) ? '_3W' : '';
        const point = (betString.match(/(?: забьет| подаст| наберет| выиграет)? перв(?:ой|ым)(?: забьет| подаст| наберет| выиграет)? (\d+)/) || betString.match(/1-м наберет (\d+)/))[1];
        bet = `FIRST_TO_SCORE${suffix}__${point.length > 1 ? point : '0' + point}__${this.HasTeam(betString, team1) ? 'P1' : this.HasTeam(betString, team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /1 [XХ] 2($| [^гГ]| \(лишь основное время\))|^Результат|выиграет|[пП]обедит|ставки на победу/.test(betString) && !/\([Гг]андикап/.test(betString): {
        if (!betString.includes('оба тайма')) {
          const gameMatch = betString.match(/выиграет (\d+)\-й гейм во? (\d+)\-м сете/);
          if (gameMatch) {
            const team = this.HasTeam(betString, team1) ? 'P1' : 'P2';
            bet = `GAME__${gameMatch[2]}_${parseInt(gameMatch[1], 10) > 9 ? gameMatch[1] : '0' + gameMatch[1]}__${team}`;
          } else {
            const team = /^[ХX]$/.test(betString) ? 'PX' : this.HasTeam(betString, team1) ? 'P1' : this.HasTeam(betString, team2) ? 'P2' : 'PX';
            bet = `WIN${betString.includes('лишь основное время') ? '_RT' : ''}__${team}`;
          }
        }
      }
        break;
      case /1 2 \(включая овертайм и пенальти\)|Ставка на победителя/.test(betString) && (sport === 'basketball' || sport === 'hockey'): {
        bet = `WIN__P${betString.includes(team1) ? '1' : '2'}`;
      }
        break;
      case /Какая команда (подаст|выполнит) больше угловых/.test(betString): {
        bet = `WIN__P${this.HasTeam(betString, team1) ? '1' : this.HasTeam(betString, team2) ? '2' : 'X'}`;
      }
        break;
      case /Двойной шанс/.test(betString): {
        const betStrings = betString.split(' или ');
        const drawStrIndex = betStrings.findIndex(w => /^[ХX]$/.test(w));
        switch (drawStrIndex) {
          case -1: bet = 'WIN__12';
            break;
          case 0: bet = 'WIN__X2';
            break;
          case 1: bet = 'WIN__1X';
            break;
        }
      }
        break;
      case /^(Сколько|Тотал|Сч[её]т|Сумма)/.test(betString): {
        const teamMatch = betString.match(/([кК]оманда|[иИ]грок) (\d)/);
        const teamPrefix = teamMatch ? `P${teamMatch[2]}__` : '';
        if (/^(Больше|Меньше)/.test(betString)) {
          const valueMatch = betString.match(/[\d,]+/)[0].replace(',', '.');
          bet = `${teamPrefix}TOTALS__${betString.includes('Больше') ? 'OVER' : 'UNDER'}(${parseFloat(valueMatch)})`;
        } else {
          if (/^гола не будет$/.test(betString)) {
            bet = `${teamPrefix}TOTALS__EXACT(0)`;
          } else if (/^\d+ (гол(а|ов)?|гейм(а|ов)?)$/.test(betString)) {
            bet = `TOTALS__EXACT(${betString.match(/\d+/)[0]})`;
          } else if (/^(\d+-\d+) (гол(а|ов)?|гейм(а|ов)?)$/.test(betString)) {
            bet = `TOTALS__EXACT(${betString.match(/(\d+-\d+)/)[0]})`;
          } else if (/^\d+( гол(а|ов))? или (меньше|больше)( гейм(а|ов))?$/.test(betString)) {
            const isUnder = betString.endsWith('меньше');
            let value = parseFloat(betString.match(/^\d+/)[0]);
            value = isUnder ? value + 0.5 : value - 0.5;
            bet = `TOTALS__${isUnder ? 'UNDER' : 'OVER'}(${value})`;
          }
        }
      }
        break;
      case /[гГ]андикап/.test(betString): {
        const value = betString.match(/(.+) ([+-][\d,]+)/);
        if (value) {
          bet = `HANDICAP__P${this.HasTeam(value[1], team1) ? '1' : '2'}(${parseFloat(value[2].replace(',', '.'))})`;
          if (betString.includes('по сетам')) {
            bet = `SETS_${bet}`;
          }
        } else {
          const threeWayValue = betString.match(/(\d+):(\d+)/);
          if (threeWayValue) {
            const [point1, point2] = [threeWayValue[1], threeWayValue[2]];
            const player = /^[XХ]$/.test(betString) ? 'PX' : this.HasTeam(betString, team1) ? 'P1' : 'P2';
            const value2 = player === 'P1' ? parseFloat(point2) - parseFloat(point1) : parseFloat(point1) - parseFloat(point2);
            bet = `HANDICAP_3W__${player}(${value2})`;
          }
        }
      }
        break;
      case /Забь[еёю]т ли/.test(betString) && !/обеих/.test(betString): {
        if (!betString.match(/\d+ (гола )?или больше/)) {
          const teamMatch = betString.match(/[кК]оманда (\d)/);
          const teamPrefix = teamMatch ? `TEAM_TO_SCORE__P${teamMatch[1]}` : 'BOTH_TEAMS_TO_SCORE';
          bet = `${teamPrefix}__${betString.includes('Да') ? 'YES' : 'NO'}`;
        }
      }
        break;
      case /Половина игры\/Полное время игры/.test(betString): {
        let [value1, value2] = betString.split(' / ');
        value1 = this.HasTeam(value1, team1) ? 'P1' : this.HasTeam(value1, team2) ? 'P2' : 'PX';
        value2 = this.HasTeam(value2, team1) ? 'P1' : this.HasTeam(value2, team2) ? 'P2' : 'PX';
        bet = `WIN_HALF_MATCH__${value1}_${value2}`;
      }
        break;
      case /^Сколько( голов| очков)? (забьет [кК]оманда \d|будет забито|будет набрано)( голов)?/.test(betString): {
        const teamMatch = betString.match(/[кК]оманда (\d)/);
        const teamPrefix = teamMatch ? `P${teamMatch[1]}__` : '';
        if (!betString.includes(' или ')) {
          let valueMatch = betString.match(/^(\d+) ($|гол)/);
          if (valueMatch) {
            bet = `${teamPrefix}TOTALS__EXACT(${valueMatch[1]})`;
          } else {
            valueMatch = betString.match(/^(\d+)([+-])?$/);
            if (valueMatch) {
              const value = valueMatch[2]
                ? (valueMatch[2] === '+' ? parseFloat(valueMatch[1]) - 0.5 : parseFloat(valueMatch[1]) + 0.5)
                : parseFloat(valueMatch[1]);
              bet = `${teamPrefix}TOTALS__${!valueMatch[2] ? 'EXACT' : valueMatch[2] === '+' ? 'OVER' : 'UNDER'}(${value})`;
            } else {
              valueMatch = betString.match(/(\d+)\s*[-до]+\s*(\d+)$/);
              if (valueMatch) {
                bet = `${teamPrefix}TOTALS__EXACT(${valueMatch[1]}-${valueMatch[2]})`;
              }
            }
          }
        } else {
          const isOver = betString.includes('больше');
          const valueMatch = betString.match(/^(\d+) /);
          const diff = isOver ? -0.5 : 0.5;
          const value = parseFloat(valueMatch[1]) + diff;
          bet = `${teamPrefix}TOTALS__${isOver ? 'OVER' : 'UNDER'}(${value})`;
        }
      }
        break;
      case /[Тт]очный счет|Ставка на количество партий/.test(betString) && /^\d+:\d+$/.test(betString): {
        bet = `CORRECT_SCORE(${betString})`;
      }
        break;
      case /Количество (голов|набранных очков|угловых)(.+) будет четным или нечетным|Будет ли забито нечетное или четное количество голов|Будет ли окончательный счет четным или нечетным/.test(betString): {
        bet = `TOTALS__${betString.includes('Нечетный') ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /Какая команда (забьет|подаст) (первый|второй|третий|четвертый|пятый|шестой|седьмой|восьмой|девятый|десятый|\d+\-й) (гол|угловой)/.test(betString): {
        let goalNum = 0;
        const digitGoalMatch = betString.match(/(\d+)\-й (гол|угловой)/);
        if (digitGoalMatch) {
          goalNum = parseInt(digitGoalMatch[1], 10) - 1;
        } else {
          const goalNums = ['первый', 'второй', 'третий', 'четвертый', 'пятый', 'шестой', 'седьмой', 'восьмой', 'девятый', 'десятый'];
          const goalMatch = betString.match(/Какая команда (?:забьет|подаст) (первый|второй|третий|четвертый|пятый|шестой|седьмой|восьмой|девятый|десятый) (?:гол|угловой)/);
          goalNum = goalNums.indexOf(goalMatch[1]);
        }
        bet = `WHO_SCORE_3W__${goalNum > 8 ? goalNum + 1 : `0${goalNum + 1}`}__${this.HasTeam(betString, team1) ? 'P1' : this.HasTeam(betString, team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /Какая команда первой забьет гол/.test(betString): {
        bet = `WHO_SCORE_3W__01__${this.HasTeam(betString, team1) ? 'P1' : this.HasTeam(betString, team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /Количество сыгранных партий/.test(betString): {
        bet = `SETS_TOTALS__EXACT(${betString})`;
      }
        break;
      case /Какая команда (забьет|подаст) последний (гол|угловой)/.test(betString): {
        bet = `LAST_TEAM_TO_SCORE__${this.HasTeam(betString, team1) ? 'P1' : this.HasTeam(betString, team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /Будет ли (тай-брейк|овертайм)/.test(betString): {
        bet = `WILL_BE_OT__${betString.includes('Да') ? 'YES' : 'NO'}`;
      }
        break;
      case 'Какая команда пройдет в следующий этап?' === betString: {
        bet = `WIN_OT__P${this.HasTeam(betString, team1) ? '1' : '2'}`;
      }
        break;
    }
    if (/углов(ой|ых)/.test(betString)) {
      bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?|SCORE(_3W)?)/g, '$1_CORNERS');
    }
    if (bet && periodPrefix && !bet.startsWith('GAME')) {
      bet = `${periodPrefix}__${bet}`;
    }
    if (!/^(SET|HALF)/.test(bet) && bet) {
      if (sport === 'basketball') {
        if (!betString.includes('(лишь основное время)')) {
          bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?)__/, '$1_OT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?)__/, '$1_RT__');
        }
      } else if (sport === 'hockey') {
        if (!/1 2 \(включая овертайм и пенальти\)/.test(betString)) {
          bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?)__/, '$1_RT__');
        } else {
          bet = `WIN_OT__P${betString.includes(team2) ? '2' : '1'}`;
        }
      }
    }
    return bet;
  }

  private HasTeam(betString: string, team: string): boolean {
    betString = betString.replace(/(^|\s)[A-ZА-ЯЁ]{1,3}[\.\/\s']/g, '').trim();
    team = team.replace(/(^|\s)[A-ZА-ЯЁ]{1,3}\.?\/?(\s|$)/g, '').trim();
    return betString.split(' ').every(word => team.includes(word));
  }
}
