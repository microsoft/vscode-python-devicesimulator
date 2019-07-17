// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "./InputSlider.css"


interface ISliderProps{
    min:number;
    max: number;
    min_label: string;
    max_label: string;
    title: string;
    step:number;
}



class InputSlider extends React.Component<ISliderProps,any,any>{
    constructor(props: ISliderProps){
        super(props);
        this.state = {
            value:0
        };

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    
    render(){
      return (
        <div className="inputSlider">
            <input className="sliderValue" value={this.state.value}/>        
            <div className="sliderArea">
                <input type="range"  className="slider" aria-valuemin={this.props.min} aria-valuemax={this.props.max} step={this.props.step} title={this.props.title} onChange={this.handleOnChange} aria-valuenow={this.state.value}/>
                <div className="labelArea">
                    <div className='minLabel'>
                        {this.props.min_label}
                    </div>
                    <div className='maxLabel'>
                        {this.props.max_label}
                    </div>
                </div>
            </div>
        </div>
        
      )
    }

    private handleOnChange(event: React.ChangeEvent<HTMLInputElement>){
       const inputElement = event.target 
       const newValue = inputElement? inputElement.value:0;
       this.setState({value:newValue});
    
    }

}

export default InputSlider;

