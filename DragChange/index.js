import React, { PureComponent } from 'react';
import{

} from 'antd';
import classNames from 'classnames';
import stylei from './index.less';
import { file2str } from '@/utils/utils';

export default class DragChange extends PureComponent{
  constructor(props){
    super(props);
    this.state={

    };
    this.draging = null;
    this.targetEle = null;
  }

  componentDidMount(){
    this.file2image(this.props.pictures || []);
    this.dragBind()
  }

  dragBind = () => {
    let DragScroll = document.querySelector(".drag-scroll");

    DragScroll.ondragstart = (e) => {
      event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
      this.draging = event.target;
    }

    DragScroll.ondragover = (event) => {
      event.preventDefault();
      let target = event.target;
      //因为dragover会发生在ul上，所以要判断是不是li
      if (target.className.includes("image_box")) {
        //_index是实现的获取index
        this.targetEle = target;
      }
    }

    DragScroll.ondragend = (e) => {
      let old_point = this.draging.getBoundingClientRect();
      let new_point = this.targetEle.getBoundingClientRect();
      let parent_point = DragScroll.getBoundingClientRect();
      if (this.draging.dataset.key < this.targetEle.dataset.key) {
        this.targetEle.parentNode.insertBefore(this.draging, this.targetEle.nextSibling);
      } else {
        this.targetEle.parentNode.insertBefore(this.draging, this.targetEle);
      }
      this.draging.style.left = new_point.left-parent_point.left + 'px';
      this.draging.style.top = new_point.top-parent_point.top + 'px';
      this.targetEle.style.left = old_point.left-parent_point.left + 'px';
      this.targetEle.style.top = old_point.top-parent_point.top + 'px';
      this.getImageList()
    }
  }

  file2image = (arr) => {
    let pic = [];
    arr.forEach((val, index) => {
      let file = val || {};
      let org = file.originFileObj || {};
      let pic_img = org.imageurl;
      pic_img?pic.push(pic_img):null;
    });
    this.pushImage(pic);
  }

  pushImage = (pic_arr) => {
    let DragScroll = document.querySelector(".drag-scroll");

    DragScroll.style.height = (Math.ceil(pic_arr.length/4))*120 + 'px';
    pic_arr.forEach((val, index) => {
      let new_div = document.createElement("div");
      new_div.dataset.key = index;
      new_div.draggable = true;
      new_div.className = classNames(stylei.image_box, "image_box");
      new_div.style.left = 10 + 110*(index%4) + 'px';
      new_div.style.top = 10 + 110*Math.floor(index/4) + 'px';
      new_div.style.backgroundImage = `url(${val})`;
      DragScroll.appendChild(new_div);
    });
  }

  getImageList = () => {
    let DragScroll = document.querySelector(".drag-scroll");
    let childs = DragScroll.childNodes;
    let pictures = [];
    childs.forEach(e =>{
      let bgimg = e.style.backgroundImage;
      let imgArr = bgimg.split('"');
      pictures.push(imgArr[1]);
      this.props.onChange(pictures);
    })
  }

  render(){
    return(
      <div className={classNames("drag-box", stylei.dragBox)}>
        <div className={classNames("drag-scroll", stylei.dragScroll)}></div>
      </div>
    )
  }
}