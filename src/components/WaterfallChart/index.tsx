import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { Box } from '@chakra-ui/react';
import { map, pickBy } from 'lodash';
import {min, max} from 'd3-array';

// TODO
// create categorical axis [x]
// create function that takes mock data and creates x-axis values [x]
// create buy-leg scale and sell-leg scale [x]
// create position scale (buy leg + sell leg scales)
// try drawing bars for each value [x]
// use d3 example to lift bars to required y-value [x]

const margin = {
    top: 50,
    right: 150,
    bottom: 50,
    left: 100,
};

const barColourTypes: { [index: string]: any } = {
    total: '#006999',
    revenue: '#4CB3AB',
    cost: '#CA6E79',
    decrease: '#CA6E79',
    increase: '#4CB3AB',
};
interface WaterfallChartProps {
    series: BarObject[];
}

export interface BarObject { name: string, value: number, fill: string, fromZero: boolean };

export interface ProcessedBarObject extends BarObject { start: number, end: number};

const processSeries = (series: BarObject[]): ProcessedBarObject[] => {
    // Transform data (i.e., finding cumulative values and total) for easier charting
    let cumulative = 0;

    return map(series, (bar: any) => {
        console.log(bar.fromZero ? 0 : cumulative, bar.name);
        if (bar.fromZero) { cumulative = 0; }
        bar.start = cumulative
        cumulative += bar.value
        bar.end = cumulative
        return bar as ProcessedBarObject;
    })
}



export default function WaterfallChart({series}: WaterfallChartProps) {
    const width = 600;
    const height = 400;
    const barWidth = 20;

    const processedSeries = processSeries(series);


    function getXCoords(metric: string, width: number) {
        const scaleValue = scaleX(metric) || 0;
        const val = width / 2;
        return scaleValue + margin.left - val;
    }

    const formatLeftAxis = (identifier: any) => {
        return identifier;
    };


    const getHeightY = (barData: ProcessedBarObject) => {
        return Math.abs(scaleY(barData.start) - scaleY(barData.end));
        // return height - scaleY(value) - margin.bottom;
    };

    const getYCoords = (barData: ProcessedBarObject) => {
        return scaleY(Math.max(barData.start, barData.end));
    }


    const categoryNames = series.map(
        (item: { name: any }) => item.name,
    );

    const yDomain = [min(processedSeries, function (d) { return Math.min(d.start, d.end) }) ?? 0, max(processedSeries, function (d) { return Math.max(d.start, d.end) }) ?? 0];

    console.log("yDomain: ", yDomain);

    const scaleX = scaleBand({
        domain: categoryNames,
        range: [0, width],
        paddingOuter: 0.4,
        paddingInner: 1,
    });

    const scaleY = scaleLinear({
        range: [height - margin.bottom, margin.top],
        domain: yDomain,
        round: true,
    });

    const SeriesBar = ({data}: {data: ProcessedBarObject}) => {
        return (
            <Box
                as="rect"
                key={data.name + '-bar'}
                x={getXCoords(data.name, barWidth)}
                y={getYCoords(data)}
                width={barWidth}
                height={getHeightY(data)}
                fill={data.fill}
            />
        );
    }





// .attr("y", function (d) { return y(Math.max(d.start, d.end)); })
// .attr("height", function (d) { return Math.abs(y(d.start) - y(d.end)); })


    return (
        <div
            style={{
                backgroundColor: 'white',
                width: width + 300,
                height: height + 300,
            }}
        >
            <svg
                width={width + 300}
                height={height}
                style={{ marginTop: '100px' }}
            >
                <GridRows
                    left={margin.left}
                    scale={scaleY}
                    width={width}
                    height={height}
                    stroke="#F2F2F2"
                />
                {processedSeries.map((obj) => (<SeriesBar data={obj} key={obj.name} />))}
                <AxisBottom
                    left={margin.left}
                    top={height - margin.bottom}
                    scale={scaleX}
                    hideTicks={true}
                    stroke="#979797"
                />
                <AxisLeft
                    left={margin.left}
                    scale={scaleY}
                    numTicks={16}
                    tickFormat={formatLeftAxis}
                />
            </svg>
        </div>
    );
}
