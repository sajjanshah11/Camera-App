let req = indexedDB.open("gallery", 1);

let database;
let numberOfMedia = 0;


req.addEventListener("success", function () {
  database = req.result;
  // console.log("1");
});
req.addEventListener("upgradeneeded", function () {
  let db = req.result;

  db.createObjectStore("media", { keyPath: "mId" });

  console.log(db)
  // console.log("2");

});

req.addEventListener("error", function () {
  console.log("3")
});

function saveMedia(media) {
  if (!database) return;

  let data = {
    mId: Date.now(),
    mediaData: media,
  };

  let tx = database.transaction("media", "readwrite");
  let mediaobjectStore = tx.objectStore("media");
  mediaobjectStore.add(data);
}

function viewMedia() {

  if (!database) {
    return;
  }
  let galleryContainer = document.querySelector(".gallery-container");

  let tx = database.transaction("media", "readonly")
  let mediaobjectStore = tx.objectStore("media");


  let req = mediaobjectStore.openCursor();

  req.addEventListener("success", function () {
    cursor = req.result
    if (cursor) {
      numberOfMedia++;
      let mediaDiv = document.createElement("div");

      mediaDiv.classList.add("media-card");
      mediaDiv.innerHTML = `
      <div class="actual-media"></div>
      <div class="media-button">
          <button class="download">Download</button>
          <button data-mid = "${cursor.value.mId}" class="delete">Delete</button>
      </div>
      `
      let actualMediaDiv = mediaDiv.querySelector(".actual-media");

      let downloadBtn = mediaDiv.querySelector(".download");

      let deleteBtn = mediaDiv.querySelector(".delete");

      deleteBtn.addEventListener("click",function(e){
        let dataAttr = Number(e.currentTarget.getAttribute("data-mid"));
        deleteMedia(dataAttr);

        e.currentTarget.parentElement.parentElement.remove()

      })

      let data = cursor.value.mediaData



      let type = typeof data;
      console.log(type)

      if (type == "string") {
        let imageTag = document.createElement("img");

        imageTag.src = data

        downloadBtn.addEventListener("click",function(){
          downloadMedia(data,"image")
        })

        actualMediaDiv.append(imageTag);

      } else if (type == "object") {
        let videoTag = document.createElement("video")

        let url = URL.createObjectURL(data);

        videoTag.src = url

        videoTag.controls = true;

        videoTag.autoplay = true;

        downloadBtn.addEventListener("click",function(){
          downloadMedia(url,"video")
        })

        actualMediaDiv.append(videoTag)

      }
      galleryContainer.append(mediaDiv)
      // console.log(cursor.value)
      cursor.continue();
    } else {
      if(numberOfMedia == 0){
        galleryContainer.innerText = "No Images and Video captured"
      }
    }
  })

}

function downloadMedia(url, type) {
  if (type == "image") {
    let anchorTag = document.createElement("a");
    anchorTag.href = url;
    anchorTag.download = "image.png";
    anchorTag.click();
  } else {
    let anchorTag = document.createElement("a");
    anchorTag.href = url;
    anchorTag.download = "video.mp4";
    anchorTag.click();
  }
}

function deleteMedia(mId){
  let tx = database.transaction("media","readwrite");
  let mediaobjectStore = tx.objectStore("media");
  mediaobjectStore.delete(mId);
}