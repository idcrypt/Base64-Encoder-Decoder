const dropZone = document.getElementById("dropZone");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const previewContainer = document.getElementById("previewContainer");
const previewImg = document.getElementById("previewImg");
const previewPDF = document.getElementById("previewPDF");
const previewAudio = document.getElementById("previewAudio");
const previewVideo = document.getElementById("previewVideo");

// ======================
// Drag & Drop
// ======================
dropZone.addEventListener("dragover", e=>{
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", e=>{
  e.preventDefault();
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", e=>{
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    inputArea.value = reader.result;
    showPreview(file.type, reader.result);
  };
  reader.readAsDataURL(file);
});

// ======================
// Encode
// ======================
encodeBtn.addEventListener("click", ()=>{
  try{
    const input = inputArea.value;
    if(!input) return alert("Input area empty!");
    const encoded = btoa(unescape(encodeURIComponent(input)));
    outputArea.value = encoded;
    hideAllPreview();
  } catch(e){
    alert("Encoding failed");
    console.error(e);
  }
});

// ======================
// Decode
// ======================
decodeBtn.addEventListener("click", ()=>{
  try{
    const input = inputArea.value;
    if(!input) return alert("Input area empty!");
    const decoded = decodeURIComponent(escape(atob(input)));
    outputArea.value = decoded;

    // Try preview
    if(decoded.startsWith("data:image/")){
      showPreview("image", decoded);
    } else if(decoded.startsWith("%PDF-") || decoded.startsWith("JVBER")) {
      showPreview("application/pdf", decoded);
    } else {
      hideAllPreview();
    }
  } catch(e){
    alert("Decoding failed. Ensure valid Base64.");
    console.error(e);
    hideAllPreview();
  }
});

// ======================
// Copy
// ======================
copyBtn.addEventListener("click", ()=>{
  if(!outputArea.value) return;
  outputArea.select();
  document.execCommand("copy");
  alert("Result copied to clipboard!");
});

// ======================
// Clear
// ======================
clearBtn.addEventListener("click", ()=>{
  inputArea.value = "";
  outputArea.value = "";
  hideAllPreview();
});

// ======================
// Preview helper
// ======================
function showPreview(type, src){
  hideAllPreview();
  previewContainer.classList.remove("hidden");
  if(type.startsWith("image/")){
    previewImg.src = src;
    previewImg.classList.remove("hidden");
  } else if(type==="application/pdf"){
    previewPDF.src = src;
    previewPDF.classList.remove("hidden");
  } else if(type.startsWith("audio/")){
    previewAudio.src = src;
    previewAudio.classList.remove("hidden");
  } else if(type.startsWith("video/")){
    previewVideo.src = src;
    previewVideo.classList.remove("hidden");
  } else {
    hideAllPreview();
  }
}

function hideAllPreview(){
  previewContainer.classList.add("hidden");
  previewImg.classList.add("hidden");
  previewPDF.classList.add("hidden");
  previewAudio.classList.add("hidden");
  previewVideo.classList.add("hidden");
}
