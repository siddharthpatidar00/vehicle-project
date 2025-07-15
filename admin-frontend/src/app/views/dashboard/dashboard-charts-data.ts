// import { Injectable } from '@angular/core';
// import { ChartData, ChartDataset, ChartOptions, ChartType, PluginOptionsByType, ScaleOptions, TooltipLabelStyle } from 'chart.js';
// import { DeepPartial } from 'chart.js/dist/types/utils';
// import { getStyle } from '@coreui/utils';

// export interface IChartProps {
//   data?: ChartData;
//   labels?: any;
//   options?: ChartOptions;
//   colors?: any;
//   type: ChartType;
//   legend?: any;

//   [propName: string]: any;
// }

// @Injectable({
//   providedIn: 'any'
// })
// export class DashboardChartsData {
//   constructor() {
//     this.initMainChart();
//   }

//   public mainChart: IChartProps = { type: 'line' };

//   public random(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   }

//   initMainChart(period: string = 'Month') {
//     const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
//     const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
//     const brandInfoBg = `rgba(${getStyle('--cui-info-rgb')}, .1)`
//     const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

//     // mainChart
//     this.mainChart['elements'] = period === 'Month' ? 12 : 27;
//     this.mainChart['Data1'] = [];
//     this.mainChart['Data2'] = [];
//     this.mainChart['Data3'] = [];

//     // generate random values for mainChart
//     for (let i = 0; i <= this.mainChart['elements']; i++) {
//       this.mainChart['Data1'].push(this.random(50, 240));
//       this.mainChart['Data2'].push(this.random(20, 160));
//       this.mainChart['Data3'].push(65);
//     }

//     let labels: string[] = [];
//     if (period === 'Month') {
//       labels = [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December'
//       ];
//     } else {
//       /* tslint:disable:max-line-length */
//       const week = [
//         'Monday',
//         'Tuesday',
//         'Wednesday',
//         'Thursday',
//         'Friday',
//         'Saturday',
//         'Sunday'
//       ];
//       labels = week.concat(week, week, week);
//     }

//     const colors = [
//       {
//         // brandInfo
//         backgroundColor: brandInfoBg,
//         borderColor: brandInfo,
//         pointHoverBackgroundColor: brandInfo,
//         borderWidth: 2,
//         fill: true
//       },
//       {
//         // brandSuccess
//         backgroundColor: 'transparent',
//         borderColor: brandSuccess || '#4dbd74',
//         pointHoverBackgroundColor: '#fff'
//       },
//       {
//         // brandDanger
//         backgroundColor: 'transparent',
//         borderColor: brandDanger || '#f86c6b',
//         pointHoverBackgroundColor: brandDanger,
//         borderWidth: 1,
//         borderDash: [8, 5]
//       }
//     ];

//     const datasets: ChartDataset[] = [
//       {
//         data: this.mainChart['Data1'],
//         label: 'Monthly User Registrations',
//         ...colors[0]
//       }
//     ];


//     const plugins: DeepPartial<PluginOptionsByType<any>> = {
//       legend: {
//         display: false
//       },
//       tooltip: {
//         callbacks: {
//           labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
//         }
//       }
//     };

//     const scales = this.getScales();

//     const options: ChartOptions = {
//       maintainAspectRatio: false,
//       plugins,
//       scales,
//       elements: {
//         line: {
//           tension: 0.4
//         },
//         point: {
//           radius: 0,
//           hitRadius: 10,
//           hoverRadius: 4,
//           hoverBorderWidth: 3
//         }
//       }
//     };

//     this.mainChart.type = 'line';
//     this.mainChart.options = options;
//     this.mainChart.data = {
//       datasets,
//       labels
//     };
//   }

//   getScales() {
//     const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
//     const colorBody = getStyle('--cui-body-color');

//     const scales: ScaleOptions<any> = {
//       x: {
//         grid: {
//           color: colorBorderTranslucent,
//           drawOnChartArea: false
//         },
//         ticks: {
//           color: colorBody
//         }
//       },
//       y: {
//         border: {
//           color: colorBorderTranslucent
//         },
//         grid: {
//           color: colorBorderTranslucent
//         },
//         max: 250,
//         beginAtZero: true,
//         ticks: {
//           color: colorBody,
//           maxTicksLimit: 5,
//           stepSize: Math.ceil(250 / 5)
//         }
//       }
//     };
//     return scales;
//   }
// }







import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  type: ChartType;
  [propName: string]: any;
}

@Injectable({ providedIn: 'any' })
export class DashboardChartsData {
  // holds the 12‑element monthly registration counts
  public Data1: number[] = Array(12).fill(0);

  public mainChart: IChartProps = { type: 'line' };

  constructor() {
    this.initMainChart();
  }

  /** Call this after you update Data1 */
  initMainChart() {
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = `rgba(${getStyle('--cui-info-rgb')}, .1)`;

    // month labels
    const labels = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // one single dataset
    const datasets: ChartDataset[] = [
      {
        data: this.Data1,
        label: 'Monthly User Registrations',
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true,
      }
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: { display: false },
      tooltip: {
        callbacks: {
          labelColor: ctx =>
            ({ backgroundColor: ctx.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };

    this.mainChart = {
      type: 'line',
      data: { labels, datasets },
      options: {
        maintainAspectRatio: false,
        plugins,
        scales: this.getScales(),
        elements: {
          line: { tension: 0.4 },
          point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 }
        }
      }
    };
  }

  public getScales(): ScaleOptions<any> {
    const borderColor = getStyle('--cui-border-color-translucent');
    const bodyColor = getStyle('--cui-body-color');

    return {
      x: { grid: { color: borderColor, drawOnChartArea: false }, ticks: { color: bodyColor } },
      y: {
        border: { color: borderColor },
        grid: { color: borderColor },
        beginAtZero: true,
        ticks: { color: bodyColor, maxTicksLimit: 5 }
      }
    };
  }
}
