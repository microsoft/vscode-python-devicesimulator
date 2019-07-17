// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as React from "react";
import "./InputSlider.css"

interface ISliderProps{
    min:number;
    max: number;
    min_label: string;
    max_label: string;
    step:number;
}



class InputSlider extends React.Component<ISliderProps,any,any>{

    constructor(props: ISliderProps){
        super(props);
        this.state = {
            value:0,
            dummy: 0
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.validateRange = this.validateRange.bind(this);
    }

    
    render(){
      return (
        <div className="inputSlider">
            <input type="text"  className="sliderValue" value={this.state.value} 
            onInput={this.handleOnChange} defaultValue={this.props.min.toLocaleString()} pattern="[-?0-9]*" onKeyUp={this.validateRange}/>        
            <div className="sliderArea">
                <div className="upLabelArea">
                    <div className='minLabel'>
                        {this.props.min_label}
                    </div>
                    <div className='maxLabel'>
                        {this.props.max_label}
                    </div>
                </div>
                <input type="range"  className="slider" min={this.props.min} max={this.props.max} 
                step={this.props.step} onChange={this.handleOnChange} value={this.state.value} defaultValue={this.props.min.toLocaleString()}/>
                <div className="downLabelArea">
                    <div className='minLabel'>
                        {this.props.min}
                    </div>
                    <div className='maxLabel'>
                        {this.props.max}
                    </div>
                </div>
            </div>
            <div>{this.state.dummy}</div>
        </div>

        
      )
    }

    private handleOnChange(event: React.ChangeEvent<HTMLInputElement>){

       this.updateValue(event);
       this.validateRange();
    
    
    }

    private updateValue(event: React.ChangeEvent<HTMLInputElement>){
        const newValue = (event.target.validity.valid) ? event.target.value : this.state.value;
        this.setState({value:newValue});
        
    }

    private validateRange(){
        if(this.state.value<this.props.min){
            this.setState({value:this.props.min,dummy:2});
        }
        if(this.state.value>this.props.max){
            this.setState({value:this.props.max,dummy:1});
        }



    }


}

export default InputSlider;

