import React from 'react';
import { AxisBottom } from '@visx/axis';
import { scaleBand } from '@visx/scale'
import { Box } from '@chakra-ui/react'


// TODO
// create categorical axis
// create function that takes mock data and creates x-axis values
// create buy-leg scale and sell-leg scale
// create position scale (buy leg + sell leg scales)
// try drawing bars for each value
// use d3 example to lift bars to required y-value

const margin = {
    top: 45,
    right: 150,
    bottom: 20,
    left: 50,
};


export default function Tooltip() {

    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const bandNames = ['purchase cost', 'transport', 'tax', 'total'];
    const bAmounts: {[index: string]:any} = {'purchase cost': 200, 'transport': 80, 'tax': 40, 'total': 80};
    const bColours: {[index: string]:any} = {'purchase cost': 'red', 'transport': 'orange', 'tax': 'pink', 'total': 'green'};
    const scaleVal = scaleBand({
        domain: bandNames,
        range: [0, width],
    })

    console.log(scaleVal('tax'));

    function getHeight(key: string) {
        if (key === 'purchase cost') {
            return bAmounts['purchase cost'];
        } else if (key === 'transport') {
            return bAmounts['transport'];
        } else if (key === 'tax') {
            return bAmounts['tax'];
        } else if (key === 'total') {
            return bAmounts['total'];
        } else {
            return 0;
        }
    }

    function getXPos(metric: string, width: number) {
        const scaleValue = scaleVal(metric) ?? 0;
        const val = 75 - (width / 2);
        return scaleValue + val;
    }

    function getYPos(metric: string) {
        if (metric === 'purchase cost' || metric === 'total') {
            return 0;
        }
        const priorMetricIndex = bandNames.indexOf(metric) - 1;
        const priorMetricAmount = bAmounts[bandNames[priorMetricIndex]];
        const priorMetricTopY ='blah';
        // use loop or w/e from d3 example instead of writing own algo
        // fun exercise tho :--)

        const currentMetricAmount = bAmounts[metric];
        const difference = priorMetricAmount - currentMetricAmount;
    }

    function calculateBarPositions(data:any) {
        var cumulative = 0;
        var dataArr: any = [];
        for (var i = 0; i < data.length; i++) {
            dataArr[i].start = cumulative;
            cumulative += data[i].value;
            dataArr[i].end = cumulative;
            dataArr[i].class = ( data[i].value >= 0 ) ? 'positive' : 'negative'
        }
        dataArr.push({
            name: 'Total',
            end: cumulative,
            start: 0,
            class: 'total',
            value: cumulative
        });

        return dataArr;
    }


    return (
        <div style={{ backgroundColor: 'lightgrey', width: width + 100 }}>
            {/* <div style={{height: '100px', width: '100%', backgroundColor: 'steelblue'}}></div> */}
            <svg width={width} height={height}>
                {bandNames.map(val => (<Box
                    as="rect"
                    x={getXPos(val, 20)} y={height - (getHeight(val) + margin.top)} width={20} height={getHeight(val)} fill={bColours[val]}
                />))}

                <AxisBottom top={height - margin.top} scale={scaleVal} label="adjustments" stroke="black" tickStroke="black" />
            </svg>
        </div>
    )
}