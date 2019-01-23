import React, { PureComponent } from 'react';
import { connect } from 'dva';
import stylei from './index.less'
import { furn_status, colorpicker } from '@/assets/global'
import classNames from 'classnames';

export default class ColorPicker extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      colorSelect: '#000'
    }
    this.PickerBox = null;
    this.parentNode = null;
    this.colorRegion = [];
  }

  componentDidMount(){
    this.parentNode = document.querySelector('.colorPicker');
    let PickerBox = document.querySelector(`.${stylei.PickerBox}`);
    parent.onmousedown = this.selectBtn.bind(this);
    parent.onmouseup = this.endslide.bind(this);
    this.colorRegionCompute();
    this.PickerBox = PickerBox;
  }

  colorRegionCompute = () => {
    const { colors=['#fff','#000'] } = this.props;
    const { offsetWidth } = this.parentNode;
    let Unit_len = Math.round(offsetWidth/(colors.length));
    let arr = [];
    for( let i = 0; i < colors.length; i++){
      if(i === 0){
        arr = [0];
      } else if ( i === colors.length -1 ){
        arr.push(offsetWidth);
      } else {
        arr.push(Unit_len*i);
      }
    }
    this.colorRegion = arr;
  }

  selectBtn = ({target}) => {
    if(target.className.indexOf('sliderBtn') <= -1) return;
    const PickerBox = this.PickerBox;
    const { colors=['#fff','#000'] } = this.props;
    const { offsetWidth, clientX } = this.parentNode;

    const { left } = this.parentNode.getBoundingClientRect();
    let initClientX = left + 10;
    let parWidth = offsetWidth;

    PickerBox.onmousemove = (e) => {
      const { clientX, movementX } = e;
      let left = clientX - initClientX;
      if(-10 <= left && left <= parWidth-10){
        target.style.left = left + 'px';
        this.colorCompute(left-10, colors)
      }
    }
  }

  endslide = (classname) => {
    const PickerBox = this.PickerBox;
    PickerBox.onmousemove = null;
    // document.onmouseout = null;
  }

  colorCompute = (left, colors) => {
    const colorRegion = this.colorRegion;
    const { colorSelect } = this.state;
    let selectColor = '';
    if(left === colorRegion[colors.length-1]){
      selectColor= colors[colors.length-1]
      colorSelect!== selectColor&&this.setState({colorSelect:selectColor})
    } else {
      for( let i = 0; i < colors.length; i++){
        if(colorRegion[i]<= left && left<= colorRegion[i+1]){
            Math.abs(colorRegion[i]-left) <= Math.abs(colorRegion[i+1]-left)?selectColor = colors[i]:selectColor = colors[i+1];
            colorSelect!== selectColor&&this.setState({colorSelect:selectColor})
        }
      }
    }
  }

  render() {
    const { colors=['#fff','#000'], className, style={} } = this.props;
    const { colorSelect } = this.state;
    return (
      <div className={classNames(stylei.PickerBox, className)} style={{...style}}>
        <div
          className={classNames(stylei.ColorPicker, "colorPicker")}
          style={{
            background: `-webkit-linear-gradient(90deg, ${colors.join(",")})`, /* Safari 5.1 - 6.0 */
            background: `-o-linear-gradient(90deg, ${colors.join(",")})`, /* Opera 11.1 - 12.0 */
            background: `-moz-linear-gradient(90deg, ${colors.join(",")})`, /* Firefox 3.6 - 15 */
            background: `linear-gradient(90deg, ${colors.join(",")})`, /* 标准的语法 */
          }}
        >
          <button className={stylei.sliderBtn}></button>
        </div>
        <div className={stylei.colorshow} style={{background:colorSelect}}></div>
      </div>
    )
  }
}
