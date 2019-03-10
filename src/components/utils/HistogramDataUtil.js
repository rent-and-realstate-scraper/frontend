class HistogramDataUtil {
    constructor(interval = 1, maxValue = 100) {
        this.maxValue = maxValue;


    }
    getIntervalData(geoJson, property){
        console.log("_---");
        const values = {};
        for (let i=0; i<=100; i++){
            values[i.toString()] = {x:i, y:0};
        }
        for (const feature of geoJson.features){
            const value = Math.floor(feature.properties[property]);
            const valueStr = value.toString();
            if (values[valueStr]){
                values[valueStr].y = values[valueStr].y +1;
            }
        }
        return values;
    }

}

export default HistogramDataUtil;