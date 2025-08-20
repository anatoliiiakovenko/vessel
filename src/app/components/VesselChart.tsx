import dynamic from 'next/dynamic';
import * as Highcharts from 'highcharts';
import { QuarterlyDeviation, Vessel } from '@/types';

const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
  ssr: false,
});

interface VesselChartProps {
  vessels: Vessel[];
  deviations: QuarterlyDeviation[];
}

export default function VesselChart({ vessels, deviations }: VesselChartProps) {
  const getChartOptions = () => {
    if (!deviations.length) return {};

    // Group data by vessel
    const vesselData = vessels?.map(vessel => {
      const vesselDeviations = deviations
        .filter(d => d.vesselId === vessel.imoNo)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      return {
        name: vessel.name,
        data: vesselDeviations.map(d => ({
          x: new Date(d.date).getTime(),
          y: d.deviationPercentage,
          quarter: d.quarter,
          year: d.year,
          actualEmissions: d.actualEmissions,
          baselineEmissions: d.baselineEmissions,
        })),
      };
    });

    return {
      chart: {
        type: 'line',
        height: 600,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        shadow: true,
      },
      title: {
        text: 'Vessel Emissions Deviation from Poseidon Principles Baseline',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
      subtitle: {
        text: 'Quarterly performance showing percentage deviation from minimum baseline (last day of each quarter)',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
        },
        labels: {
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject
          ) {
            const date = new Date(this.value);
            const year = date.getFullYear();
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `${year} Q${quarter}`;
          },
        },
      },
      yAxis: {
        title: {
          text: 'Deviation Percentage (%)',
        },
        plotLines: [
          {
            value: 0,
            color: '#ff0000',
            dashStyle: 'dash',
            width: 2,
            label: {
              text: 'Baseline (0%)',
              align: 'right',
              style: {
                color: '#ff0000',
              },
            },
          },
        ],
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          let tooltip = `<b>${new Date(this.x).toLocaleDateString()} (${this.points[0].point.quarter} ${this.points[0].point.year})</b><br/>`;

          this.points.forEach((point: any) => {
            const color = point.series.color;
            const deviation = point.y.toFixed(2);
            const actual = point.point.actualEmissions.toFixed(2);
            const baseline = point.point.baselineEmissions.toFixed(2);

            tooltip += `
              <span style="color:${color}">●</span> ${point.series.name}<br/>
              &nbsp;&nbsp;Deviation: <b>${deviation}%</b><br/>
              &nbsp;&nbsp;Actual: ${actual} tons CO2<br/>
              &nbsp;&nbsp;Baseline: ${baseline} tons CO2<br/>
            `;
          });

          return tooltip;
        },
      },
      legend: {
        enabled: true,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false,
          },
          enableMouseTracking: true,
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      },
      series: vesselData,
      credits: {
        enabled: false,
      },
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {deviations.length > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={getChartOptions()} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No deviation data available</p>
        </div>
      )}
    </div>
  );
}
