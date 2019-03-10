class ColorMixerUtil {
    constructor() { }

    rbgStringToArray = (rgb) => {
        return rgb.replace("rgb(", "").replace(")", "").split(",");
    }

    //colorChannelA and colorChannelB are ints ranging from 0 to 255
    colorChannelMixer = (colorChannelA, colorChannelB, amountToMix) => {
        var channelA = colorChannelA * amountToMix;
        var channelB = colorChannelB * (1 - amountToMix);
        return parseInt(channelA + channelB);
    }


    colorMixer = (rgbA, rgbB, amountToMix) => {
        const arrayRbgA = this.rbgStringToArray(rgbA);
        const arrayRbgB = this.rbgStringToArray(rgbB);

        var r = this.colorChannelMixer(arrayRbgA[0], arrayRbgB[0], amountToMix);
        var g = this.colorChannelMixer(arrayRbgA[1], arrayRbgB[1], amountToMix);
        var b = this.colorChannelMixer(arrayRbgA[2], arrayRbgB[2], amountToMix);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    covertFromColorPickerOutput = (rgbObj) => {
        return "rgb(" + rgbObj["r"] + "," + rgbObj["g"] + "," + rgbObj["b"] + ")";
    }

    convertToColorPickerInput = (rgbStr) => {
        const array = this.rbgStringToArray(rgbStr);
        return {r:array[0], g:array[1], b:array[2]};
    }
}

export default ColorMixerUtil;