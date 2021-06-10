import React from 'react';
import { map, pickBy } from 'lodash';
import WaterfallChart, { BarObject } from './';

// TODO
// create categorical axis [x]
// create function that takes mock data and creates x-axis values [x]
// create buy-leg scale and sell-leg scale [x]
// create position scale (buy leg + sell leg scales)
// try drawing bars for each value [x]
// use d3 example to lift bars to required y-value [x]


const barColourTypes: { [index: string]: any } = {
    total: '#006999',
    revenue: '#4CB3AB',
    cost: '#CA6E79',
    decrease: '#CA6E79',
    increase: '#4CB3AB',
};

const positionData = {
    margin: 5234098,
    purchaseLegSummary: {
        total: -19222841.5,
        purchaseCosts: -28712841.5,
        salesRevenue: 0,
        transport: 0,
        portCharges: 3440000,
        fuelCosts: 4550000,
        repositioning: 0,
        canal: 1500000,
        other: 0,
    },
    saleLegSummary: {
        total: 24456939.5,
        purchaseCosts: 0,
        salesRevenue: 20256939.5,
        transport: 0,
        portCharges: 0,
        fuelCosts: 4000000,
        repositioning: 0,
        canal: 200000,
        other: 0,
    },
};

const saleLegSummary = {
    total: 20,
    purchaseCosts: 0,
    salesRevenue: -10,
    transport: 2,
    portCharges: -4,
    fuelCosts: -20,
    repositioning: -2,
    canal: -2,
    other: -4,
};

const purchaseLegSummary = {
    total: -38,
    purchaseCosts: -30,
    salesRevenue: 0,
    transport: -2,
    portCharges: -5,
    fuelCosts: -1,
    repositioning: 0,
    canal: 0,
    other: 0,
}

interface LegObject {
    total: number;
    purchaseCosts: number;
    salesRevenue: number;
    transport: number;
    portCharges: number;
    fuelCosts: number;
    repositioning: number;
    canal: number;
    other: number;
}

type LegObjectKey = keyof LegObject;

function getAdjustmentBars(adjustments: Partial<LegObject>): Array<BarObject> {
    return map(adjustments as any, (value: any, name: any) => {
        return {
            name: name, // TODO: use getFriendlyAdjustmentName util here
            value: value,
            fill:
                value > 0
                    ? barColourTypes.increase
                    : barColourTypes.decrease,
            fromZero: false
        } as BarObject;
    });
}


export default function EconomicsWaterfall() {
    const width = 600;
    const height = 400;

    function getEconomicsLegSeries(legObj: LegObject, legClass: 'Buy' | 'Sell' ): BarObject[] {
        // only certain keys are relevant to each leg class, ignoring irrrelevant ones
        const notAdjustmentKeys = legClass === 'Sell' ? ['total', 'salesRevenue'] : ['total', 'purchaseCosts'];

        // API returns zero for keys that have no value / null value, manually stripping them below
        const relevantKeys = pickBy(
            legObj,
            (value, key) => value !== 0 || notAdjustmentKeys.includes(key),
        );

        const adjustmentsBars = getAdjustmentBars(
            pickBy(
                relevantKeys,
                (value, key) => !notAdjustmentKeys.includes(key),
            ),
        );

        if (legClass === 'Sell') {
            const netRevenue: BarObject = {
                name: 'Net Revenue',
                value: relevantKeys.total ?? 0,
                fill: barColourTypes.total,
                fromZero: true

            };
            const salesRevenue: BarObject = {
                name: 'Sales Revenue',
                value: relevantKeys.salesRevenue ?? 0,
                fill: barColourTypes.revenue,
                fromZero: true
            };

            return [netRevenue, ...adjustmentsBars, salesRevenue];
            

        } else {
            // must be a buy leg
            const netCosts: BarObject = {
                name: 'Net Costs',
                value: relevantKeys.total ?? 0,
                fill: barColourTypes.revenue,
                fromZero: true
            };
            const purchaseCosts: BarObject = {
                name: 'Purchase Costs',
                value: relevantKeys.purchaseCosts ?? 0,
                fill: barColourTypes.cost,
                fromZero: true
            }

            return [netCosts, ...adjustmentsBars, purchaseCosts];
        }
    }

    const economicsSeriesz = getEconomicsLegSeries(
        saleLegSummary, 'Sell'
    );

    const economicsSeries =[
        {
            "name": "Net Revenue",
            "value": 20,
            "fill": "#006999",
            "fromZero": true
        },
        {
            "name": "transport1",
            "value": 2,
            "fill": "#4CB3AB",
            "fromZero": false
        },
        {
            "name": "portCharges1",
            "value": -4,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "fuelCosts1",
            "value": -20,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "repositioning1",
            "value": -2,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "canal1",
            "value": -2,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "other1",
            "value": -4,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "Sales Revenue",
            "value": -10,
            "fill": "#4CB3AB",
            "fromZero": true
        },
        {
            "name": "transport",
            "value": 2,
            "fill": "#4CB3AB",
            "fromZero": false
        },
        {
            "name": "portCharges",
            "value": -4,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "fuelCosts",
            "value": -20,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "repositioning",
            "value": -2,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "canal",
            "value": -2,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "other",
            "value": -4,
            "fill": "#CA6E79",
            "fromZero": false
        },
        {
            "name": "Margin",
            "value": -40,
            "fill": "#4CB3AB",
            "fromZero": true
        },
    ]

    return <WaterfallChart series={economicsSeries}/>;
}


