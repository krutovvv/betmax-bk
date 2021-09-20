import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  public types = [
    {
      name: 'WIN_HALF_MATCH',
      patterns: [
        /^(?<basis>WIN_HALF_MATCH)__(?<pivot>(?:P[12X]|12|1X|X2)_(?:P[12X]|12|1X|X2))$/
      ]
    },
    {
      name: 'CORRECT_SCORE',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>CORRECT_SCORE)(?:_(?<ot_rt>OT|RT|ET))?\((?<pivot>[0-9]+:[0-9]+|ANY_OTHER|ANY_P[12])\)$/
      ]
    },

    {
      name: 'TEAMS_TO_SCORE',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(((BOTH_TEAMS|ONLY_ONE_TEAM|NO_ONE)_TO_SCORE|(ONLY_)?(?<basis>TEAM_TO_SCORE)__(?<plr>P[12]))__(?<dst>YES|NO))$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?LAST_(?<basis>TEAM_TO_SCORE)__(?<plr>(?:P[12]|NO))$/
      ]
    },
    {
      name: 'WHO_SCORE',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>WHO_SCORE)__(?<pivot>\d\d\d?(?:_\d\d)?)__(?<plr>(?:P[12]))$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>WHO_SCORE)_?(?<_3w>3W)__(?<pivot>\d\d\d?(?:_\d\d)?)__(?<plr>(?:P[12]|NO))$/
      ]
    },
    {
      name: 'WILL_BE_OT',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>WILL_BE_OT)__(?<dst>YES|NO)$/
      ]
    },
    {
      name: 'FIRST_TO_SCORE',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>FIRST_TO_SCORE)__(?<pivot>\d\d\d?(?:_\d\d)?)__(?<plr>(?:P[12]))$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>FIRST_TO_SCORE)_?(?<_3w>3W)__(?<pivot>\d\d\d?(?:_\d\d)?)__(?<plr>(?:P[12]|NO))$/
      ]
    },
    {
      name: 'TOTALS_ODD',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?:(?<plr>P[12])__)?(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>ODD)$/
      ]
    },
    {
      name: 'TOTALS_EVEN',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?:(?<plr>P[12])__)?(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>EVEN)$/
      ]
    },
    {
      name: 'TOTALS_CORNERS_ODD',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?:(?<plr>P[12])__)?(?<basis>TOTALS_CORNERS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>ODD)$/
      ]
    },
    {
      name: 'TOTALS_CORNERS_EVEN',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?:(?<plr>P[12])__)?(?<basis>TOTALS_CORNERS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>EVEN)$/
      ]
    },
    {
      name: 'CLEAN_SHEET',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>CLEAN_SHEET)__(?<plr>P[12])__(?<dst>YES|NO)$/
      ]
    },
    {
      name: 'SETS_TOTALS',
      patterns: [
        /^(?<basis>SETS_TOTALS)__(?<dst>UNDER|OVER)\((?<pivot>\d+\.(?:25|5|75))\)$/,
        /^(?<basis>SETS_TOTALS)__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/
      ]
    },
    {
      name: 'SETS_HANDICAP',
      patterns: [
        /^(?<basis>SETS_HANDICAP)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<plr>P[12])\((?<pivot>-?[\d]+(?:\.(?:25|5|75))?)\)$/
      ]
    },
    {
      name: 'WIN',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>WIN)(?:_(?<ot_rt>OT|RT|ET))?__(?<plr>P[12X]|1X|2X|X2|12)$/
      ]
    },
    {
      name: 'WIN_CORNERS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>WIN_CORNERS)?__(?<plr>P[12X]|1X|2X|X2|12)$/
      ]
    },
    {
      name: 'ASIAN_TOTALS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+\.(\d\d))\)$/
      ]
    },
    {
      name: 'ASIAN_TOTALS_CORNERS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS_CORNERS?)(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+\.(\d\d))\)$/
      ]
    },
    {
      name: 'TOTALS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+(?:\.(?:25|5|75))?)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS)_?(?<_3w>3W)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>OVER|UNDER)\((?<pivot>\d+)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS)_?(?<_3w>3W)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/
      ]
    },
    {
      name: 'TOTALS_CORNERS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS_CORNERS)?(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+(?:\.(?:25|5|75))?)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS_CORNERS)?(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS_?(?<_3w>3W)_CORNERS)?(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>OVER|UNDER)\((?<pivot>\d+)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>TOTALS_?(?<_3w>3W)_CORNERS)?(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/
      ]
    },
    {
      name: 'TEAM_TOTALS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<plr>P[12])__(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+(?:\.(?:25|5|75))?)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<plr>P[12])__(?<basis>TOTALS)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/
      ]
    },
    {
      name: 'TEAM_TOTALS_CORNERS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<plr>P[12])__(?<basis>TOTALS_CORNERS?)(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>OVER|UNDER)\((?<pivot>[\d]+(?:\.\d+)?)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<plr>P[12])__(?<basis>TOTALS_CORNERS?)(?:_(?<ot_rt>OT|RT|ET))?__(?<dst>EXACT)\((?<pivot>\d+\-\d+|\d+)\)$/
      ]
    },
    {
      name: 'HANDICAP',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>HANDICAP)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<plr>P[12])\((?<pivot>-?[\d]+(?:\.(?:25|5|75))?|PK)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>HANDICAP)_?(?<_3w>3W)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<plr>P[12X])\((?<pivot>-?[\d]+(?:\.(?:25|5|75))?)\)$/
      ]
    },
    {
      name: 'HANDICAP_CORNERS',
      patterns: [
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>HANDICAP_CORNERS?)(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<plr>P[12])\((?<pivot>-?[\d]+(?:\.(?:25|5|75))?)\)$/,
        /^(?:(?<period_name>SET|HALF)_(?<period_no>\d\d)__)?(?<basis>HANDICAP)_?(?<_3w>3W)_CORNERS?(?:_(?<ot_rt>OT|RT|ET|CT))?__(?<plr>P[12X])\((?<pivot>-?[\d]+(?:\.(?:25|5|75))?)\)$/
      ]
    },
    {
      name: 'GAME_WIN',
      patterns: [
        /^(?<basis>GAME)(?:_(?<ot_rt>CT))?__(?<pivot>\d\d_\d\d)__(?<plr>P[12])$/
      ]
    },
    {
      name: 'WIN_PLACE',
      patterns: [
        /^(?<plr>P\d{1,2})__(?<basis>PLACE)\(\d{1,2}[-+]?\)$/
      ]
    }
  ];

  constructor() { }

  public check(bet: string): null | {name: string, parts: string[]} {
    if (bet) {
      for (let i = 0; i < this.types.length; i ++) {
        const patterns = this.types[i].patterns;
        for (let u = 0; u < patterns.length; u ++) {
          const result = bet.match(patterns[u]);
          if (result !== null) {
            return {name: this.types[i].name, parts: result};
          }
        }
      }
    } else {
      return null;
    }
  }
}
