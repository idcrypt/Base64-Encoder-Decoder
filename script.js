// ==============================
// Base64 Encoder / Decoder — Full Version
// ==============================

// Elements
const dropZone = document.getElementById("dropZone");
const inputArea = document.getElementById("inputArea");
const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const outputArea = document.getElementById("outputArea");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const previewArea = document.getElementById("preview");

// Hidden file input for click upload
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.style.display = "none";

// ==============================
// Helpers
// ==============================
function showPreview(type, dataURL){
    previewArea.innerHTML = "";
    if(type.startsWith("image/")){
        const img = document.createElement("img");
        img.src = dataURL;
        img.style.maxWidth = "100%";
        previewArea.appendChild(img);
    } else if(type.startsWith("audio/")){
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = dataURL;
        previewArea.appendChild(audio);
    } else if(type.startsWith("video/")){
        const video = document.createElement("video");
        video.controls = true;
        video.src = dataURL;
        video.style.maxWidth = "100%";
        previewArea.appendChild(video);
    } else {
        previewArea.textContent = "File preview not available.";
    }
}

// ==============================
// Drag & Drop + Click Upload
// ==============================
dropZone.addEventListener("click", ()=> fileInput.click());

fileInput.addEventListener("change", e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=> {
        inputArea.value = reader.result;
        showPreview(file.type, reader.result);
    };
    reader.readAsDataURL(file);
});

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

// ==============================
// Encode / Decode
// ==============================
encodeBtn.addEventListener("click", ()=>{
    try{
        const text = inputArea.value;
        if(!text) throw new Error("Input is empty.");
        outputArea.value = btoa(text);
    } catch(err){
        alert("Encoding failed: " + err.message);
    }
});

decodeBtn.addEventListener("click", ()=>{
    try{
        const text = inputArea.value;
        if(!text) throw new Error("Input is empty.");
        outputArea.value = atob(text);
    } catch(err){
        alert("Decoding failed: " + err.message);
    }
});

// ==============================
// Copy result
// ==============================
copyBtn.addEventListener("click", ()=>{
    if(!outputArea.value){
        alert("Nothing to copy.");
        return;
    }
    outputArea.select();
    outputArea.setSelectionRange(0,99999);
    document.execCommand("copy");
    alert("Copied to clipboard!");
});

// ==============================
// Clear all
// ==============================
clearBtn.addEventListener("click", ()=>{
    inputArea.value = "";
    outputArea.value = "";
    previewArea.innerHTML = "";
});
