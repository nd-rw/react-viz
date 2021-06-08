import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale'
import { Box } from '@chakra-ui/react'


// TODO
// create categorical axis [x]
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

const positionData = {
    "margin": 5234098,
    "purchaseLegSummary": {
        "total": -19222841.5,
        "purchaseCosts": -28712841.5,
        "salesRevenue": 0,
        "transport": 0,
        "portCharges": 3440000,
        "fuelCosts": 4550000,
        "repositioning": 0,
        "canal": 1500000,
        "other": 0
    },
    "saleLegSummary": {
        "total": 24456939.5,
        "purchaseCosts": 0,
        "salesRevenue": 20256939.5,
        "transport": 0,
        "portCharges": 0,
        "fuelCosts": 4000000,
        "repositioning": 0,
        "canal": 200000,
        "other": 0
    }
}

const legData = {
    "total": -19222841.5,
    "purchaseCosts": -28712841.5,
    "salesRevenue": 0,
    "transport": 0,
    "portCharges": 3440000,
    "fuelCosts": 4550000,
    "repositioning": 0,
    "canal": 1500000,
    "other": 0
};

const barColourTypes: { [index: string]: any } = { total: '#006999', revenue: '#4CB3AB', cost: '#CA6E79'}

export default function WaterfallChart() {

    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const bandNames = ['purchase cost', 'transport', 'tax', 'total'];
    const bAmounts: {[index: string]:any} = {'purchase cost': 200, 'transport': 80, 'tax': 40, 'total': 80};
    const bColours: {[index: string]:any} = {'purchase cost': 'red', 'transport': 'orange', 'tax': 'pink', 'total': 'green'};



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
        const scaleValue = scaleVal(metric) || 0;
        const val = (width / 2);
        return scaleValue  + margin.left - (val);
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

    function getBarType(filteredObj:any, key:string) {
        if (key === 'total' || key === 'margin') {
            return 'total'
        }
        return isNegative(filteredObj[key]) ? 'cost' : 'revenue'
    }

    const isNegative = (number: number) => { return number < 0 ? true : false };
    const formatLeftAxis = (identifier: number) => identifier;
    

    const getBarObj = (filteredObj: any, key: string) => { return { name: key, value: filteredObj[key], type: getBarType(filteredObj, key)} }

    function filterLegData(data: any) {
        const notZeroVals = Object.keys(data).filter(key => data[key] !== 0)
        const filteredObj:{ [index: string]: any } = Object.keys(data)
            .filter(key => notZeroVals.includes(key))
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: data[key]
                };
            }, {});
        const filteredData = []
        for (const key in filteredObj) {
            filteredData.push(getBarObj(filteredObj, key))
        }
        return filteredData;
    }

    function filterPositionData(data: any) {
        const notZeroVals = Object.keys(data).filter(key => data[key] !== 0);
        const legNames = ['purchaseLegSummary', 'saleLegSummary'];
        const filteredPosition:any = {};
        console.log("filter: ", Object.keys(data).filter(key => notZeroVals.includes(key)));
        
        legNames.forEach(leg => {
            filteredPosition[leg] = filterLegData(data[leg])
        })

        filteredPosition.margin = getBarObj(data, 'margin');
        return filteredPosition;
    }

    const filteredData = filterLegData(legData);
    const barPositions = calculateBarPositions(filteredData);

    console.log("filteredData: ", filteredData);
    console.log("barPositions: ", barPositions);

    function calculateBarPositions(data:any) {
        var cumulative = 0;
        var dataArr: any = [];
        for (var i = 0; i < data.length; i++) {
            // fix any type
            let barObj:any = {}
            barObj.start = cumulative;
            cumulative += data[i].value;
            barObj.end = cumulative;
            dataArr.push(barObj);
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

    const scaleVal = scaleBand({
        domain: bandNames,
        range: [0, width],
        paddingOuter: 0.4,
        paddingInner: 1,
    });


    const yScale = scaleLinear({
        range: [(height - margin.bottom), 50],
        domain: [Math.min(...barPositions.map((obj: { start: number; }) => obj.start)), 300],
        round: true,
    });


    return (
        <div style={{ backgroundColor: 'lightgrey', width: width + 300, height: height + 300 }}>
            {/* <div style={{height: '100px', width: '100%', backgroundColor: 'steelblue'}}></div> */}
            <svg width={width} height={height} style={{marginTop: '100px'}}>
                {bandNames.map(val => (<Box
                    as="rect"
                    key={val}
                    x={getXPos(val, 20)} y={height - (getHeight(val) + margin.top)} width={20} height={getHeight(val)} fill={bColours[val]}
                />))}
                <AxisBottom left={margin.left} top={height -margin.top} scale={scaleVal} label="adjustments" stroke="black" tickStroke="black" />
                <AxisLeft left={margin.left + 50} scale={yScale} numTicks={10} />
            </svg>
        </div>
    )
}