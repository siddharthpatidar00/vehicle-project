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
