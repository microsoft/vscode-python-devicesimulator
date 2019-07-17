// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import InputSlider from "./InputSlider";
import "./TemperatureSensorBar.css"


const TEMPERATURE_SENSOR_PROPERTIES = {
    MIN_LABEL: "Cold",
    MAX_LABEL: "Hot",
    LABEL: "Temperature sensor"
  }


interface ITemperatureUnit {
    name: string,
    minValue: number,
    maxValue: number
}

const CELSIUS_STATE: ITemperatureUnit ={
    name: "F",
    minValue: -40,
    maxValue: 40,

}
const FARENHEIT_STATE: ITemperatureUnit ={
    name: "C",
    minValue: -400,
    maxValue: 400,

}

class TemperatureSensorBar extends React.Component<any,ITemperatureUnit,any>{

    constructor(props: any){
        super(props);
        this.state = CELSIUS_STATE
        


        this.handleOnUnitChange = this.handleOnUnitChange.bind(this);
    }


    render(){

      
      return (
        <div className="temperatureSensorBar">
            <div className="header">
                <div className="title">{TEMPERATURE_SENSOR_PROPERTIES.LABEL}</div>

                <div className="celsius">
                    <input type="radio" value={CELSIUS_STATE.name}  className="celsius" name="Temperature unit" onChange={this.handleOnUnitChange}/>
                    {CELSIUS_STATE.name}
                </div>
                <div className="faren" >
                    <input type="radio" value={FARENHEIT_STATE.name} className="faren" name="Temperature unit"  onChange={this.handleOnUnitChange}/>
                    {FARENHEIT_STATE.name}
                </div>
                
            </div>
                <InputSlider min={this.state.minValue} max={this.state.maxValue}
                    min_label={TEMPERATURE_SENSOR_PROPERTIES.MIN_LABEL} max_label={TEMPERATURE_SENSOR_PROPERTIES.MAX_LABEL}
                    step={1} />

        </div>

        
      )
    }

    private handleOnUnitChange(event: React.ChangeEvent<HTMLInputElement>){
        const newValue = event.target.value;

        if(this.state.name == CELSIUS_STATE.name && newValue == FARENHEIT_STATE.name ){
            this.setState(FARENHEIT_STATE);
        }

        if(this.state.name == FARENHEIT_STATE.name && newValue == CELSIUS_STATE.name ){
            this.setState(CELSIUS_STATE);
        }

    
    }

    
    private  convertCelsiusToFaren(value:number): number{
        return value*1.8+32
    }

    private  convertsFarenToCelsius(value:number): number{
        return (value-32)/1.8
    }


}

export default TemperatureSensorBar;

