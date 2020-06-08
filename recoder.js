
function record() {
    //开启本机麦克风
    window.navigator.mediaDevices.getUserMedia({
        audio: {
            sampleRate: 8000, // 输入采样率
            channelCount: 1,   // 声道
            volume: 4.0        // 音量
        }
    }).then(mediaStream => {
        // mediaStreamg = mediaStream;
        beginRecord(mediaStream);
    }).catch(err => {
        // 如果用户电脑没有麦克风设备或者用户拒绝了，或者连接出问题了等
        // 这里都会抛异常，并且通过err.name可以知道是哪种类型的错误 
        console.log(err);
    });
}


function createJSNode(audioContext) {
    const BUFFER_SIZE = 256;
    const INPUT_CHANNEL_COUNT = 1;
    const OUTPUT_CHANNEL_COUNT = 1;
    // createJavaScriptNode已被废弃
    let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
    creator = creator.bind(audioContext);
    return creator(BUFFER_SIZE,
        INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
}


let leftDataList = [];
let size = 0
//获取左右声道的数据并保存
function onAudioProcess(event) {
    let audioBuffer = event.inputBuffer;
    let leftChannelData = audioBuffer.getChannelData(0);


    //leftDataList.push(leftChannelData.slice(0));
    leftDataList.push(new Float32Array((leftChannelData)))
    size += leftChannelData.length

}
//开始录音
function beginRecord(mediaStream) {
    let audioContext = new (window.AudioContext || window.webkitAudioContext);
    let mediaNode = audioContext.createMediaStreamSource(mediaStream);
    // 创建一个jsNode
    let jsNode = createJSNode(audioContext);
    // 需要连到扬声器消费掉outputBuffer，process回调才能触发
    // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
    jsNode.connect(audioContext.destination);
    jsNode.onaudioprocess = onAudioProcess;
    // 把mediaNode连接到jsNode
    mediaNode.connect(jsNode);
    // jsNodeg = jsNode;
    // mediaNodeg = mediaNode;
}

//清空数据
function flushData() {
    leftDataList = [];
}

//播放录音
function player(data) {
    var player = new PCMPlayer({
        encoding: '16bitInt',
        channels: 2,
        sampleRate: 8000,
        flushingTime: 10,
    });
    player.volume(5);
    player.feed(data);
    leftDataList = [];
}
// 停止录音

function getData() {
    var sampleBits = 16
    var inputSampleRate = 44100
    var outputSampleRate = 12000
    var bytes = decompress(leftDataList, size, inputSampleRate, outputSampleRate)
    var dataLen = bytes.length * (sampleBits / 8)
    var buffer = new ArrayBuffer(dataLen) // For PCM , 浏览器无法播放pcm格式音频
    var data = new DataView(buffer)
    var offset = 0
    data = reshapeData(sampleBits, offset, bytes, data)
    //   return new Blob([data], { type: 'audio/pcm' })
    return data;
}
// 将二维数组转成一维数组
function decompress(buffer, size, inputSampleRate, outputSampleRate) {
    var data = new Float32Array(size)
    var offset = 0
    for (var i = 0; i < buffer.length; i++) {
        data.set(buffer[i], offset)
        offset += buffer[i].length
    }
    // 降采样
    var interval = parseInt(inputSampleRate / outputSampleRate)
    var length = data.length / interval
    var result = new Float32Array(length)
    var index = 0; var j = 0
    while (index < length) {
        result[index] = data[j]
        j += interval
        index++
    }
    return result
}
function reshapeData(sampleBits, offset, bytes, data) {
    var s
    for (var i = 0; i < bytes.length; i++, offset += (sampleBits / 8)) {
        s = Math.max(-1, Math.min(1, bytes[i]))
        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }
    return data
}


function stopRecord() {
    let b = getData();
    return new Int8Array(b.buffer);
}
//上传到服务器
function upload(blob) {

    var formData = new FormData();
    formData.append("file", blob, 'aaa.raw');
    //上传数据
    $.ajax({
        url: 'http://localhost:3000/audio',
        type: 'post',
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'json',
        success: function (res) {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "---" + errorThrown);
        }
    });
}