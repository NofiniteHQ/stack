(async () => {
  try {
    const res = await fetch('http://localhost:5174/@id/virtual:nuicss.css');
    const text = await res.text();
    console.log("File length:", text.length);
    console.log("Contains pl-10?", text.includes('pl-10'));
    console.log("Contains input?", text.includes('.input {'));
  } catch (e) {
    console.error(e);
  }
})();
