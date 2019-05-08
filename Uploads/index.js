import React,{ PureComponent, Fragment } from 'react';
import classnames from 'classnames';
import stylei from './index.less';

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if(response.status <= 504 && response.status >= 500) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const imageUpload = (params) => {
  let url = 'picture/upload';
  return fetch(url, {
    method: 'POST',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Accept": 'application/json',
    },
    body: params,
  })
  .then(checkStatus)
  .then(response => response.json())
  .then(response=> {
    return response;
  })
  .catch(e => {
    console.log("upload error", e)
  });
}

export default class Uploads extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      imageUrl: undefined,
      loading: false,
    };
  }

  componentDidMount(){
    let { name, value } = this.props;
    this.setState({ imageUrl: value });
  }

  init(){
    let UploadsBoxList = document.querySelectorAll(".UploadsBox");
    UploadsBoxList.forEach((val, index) => {
      val.onmouseenter = (e) => {
        let img = val.querySelector("img") || {};
        let  imageUrl = img.src;
        if(imageUrl){
        let UploadsMask = val.querySelector(".UploadsMask");
          if(UploadsMask){
            UploadsMask.style.display = "flex";
          }
        }
      };
      val.onmouseleave = (e) => {
        let img = val.querySelector("img") || {};
        let  imageUrl = img.src;
        if(imageUrl){
          // let UploadsMask = document.querySelectorAll(".UploadsMask")[index];
          let UploadsMask = val.querySelector(".UploadsMask");
          if(UploadsMask){
            UploadsMask.style.display = "none";
          }
        }
      };
    })
  }

  async changeInput (props, e) {
    let { onChange = () => {}  } = props;
    let inputs = e.target;
    let file = inputs.files[0];
    let data = new FormData();
    data.append("picture", file);
    data.append("pucid", "20190221173339657001");
    this.setState({loading: true})
    let res = await imageUpload(data);
    if(res.status == 200){
      this.setState({loading: false, imageUrl: res.data.pictureUrl });
      onChange(res.data.pictureUrl);
    } else {
      this.setState({loading: false, imageUrl: undefined })
      onChange();
    }
    this.init();
  }

  imageCtrl (props, e) {
    let ele = e.target;
    let { type } = ele.dataset;
    let { onChange = () => {}, onPreview = () => {} } = props;

    switch (type) {
      case "eye":
        let { imageUrl } = this.state;
        onPreview(imageUrl);
        break;
    
      case "delete":
        this.setState({imageUrl: undefined});
        onChange("");
        break;
      default:
        break;
    }
  }

  render(){
    let { imageUrl, loading, } = this.state;
    const { accept = "image/*", name, onChange } = this.props;
    const uploadButton = (
      <div className={stylei.uploadButton}>
        {
          loading?
          <svg viewBox="0 0 1024 1024" className={stylei.anticonSpin} data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
          </svg>:
          <svg viewBox="64 64 896 896" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M848 474H550V152h-76v322H176c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h298v322h76V550h298c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
          </svg>
        }
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    this.init();
    return(
      <div 
        className={classnames(stylei.UploadsBox, "UploadsBox")} style={{border: "1px solid #d9d9d9"}}>
        {
          imageUrl?
          <Fragment>
            <div className={stylei.UploadsLabel}><img src={imageUrl} alt="" className={stylei.image}/></div>
            <div 
            className={classnames(stylei.UploadsMask, "UploadsMask")}>
              <i className={classnames(stylei.preView)} onClick={this.imageCtrl.bind(this, this.props)}>
                <svg viewBox="64 64 896 896" data-type="eye" width="16px" height="16px" fill="#fff" aria-hidden="true">
                  <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                </svg>
              </i>
              <i className={classnames(stylei.preView)} onClick={this.imageCtrl.bind(this, this.props)}>
                <svg viewBox="64 64 896 896"  data-type="delete" width="16px" height="16px" fill="#fff" aria-hidden="true">
                  <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                </svg>
              </i>
            </div>
          </Fragment>
          :
          <Fragment>
            <label className={stylei.UploadsLabel} htmlFor={`UploadsInput-${name}`} >{uploadButton}</label>
            <input id={`UploadsInput-${name}`} style={{display:'none'}} onChange={this.changeInput.bind(this, this.props)} type="file" accept={accept}/>
          </Fragment>
        }
      </div>
    )
  }
}