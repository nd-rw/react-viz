import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { Box } from '@chakra-ui/react';
import { pickBy } from 'lodash';

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



export default function WaterfallChart({series}: WaterfallChartProps) {
    const width = 600;
    const height = 400;
    const barWidth = 20;

    function getXPos(metric: string, width: number) {
        const scaleValue = scaleVal(metric) || 0;
        const val = width / 2;
        return scaleValue + margin.left - val;
    }

    const formatLeftAxis = (identifier: any) => {
        return identifier;
    };

    const getYCoords = (height: number) => {
        return saleYScale(0) - height;
    };

    const getHeightY = (value: number) => {
        return height - saleYScale(value) - margin.bottom;
    };


    const categoryNames = series.map(
        (item: { name: any }) => item.name,
    );

    const scaleVal = scaleBand({
        domain: categoryNames,
        range: [0, width],
        paddingOuter: 0.4,
        paddingInner: 1,
    });

    const saleYScale = scaleLinear({
        range: [height - margin.bottom, margin.top],
        domain: [0, 10], // dynamically get this
        round: true,
    });




    function SaleLeg({legArray}: any) {
        let cumulative: number = 0;
        const SaleLegBars = legArray.map((item: any, index: number) => {
            if (item.fromZero) {
                cumulative += item.value;

                return (
                    <Box
                        as="rect"
                        key={item.name + '-bar'}
                        x={getXPos(item.name, barWidth)}
                        y={getYCoords(getHeightY(item.value))}
                        width={barWidth}
                        height={getHeightY(Math.abs(item.value))}
                        fill={item.fill}
                    />
                );
            }
            if (item.value < 0) {
                console.log(
                    'cumulative: ',
                    cumulative,
                    'item.name :',
                    item.name,
                );
                const bar = (
                    <Box
                        as="rect"
                        key={item.name + '-bar'}
                        x={getXPos(item.name, barWidth)}
                        y={getYCoords(getHeightY(cumulative))}
                        width={barWidth}
                        height={getHeightY(Math.abs(item.value))}
                        fill={item.fill}
                    />
                );
                cumulative += item.value;
                return bar;
            } else if (item.value > -1 && item.name !== 'Net Revenue') {
                cumulative += item.value;
                console.log(
                    'cumulative: ',
                    cumulative,
                    'item.name :',
                    item.name,
                );
                const bar = (
                    <Box
                        as="rect"
                        key={item.name + '-bar'}
                        x={getXPos(item.name, barWidth)}
                        y={getYCoords(getHeightY(cumulative))}
                        width={barWidth}
                        height={getHeightY(Math.abs(item.value))}
                        fill={item.fill}
                    />
                );
                return bar;
            }
            return null;
        });
        return SaleLegBars;
    }

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
                    scale={saleYScale}
                    width={width}
                    height={height}
                    stroke="#F2F2F2"
                />
                <SaleLeg legArray={series} />
                <AxisBottom
                    left={margin.left}
                    top={height - margin.bottom}
                    scale={scaleVal}
                    hideTicks={true}
                    stroke="#979797"
                />
                <AxisLeft
                    left={margin.left}
                    scale={saleYScale}
                    numTicks={10}
                    tickFormat={formatLeftAxis}
                />
            </svg>
        </div>
    );
}
