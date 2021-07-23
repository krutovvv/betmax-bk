import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BetcityService {
  private oldVersion = false;

  constructor() { }

  public parser(betString: string, team1: string, team2: string, sport: string): string {
    if (team1.startsWith('ЖК ')) {
      return '';
    }
    let periodPrefix = '';
    if (betString.includes('(Kills)')) {
      betString = betString.replace(/ ?\(Kills\)/, '');
    }
    const periodMatches = betString.match(/(\d)\-(й|я|о?м|ой|го)\s(четверть|сет|тайм|половина|период|партия|карта|иннинг)/);
    if (periodMatches) {
      if (['четверть', 'сет', 'период', 'партия', 'карта', 'иннинг'].includes(periodMatches[3])) {
        periodPrefix = `SET_${periodMatches[1]}__`;
      } else {
        periodPrefix = `HALF_${periodMatches[1]}__`;
      }
      betString = betString.replace(periodMatches[0], '');
    }
    let betOnTeam = 0;
    let corners = false;
    [team1, team2] = [team1, team2].map((team, index) => {
      if (team.startsWith('УГЛ ')) {
        team = team.replace('УГЛ ', '');
        corners = true;
      }
      if (betString.includes(team)) {
        betString = betString.replace(team, '');
        betOnTeam = index + 1;
      }
      return team;
    });
    betString = betString.replace(/^УГЛ /, '').trim();
    let bet = '';
    const betMatches = betString.match(/^([А-ЯЁа-яёX]*)(1X|12|\d?)(\([^\)]+\))?$/);
    if (betMatches && betMatches[3]) {
      betMatches[3] = betMatches[3].replace(/\(/g, '').replace(/\)/g, '');
    }
    switch (true) {
      case betMatches && betMatches[1] && 'ТБ' === betMatches[1]: {
        bet = `TOTALS__OVER(${parseFloat(betMatches[3])})`;
      }
        break;
      case betMatches && betMatches[1] && 'ТМ' === betMatches[1]: {
        bet = `TOTALS__UNDER(${parseFloat(betMatches[3])})`;
      }
        break;
      case betMatches && betMatches[1] && 'ИТБ' === betMatches[1]: {
        bet = `P${betMatches[2]}__TOTALS__OVER(${parseFloat(betMatches[3])})`;
      }
        break;
      case betMatches && betMatches[1] && 'ИТМ' === betMatches[1]: {
        bet = `P${betMatches[2]}__TOTALS__UNDER(${parseFloat(betMatches[3])})`;
      }
        break;
      case betMatches && betMatches[1] && 'Ф' === betMatches[1]: {
        bet = `HANDICAP__P${betMatches[2]}(${parseFloat(betMatches[3])})`;
      }
        break;
      case betMatches && betMatches[1] && /^[ХX]$/.test(betMatches[1]): {
        if (betMatches[2] === '2') {
          bet = 'WIN__X2';
        } else if (betMatches[2] === '') {
          bet = 'WIN__PX';
        }
      }
        break;
      case /П(\d)\sгейм\((\d+)\)/.test(betString): {
        const gameMatch = betString.match(/П(\d)\sгейм\((\d+)\)/);
        bet = `${this.GetGamePrefix(team1, team2, gameMatch[2])}__P${gameMatch[1]}`;
      }
        break;
      case betString.includes('Обе забьют') && !/хотя бы| и |в обоих/.test(betString): {
        const periodMatches2 = betString.match(/(\d)\-о?м\s(периоде|тайме)/);
        if (periodMatches2) {
          bet = `${periodMatches2[2] === 'периоде' ? 'SET' : 'HALF'}_${periodMatches2[1]}__BOTH_TEAMS_TO_SCORE__${betString.includes('Да') ? 'YES' : 'NO'}`;
        } else {
          bet = `BOTH_TEAMS_TO_SCORE__${betString.includes('Да') ? 'YES' : 'NO'}`;
        }
      }
        break;
      case /^(П\d|Н)(П\d|Н)$/.test(betString): {
        const betMatch = betString.match(/(П\d|Н)(П\d|Н)$/);
        bet = `WIN_HALF_MATCH__${betMatch[1].replace('П', 'P').replace('Н', 'PX')}_${betMatch[2].replace('П', 'P').replace('Н', 'PX')}`;
      }
        break;
      case /[ТT][oо]чн[оo][еe] к[оo]л\-в[оo] (г[оo]л[оo]в|ш[аa]йб)|[КK][оo]л-в[оo] г[оo]л[оo]в +в матче/.test(betString) && !/Нет$/.test(betString): {
        const betValue = betString.split(':')[1].replace(/ - Да$/, '').trim();
        const teamPrefix = betOnTeam ? `P${betOnTeam}__` : '';
        if (betValue.includes('и более')) {
          bet = `${teamPrefix}TOTALS__OVER(${parseFloat(betValue.match(/\d+/)[0]) - 0.5})`;
        } else {
          bet = `${teamPrefix}TOTALS__EXACT(${betValue})`;
        }
      }
        break;
      case /Кол-во голов +в тайме/.test(betString): {
        const betValue = betString.split(':')[1].trim();
        const teamPrefix = betOnTeam ? `P${betOnTeam}__` : '';
        if (betValue.includes('и более')) {
          bet = `${teamPrefix}TOTALS__OVER(${parseFloat(betValue.match(/\d+/)[0]) - 0.5})`;
        } else {
          bet = `${teamPrefix}TOTALS__EXACT(${betValue.match(/\d+-\d+/)[0]})`;
        }
      }
        break;
      case /([12][КKк]|Никто не) (забь[её]т гол|(команда )?подаст угл)\(\d+\)/.test(betString): {
        const goalMatch = betString.match(/([12][КKк]|Никто не) (?:забь[её]т гол|(?:команда )?подаст угл)\((\d+)\)/);
        const team = goalMatch[1].includes('1') ? 'P1' : goalMatch[1].includes('2') ? 'P2' : 'NO';
        bet = `WHO_SCORE_3W__${goalMatch[2].length > 2 ? goalMatch[2] : '0' + goalMatch[2]}__${team}`;
      }
        break;
      case /^(Первый|Второй|Третий|Четвертый|Пятый|Шестой|Седьмой|Восьмой|Девятый|Десятый) гол ?/.test(betString)
      && !/Ногой|Головой|Со штрафного|С пенальти|Автогол/i.test(betString)
      && !/^(Первый|Второй|Третий|Четвертый|Пятый|Шестой|Седьмой|Восьмой|Девятый|Десятый) гол : Да$/.test(betString): {
        const goalNums = ['Первый', 'Второй', 'Третий', 'Четвертый', 'Пятый', 'Шестой', 'Седьмой', 'Восьмой', 'Девятый', 'Десятый'];
        const goalNum = goalNums.indexOf(betString.split(' ')[0]);
        bet = `WHO_SCORE_3W__${goalNum > 8 ? goalNum + 1 : `0${goalNum + 1}`}__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^Нет голов$|^Нет гола во? \d/.test(betString): {
        bet = `WHO_SCORE_3W__01__NO`;
      }
        break;
      case /^Забьет \d+ или \d+.+Да$/.test(betString): {
        const teamPrefix = betOnTeam ? `P${betOnTeam}__` : '';
        const valueMatch = betString.match(/^Забьет (\d+) или (\d+)/);
        bet = `${teamPrefix}TOTALS__EXACT(${valueMatch[1]}-${valueMatch[2]})`;
      }
        break;
      case /^Гол во? [12]-ом тайме : (Да|Нет)$/.test(betString): {
        bet = `NO_ONE_TO_SCORE__${betString.endsWith('Да') ? 'NO' : 'YES'}`;
      }
        break;
      case /тотал[ _](не)?четный/i.test(betString): {
        bet = `TOTALS__${betString.includes('нечет') ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /[зЗ]абьет/.test(betString) && /(Да|Нет)$/.test(betString) && !/Хотя бы одна|игрок|обоих| и |подряд|Каждая команда забьет|с \d+ по \d+ мин/.test(betString): {
        bet = `TEAM_TO_SCORE__P${betOnTeam}__${betString.endsWith('Да') ? 'YES' : 'NO'}`;
      }
        break;
      case /Точный счет/.test(betString): {
        const betStringParts = betString.split(':');
        if (betStringParts.length > 2) {
          bet = `CORRECT_SCORE(${betStringParts[1].trim()}:${betStringParts[2]})`;
        } else {
          bet = `CORRECT_SCORE(ANY_OTHER)`;
        }
      }
        break;
      case /^(- )?\d+:\d+$/.test(betString): {
        bet = `CORRECT_SCORE(${betString.replace('- ', '')})`;
      }
        break;
      case /^Др\. счет$/.test(betString): {
        bet = `CORRECT_SCORE(ANY_OTHER)`;
      }
        break;
      case /^Забьет свой \d+.+: ?Не забьет$/.test(betString): {
        bet = `TEAM_TO_SCORE__P${betOnTeam}__NO`;
      }
        break;
      case /Гонка до \d+(-х)?/.test(betString): {
        const waySuffix = / голов /.test(betString) ? '_3W' : '';
        const valueMatch = betString.match(/Гонка до (\d+)(-х)?/);
        const team = betOnTeam ? `P${betOnTeam}` : betString.match(/П[12]/) ? (betString.includes('П1') ? 'P1' : 'P2') : 'NO';
        bet = `FIRST_TO_SCORE${waySuffix}__${valueMatch[1].length > 1 ? valueMatch[1] : '0' + valueMatch[1]}__${team}`;
      }
        break;
      case /Победит и не пропустит/.test(betString) && !!betOnTeam: {
        bet = `CLEAN_SHEET__P${betOnTeam}__${betString.endsWith('Да') ? 'YES' : 'NO'}`;
      }
        break;
      case /^Индивидуальный тотал.+: ?(Чет|Нечет)$/.test(betString): {
        bet = `P${betOnTeam}__TOTALS__${betString.endsWith('Нечет') ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^И[ТT][12] (не)?ч[её]тный$/.test(betString): {
        bet = `P${betString.match(/^И[ТT]1/) ? '1' : '2'}__TOTALS__${betString.match(/неч[её]т/) ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^Гол во? е : (Да|Нет)$/.test(betString): {
        bet = `NO_ONE_TO_SCORE__${betString.endsWith('Да') ? 'NO' : 'YES'}`;
      }
        break;
      case /Т(отал|[МMБ]) по (партиям|картам|сетам|иннингам)/.test(betString): {
        const overUnderMatch = betString.match(/[TТ]([MМБ])/);
        const valueMatch = betString.match(/\(([^\)]+)\)/);
        if (valueMatch && overUnderMatch) {
          bet = `SETS_TOTALS__${overUnderMatch[1] === 'Б' ? 'OVER' : 'UNDER'}(${parseFloat(valueMatch[1])})`;
        }
      }
        break;
      case /Точное число (партий|сетов|иннингов|карт)/.test(betString): {
        const valueMatch = betString.match(/\d+/)[0];
        bet = `SETS_TOTALS__EXACT(${valueMatch})`;
      }
        break;
      case /^[-–—]$/.test(betString): {
        bet = `WIN__P${betOnTeam}`;
      }
        break;
      case /Первая кровь [-–—]/.test(betString): {
        bet = `WHO_SCORE__01__P${betOnTeam}`;
      }
        break;
      case /\d+-й раунд.+П[12]/.test(betString): {
        const scoreMatch = betString.match(/(\d+)-й раунд.+П([12])/);
        bet = `WHO_SCORE__${scoreMatch[1].length > 1 ? scoreMatch[1] : '0' + scoreMatch[1]}__P${scoreMatch[2]}`;
      }
        break;
      case /овертайм: (Да|Нет)$/.test(betString): {
        bet = `WILL_BE_OT__${betString.endsWith('Да') ? 'YES' : 'NO'}`;
      }
        break;
      case /^\d+-е очко \d+-й гейм - П[12]/.test(betString): {
        const scoreMatch = betString.match(/^(\d+)-е очко (\d+)-й гейм - П([12])/);
        bet = `WHO_SCORE__${scoreMatch[2].length > 1 ? scoreMatch[2] : scoreMatch[2]}_${scoreMatch[1].length > 1 ? scoreMatch[1] : '0' + scoreMatch[1]}__P${scoreMatch[3]}`;
      }
        break;
      case /\d+-е очко +- П[12]/.test(betString): {
        const scoreMatch = betString.match(/^(\d+)-е очко +- П([12])/);
        bet = `WHO_SCORE__${scoreMatch[1].length > 1 ? scoreMatch[1] : '0' + scoreMatch[1]}__P${scoreMatch[2]}`;
      }
        break;
      case /Последний гол/.test(betString): {
        bet = `LAST_TEAM_TO_SCORE__${betOnTeam ? `P${betOnTeam}` : 'NO'}`;
      }
        break;
      case /^Проход \d$/.test(betString): {
        bet = `WIN_OT__P${betString.split(' ')[1]}`;
      }
        break;
      case betMatches && '' === betMatches[1]: {
        switch (betMatches[2]) {
          case '1X': {
            bet = 'WIN__1X';
          }
            break;
          case '12': {
            bet = 'WIN__12';
          }
            break;
          default: {
            if (!['1', '2'].includes(betMatches[2])) {
              return '';
            }
            bet = `WIN__P${betMatches[2]}`;
          }
        }
      }
        break;
    }
    if (corners) {
      bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?|SCORE(_3W)?)/g, '$1_CORNERS');
    }
    if (bet && !bet.startsWith('GAME') && !bet.startsWith('WIN_HALF')) {
      bet = periodPrefix + bet;
    }
    if (!/^(SET|HALF)/.test(bet)) {
      if (sport === 'basketball') {
        if (!betString.includes('(основное время)')) {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_OT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_RT__');
        }
      } else if (sport === 'hockey') {
        if (!/^Победа \d в матче/.test(betString)) {
          bet = bet.replace(/(WIN|TOTALS|HANDICAP|GOALS)__/, '$1_RT__');
        } else {
          bet = `WIN_OT__P${betString.includes(' 2 ') ? '2' : '1'}`;
        }
      }
    }
    return bet;
  }

  private GetMatchTitleElement(team1: string, team2: string): HTMLElement {
    return Array.prototype.find.call(document.querySelectorAll('span.line-event__name'), (span: HTMLSpanElement) => {
      return span.innerText.includes(team1) && span.innerText.includes(team2);
    });
  }

  private GetGamePrefix(team1: string, team2: string, game: string): string {
    let setScoresUnformatted = '';
    if (this.oldVersion) {
      const matchInfoContainer = document.querySelector<HTMLDivElement>('.block-live');
      setScoresUnformatted = matchInfoContainer.innerText.match(/\((\d:\d,?\s?)+\)/g)[0];
    } else {
      const matchTitleElement: HTMLElement = this.GetMatchTitleElement(team1, team2);
      if (matchTitleElement) {
        const currentScore = (matchTitleElement.nextElementSibling as HTMLSpanElement).innerText.replace(/[\n\s]/g, '');
        setScoresUnformatted = currentScore.match(/\([^\)]+\)/)[0];
      } else {
        return `GAME__00_${game.length > 1 ? game : `0${game}`}`;
      }
    }
    const setsScores = setScoresUnformatted.replace(/[\(\)]/g, '').split(',');
    const previousSetsGamesPlayed = setsScores.slice(0, setsScores.length - 1).reduce((accumulator, setScore) => {
      return accumulator + setScore.split(':').reduce((acc, score) => acc + parseInt(score, 10), 0);
    }, 0);
    const currentSet = setsScores.length;
    const currentGame = parseInt(game, 10) - previousSetsGamesPlayed;
    return `GAME__0${currentSet}_${currentGame > 9 ? currentGame : `0${currentGame}`}`;
  }
}
