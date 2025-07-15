import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  Renderer2,
  signal,
  WritableSignal,
  effect
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgStyle, DOCUMENT } from '@angular/common';
import { ChartOptions } from 'chart.js';

import {
  CardComponent,
  CardBodyComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';

import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { UsersService, User } from '../../services/users.service';

@Component({
  standalone: true,                      // ← add this
  imports: [                             // ← and list every component/directive/module
    WidgetsDropdownComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ReactiveFormsModule,
    ChartjsComponent,
    NgStyle
  ],
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer = inject(Renderer2);
  readonly #chartsData = inject(DashboardChartsData);
  readonly #userService = inject(UsersService);

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) this.setChartStyles();
  });

  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  public currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.initCharts();
    this.fetchUserData();
    this.updateChartOnColorModeChange();
  }

  private initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  private fetchUserData(): void {
    this.#userService.getAll().subscribe((users: User[]) => {
      const counts = Array(12).fill(0);
      users.forEach(u => {
        const d = new Date((u as any).Created_date);
        if (!isNaN(d.getTime())) counts[d.getMonth()]++;
      });
      this.#chartsData.Data1 = counts;
      this.#chartsData.initMainChart();
      this.initCharts();
    });
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart();
    this.initCharts();
  }

  handleChartRef(ref: any) {
    if (ref) this.mainChartRef.set(ref);
  }

  private updateChartOnColorModeChange() {
    const unlisten = this.#renderer.listen(
      document.documentElement,
      'ColorSchemeChange',
      () => this.setChartStyles()
    );
    this.#destroyRef.onDestroy(() => unlisten());
  }

  private setChartStyles() {
    if (!this.mainChartRef()) return;
    setTimeout(() => {
      const opts: ChartOptions = { ...this.mainChart.options! };
      this.mainChartRef().options.scales = {
        ...opts.scales,
        ...this.#chartsData.getScales()
      };
      this.mainChartRef().update();
    });
  }
}
