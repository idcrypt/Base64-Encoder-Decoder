// ==============================
// Base64 Encoder / Decoder
// ==============================

const textInput = document.getElementById("textInput");
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");
const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadLink = document.getElementById("downloadLink");

// ==============================
// Helper functions
// ==============================
function showOutput(text) {
  output.value = text;
  downloadLink.classList.add("hidden");
}

function base64EncodeText(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64DecodeText(str) {
  return decodeURIComponent(escape(atob(str)));
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>resolve(reader.result);
    reader.onerror = ()=>reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// ==============================
// Encode / Decode
// ==============================
encodeBtn.addEventListener("click", async ()=>{
  try {
    if(fileInput.files.length>0){
      const file = fileInput.files[0];
      const buffer = await readFileAsArrayBuffer(file);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      showOutput(base64);
      downloadLink.href = "data:application/octet-stream;base64,"+base64;
      downloadLink.download = file.name+".b64";
      downloadLink.classList.remove("hidden");
    } else {
      const text = textInput.value;
      if(!text) return alert("Masukkan teks atau pilih file");
      showOutput(base64EncodeText(text));
    }
  } catch(e){
    alert("Encode error: "+e);
  }
});

decodeBtn.addEventListener("click", async ()=>{
  try {
    const base64 = textInput.value.trim();
    if(!base64) return alert("Masukkan Base64 untuk didecode");

    // coba decode sebagai file (binary)
    try {
      const binary = Uint8Array.from(atob(base64), c=>c.charCodeAt(0));
      const blob = new Blob([binary]);
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "decoded_file";
      downloadLink.classList.remove("hidden");
      showOutput(base64DecodeText(base64));
    } catch(e){
      // fallback: decode sebagai text
      showOutput(base64DecodeText(base64));
    }

  } catch(e){
    alert("Decode error: "+e);
  }
});

// Clear
clearBtn.addEventListener("click", ()=>{
  textInput.value = "";
  output.value = "";
  fileInput.value = "";
  downloadLink.classList.add("hidden");
});
