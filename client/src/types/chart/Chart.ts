export type ChartParam = {
    code: string;
    name: string;
    unit: string;
    lineType?: string;
};

export interface ChartOption {
    dataLegend: string[];
    dataDate: string[];
    series: Array<Series>;
    min?: number;
    max?: number;
    interval?: number;
    // typeName: TypeName;
}

export interface Series {
    name: string;
    data: Array<number | null> | any[];
    type: 'line' | any;
    showSymbol?: boolean;
    smooth?: boolean;
    connectNulls?: boolean;
    areaStyle?: {}
}

export interface FoChartType {
    params: ChartParam[];
    results: any[];
}

export type TypeName = {
    [key: string]: number;
};
