import React from 'react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale'
import { Box } from '@chakra-ui/react'
import { pickBy } from 'lodash';


// TODO
// create categorical axis [x]
// create function that takes mock data and creates x-axis values
// create buy-leg scale and sell-leg scale
// create position scale (buy leg + sell leg scales)
// try drawing bars for each value
// use d3 example to lift bars to required y-value

const margin = {
    top: 50,
    right: 150,
    bottom: 50,
    left: 100,
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

const barColourTypes: { [index: string]: any } = { total: '#006999', revenue: '#4CB3AB', cost: '#CA6E79', decrease: '#CA6E79', increase: '#4CB3AB'}

export default function WaterfallChart() {

    const width = 400;
    const height = 400;
    const barWidth = 20;

    const bandNames = ['sales revenue', 'transport', 'port charges', 'fuel costs', 'net revenue'];
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

    function getBarType(filteredObj:any, key:string) {
        if (key === 'total' || key === 'margin') {
            return 'total'
        }
        return isNegative(filteredObj[key]) ? 'cost' : 'revenue'
    }

    const isNegative = (number: number) => { return number < 0 ? true : false };
    // const formatLeftAxis = (identifier: any) => {
    //     return identifier === 0 ? '' : identifier
    // };
    const formatLeftAxis = (identifier: any) => {return identifier};
    

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


    const domainY = [Math.min(...barPositions.map((obj: { start: number; }) => obj.start)), 300];


    const saleYScale = scaleLinear({
        range: [height - margin.bottom, margin.top],
        domain: [0, 100],
        round: true,
    });

    console.log("0: ", saleYScale(0));
    console.log("50: ", saleYScale(50));
    console.log("100: ", saleYScale(100));

    const getYCoords = (height: number) => {
        return saleYScale(0) - height;
    };

    const getHeightY = (value: number) => {
        return height - saleYScale(value) - margin.bottom;
    };

    const saleLegSummary = {
        "total": 66,
        "purchaseCosts": 0,
        "salesRevenue": 100,
        "transport": -5,
        "portCharges": -23,
        "fuelCosts": -6,
        "repositioning": 0,
        "canal": 0,
        "other": 0
    }

    interface SaleLegObject {
        "total": number,
        "purchaseCosts": number,
        "salesRevenue": number,
        "transport": number,
        "portCharges": number,
        "fuelCosts": number,
        "repositioning": number,
        "canal": number,
        "other": number
    }

    function getAdjustmentBars(adjustments: any) {
        return Object.keys(adjustments).map(adj => {
            return { name: adj, value: adjustments[adj], fill: adjustments[adj] > 0 ? barColourTypes.increase : barColourTypes.decrease}
        })
    }

    function getSaleLegObjs(data: SaleLegObject) {
        const notAdjustmentKeys = ["total", "salesRevenue"];
        const notZeroVals = pickBy(data, (value, key) => value !== 0 || notAdjustmentKeys.includes(key));
        const netRevenue = { name: 'Net Revenue', value: notZeroVals.total, fill: barColourTypes.revenue};
        const salesRevenue = { name: 'Sales Revenue', value: notZeroVals.salesRevenue, fill: barColourTypes.total };
        const adjustments = getAdjustmentBars(pickBy(notZeroVals, (value, key) => !notAdjustmentKeys.includes(key)));
        return [salesRevenue, adjustments, netRevenue];
    }

    const [salesRevenue, adjustments, netRevenue] = getSaleLegObjs(saleLegSummary);

    function orderSalesLegArray(salesRevenue: any, adjustments: any, netRevenue:any) {
        let salesArray = adjustments;

        // place the sales revenue at the start of the array because we want to draw it first
        salesArray.unshift(salesRevenue);

        // place the netRevenue at the end of the array becaus we want to draw it last
        salesArray.push(netRevenue);

        return salesArray
    }

    const orderedSalesLegArray = orderSalesLegArray(salesRevenue, adjustments, netRevenue);

    interface SaleLegTypes {
        salesArray: any;
    }

    function SaleLeg({ salesArray}: SaleLegTypes) {
        console.log("adjustments: ", salesArray);
        let cumulative:number = 0;
        const SaleLegBars = salesArray.map((item:any, index:number) => {
            if (index === 0) {
                cumulative += item.value;
                return <Box
                    as="rect"
                    key={item.name + '-bar'}
                    x={getXPos(item.name, barWidth)} y={getYCoords(getHeightY(item.value))} width={barWidth} height={getHeightY(item.value)} fill={item.fill}
                />
            }
            asdfadsfas;
            // TODO: x-axis is not mapping properly because name needs to max axis names defined in getXPos!!!
            const bar = <Box
                as="rect"
                key={item.name + '-bar'}
                x={getXPos(item.name, barWidth)} y={getYCoords(getHeightY(cumulative))} width={barWidth} height={getHeightY(item.value)} fill={item.fill}
            />

            cumulative += item.value;
            return bar;
        })

        return (
            <>
            {SaleLegBars}
            <AxisBottom left={margin.left} top={height - margin.bottom} scale={scaleVal} stroke="black" tickStroke="black" />
            <AxisLeft left={margin.left} scale={saleYScale} numTicks={10} tickFormat={formatLeftAxis} />
            </>
        )
    }


    const MockSellLeg = <>
            <Box
                as="rect"
                key={'sales revenue'}
                x={getXPos('sales revenue', barWidth)} y={getYCoords(getHeightY(100))} width={barWidth} height={getHeightY(100)} fill={barColourTypes.revenue}
            />
            <Box
                as="rect"
                key={'transport'}
                x={getXPos('transport', barWidth)} y={getYCoords(getHeightY(100))} width={barWidth} height={getHeightY(5)} fill={barColourTypes.cost}
            />
            <Box
                as="rect"
                key={'port charges'}
                x={getXPos('port charges', barWidth)} y={getYCoords(getHeightY(95))} width={barWidth} height={getHeightY(23)} fill={barColourTypes.cost}
            />
            <Box
                as="rect"
                key={'fuel costs'}
                x={getXPos('fuel costs', barWidth)} y={getYCoords(getHeightY(72))} width={barWidth} height={getHeightY(6)} fill={barColourTypes.cost}
            />
            <Box
                as="rect"
                key={'net revenue'}
                x={getXPos('net revenue', barWidth)} y={getYCoords(getHeightY(66))} width={barWidth} height={getHeightY(66)} fill={barColourTypes.total}
            />
            <AxisBottom left={margin.left} top={height - margin.bottom} scale={scaleVal} stroke="black" tickStroke="black" />
            <AxisLeft left={margin.left} scale={saleYScale} numTicks={10} tickFormat={formatLeftAxis} />
        </>;

    return (
        <div style={{ backgroundColor: 'lightgrey', width: width + 300, height: height + 300 }}>
            {/* <div style={{height: '100px', width: '100%', backgroundColor: 'steelblue'}}></div> */}
            <svg width={width + 300} height={height} style={{marginTop: '100px'}}>
                {/* <SaleLeg salesRevenue={salesRevenue} adjustments={adjustments} netRevenue={netRevenue}/> */}
                <SaleLeg salesArray={orderedSalesLegArray} />
            </svg>
        </div>
    )
}