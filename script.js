let videoPlayer = document.querySelector("video");
let mediaRecorder;
let largerChunks = [];
let recordButton = document.querySelector("#btn");
let isRecording = false;
let captureBtn = document.querySelector("#capture");
let body = document.querySelector("body")
let allFilters = document.querySelector(".filter-option").querySelectorAll("div");
let filterColor = "";
let currZoom = 1; //min = 1 and max = 3
let zoomPlus = document.querySelector("#plus");
let zoomMinus = document.querySelector("#minus");
let galleryBtn = document.querySelector("#gallery");

galleryBtn.addEventListener("click",function(){
    location.assign("gallery.html")
})

zoomPlus.addEventListener("click",function(){
    currZoom = currZoom + 0.1;
    if(currZoom > 3 ){
        currZoom = 3;
    }

    videoPlayer.style.transform = `scale(${currZoom})`
    // console.log(currZoom)
})


zoomMinus.addEventListener("click",function(){
    currZoom = currZoom - 0.1;
    if(currZoom < 1 ){
        currZoom = 1;
    }
    
    videoPlayer.style.transform =  `scale(${currZoom})`;

    // console.log(currZoom)
})

for(let i = 0; i < allFilters.length; i++){
    allFilters[i].addEventListener("click",function(e){

        let preDiv = document.querySelector(".filter-div")

        if(preDiv != null){
            preDiv.classList.remove("filter-div")
        }

        let color = e.currentTarget.style.backgroundColor;
        filterColor = color
        let div = document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor = color
        body.append(div)
    })
}

recordButton.addEventListener("click", function () {

    let innerSpan = recordButton.querySelector("span");

    let divfilter = document.querySelector(".filter-div")
    
    if(divfilter != null) {
        divfilter.remove()
    }

    filterColor = "";

    if (isRecording == true) {
        mediaRecorder.stop();

        innerSpan.classList.remove("record-animation")

        isRecording = false;
    } else {
        mediaRecorder.start();
        currZoom = 1;
        videoPlayer.style.transform =  `scale(${currZoom})`

        innerSpan.classList.add("record-animation")

        isRecording = true;
    }

})

//navigator is functionality which is provided by bom -> browser object modulation aur .mediadevices ek object hae uske function getUserMedia hae aur navigator     function ek promise return karta hae

let promiseToUseCameraAudio = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
});

promiseToUseCameraAudio
    .then(function (mediaStream) {
        // console.log("User has allowed acess of camera and audio");
        videoPlayer.srcObject = mediaStream
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.addEventListener("dataavailable", function (e) {
            largerChunks.push(e.data);
        })

        mediaRecorder.addEventListener("stop", function () {
            let blob = new Blob(largerChunks, { type: "video/mp4" });

            saveMedia(blob)

            //to convert the blob in to link
            // let link = URL.createObjectURL(blob);

            // let anchotTag = document.createElement("a");
            // anchotTag.href = link;
            // anchotTag.download = "video.mp4";
            // anchotTag.click();
            // anchotTag.remove()
        })
    })
    .catch(function () {
        console.log("User has denied the acess of camera and audio")
    })


captureBtn.addEventListener("click", function () {
    let innerSpan = captureBtn.querySelector("span");

    innerSpan.classList.add("capture-animation")

    setTimeout(function(){
        innerSpan.classList.remove("capture-animation")
    },1000)

    let canvasElem = document.createElement("canvas");

    canvasElem.width = videoPlayer.videoWidth;

    canvasElem.height = videoPlayer.videoHeight;

    let tool = canvasElem.getContext("2d");

    tool.translate(canvasElem.width/2,canvasElem.height/2)

    tool.scale(currZoom,currZoom);

    tool.translate(-canvasElem.width/2,-canvasElem.height/2)


    tool.drawImage(videoPlayer, 0, 0)

    if (filterColor != "") {
        tool.fillStyle = filterColor;
        tool.fillRect(0, 0, canvasElem.width, canvasElem.height);
    }

    let url = canvasElem.toDataURL();
    // console.log(url);

    saveMedia(url)

    // let anchorTag = document.createElement("a");

    // anchorTag.href = url;

    // anchorTag.download = "image.png";

    // anchorTag.click();

    // anchorTag.remove();

})