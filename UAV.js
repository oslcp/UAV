/**
 * Created by xujiahui on 2018/1/17.
 */
var planeArray = [];
var number;

//查询
function search() {
    number = document.getElementsByClassName("uavId")[0].value;
    if(document.getElementsByClassName("uavFile")[0].style.display == "block"){
        if(isInteger(Number(number))){
            if(number<0){
                document.getElementById("message").innerHTML = "Cannot find "+number;
            }else{
                readFile();
            }
        }else{
            document.getElementById("message").innerHTML = "序号格式错误，请输入整数";
        }

    }
    if(document.getElementsByClassName("uavContent")[0].style.display == "block"){
        planeArray = handleArray(document.getElementsByClassName("uavContent")[0].value.split("\n"));
        print();
    }
}

/*
读取文件
 */
function readFile() {
    var uavFile = document.getElementsByClassName("uavFile")[0].files[0];
    planeArray = [];
    if(!/(\.txt)$/.test(uavFile.name)){
        alert("请上传txt文件");
        return false;
    }else{
        if (window.FileReader) {
            var fileReader = new FileReader();
            fileReader.onload = function() {
                planeArray = handleArray(this.result.split("\n"));
                print();
            }
            fileReader.readAsText(uavFile);
        }else{
            document.getElementById("message").innerHTML = "您的浏览器不支持FileReader，请尝试直接输入";
        }
    }
}

/*
判断故障
 */
function judge(obj){
    var uavId;
    for(var index = 0;index < obj.length; index++) {
        var plane = obj[index];

        if(index==0){
            //id由字母和数字组成
            if(/^[A-Za-z0-9]+$/.test(plane.uavId)){
                //x y z为整数
                if(isInteger(plane.uavX)&&isInteger(plane.uavY)&&isInteger(plane.uavZ)){
                    //第一行没有offset
                    if((typeof plane.offsetX =="undefined") && (typeof plane.offsetY =="undefined") && (typeof plane.offsetZ =="undefined")&& (typeof plane.other == "undefined")){
                        uavId = plane.uavId;
                        plane.isFault = false;
                        plane.curX = plane.uavX;
                        plane.curY = plane.uavY;
                        plane.curZ = plane.uavZ;
                        obj.splice(index,1,plane);
                    }
                }
            }

        }else{
            //一旦前一个故障，后续都为故障
            if(obj[index-1].isFault){
                break;
            }
            //每个文本仅记录一辆无人机
            if(plane.uavId ==uavId){
                //x y z与前一条消息的坐标相等
                if(obj[index-1].curX == plane.uavX && obj[index-1].curY ==plane.uavY && obj[index-1].curZ ==plane.uavZ){
                    // offset为整数，三个offset后面没有多余信息
                    if(isInteger(plane.offsetX) && isInteger(plane.offsetY ) && isInteger(plane.offsetZ) && typeof plane.other == "undefined"){
                        plane.curX = plane.uavX + plane.offsetX;
                        plane.curY = plane.uavY + plane.offsetY;
                        plane.curZ = plane.uavZ + plane.offsetZ;
                        plane.isFault = false;
                        obj.splice(index,1,plane);
                    }
                }
            }
        }

    }
    return obj;
}

/*
处理输入，初始化数组
 */
function handleArray(obj){
    var temp;
    for(var last = obj.length-1;last>=0;last--){
        if(obj[last] !=""){
            break;
        }
    }
    obj.length = last+1;
    for(var index = 0;index<obj.length;index++){
        var plane = obj[index].replace(/(\s*$)/g, "");
        temp = plane.split(/\s+/);
        plane = {};
        plane.uavId = temp[0];
        plane.uavX = Number(temp[1]);
        plane.uavY = Number(temp[2]);
        plane.uavZ = Number(temp[3]);
        plane.offsetX = typeof temp[4] == "undefined"? undefined:Number(temp[4]);
        plane.offsetY = typeof temp[5] == "undefined"? undefined:Number(temp[5]);
        plane.offsetZ = typeof temp[6] == "undefined"? undefined:Number(temp[6]);
        plane.isFault = true;
        plane.curX = NaN;
        plane.curY = NaN;
        plane.curZ = NaN;
        plane.other = temp[7]||undefined;
        obj.splice(index,1,plane);
    }
    return judge(obj);
}
function print() {
    if(number>=planeArray.length){
        document.getElementById("message").innerHTML = "Cannot find "+number;
    }else if(planeArray[number].isFault){
        document.getElementById("message").innerHTML = "Error: "+number;
    }else {
        document.getElementById("message").innerHTML = planeArray[number].uavId + " " + number + " " + planeArray[number].curX + " " + planeArray[number].curY + " " + planeArray[number].curZ;
    }
}
/*
判断整数
 */
function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}
function showFile() {
    document.getElementsByClassName("uavFile")[0].style.display = "block";
    document.getElementsByClassName("uavContent")[0].style.display = "none";
}
function showContent() {
    document.getElementsByClassName("uavFile")[0].style.display = "none";
    document.getElementsByClassName("uavContent")[0].style.display = "block";
}