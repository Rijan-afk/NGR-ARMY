// tts.js
(function() {
  // Create TTS modal if not present
  if (!document.getElementById('ttsModal')) {
    const modal = document.createElement('div');
    modal.id = 'ttsModal';
    modal.style = 'display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:2000;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div id="ttsModalBox" style="background:linear-gradient(135deg,#23233a 0%,#4f8cff 100%);padding:32px 24px 24px 24px;border-radius:18px;min-width:320px;max-width:90vw;box-shadow:0 8px 32px #0004;position:relative;">
        <h2>Text-to-Speech</h2>
        <label>Text:<br/>
          <textarea id="ttsText" rows="4" style="width:100%"></textarea>
        </label><br/><br/>
        <label>Voice:
          <select id="ttsVoice"></select>
        </label><br/><br/>
        <button id="ttsGenerate">Speak</button>
        <button id="ttsClose" style="margin-left:8px;">Close</button>
        <div id="ttsStatus" style="margin-top:10px;color:#d00;"></div>
        <div id="ttsPlaying" style="display:none;margin-top:10px;color:#43cea2;font-weight:bold;">🔊 Playing...</div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  // Populate only Google Hindi voices
  function populateTtsVoices() {
    const ttsVoice = document.getElementById('ttsVoice');
    if (!ttsVoice) return;
    ttsVoice.innerHTML = '';
    let voices = window.speechSynthesis.getVoices();
    voices = voices.filter(v => v.name.toLowerCase().includes('google hindi'));
    voices.forEach((voice, i) => {
      const opt = document.createElement('option');
      let gender = 'Unknown';
      if (voice.name.toLowerCase().includes('female')) gender = 'Female';
      if (voice.name.toLowerCase().includes('male')) gender = 'Male';
      opt.value = voice.name;
      opt.textContent = `${voice.name} (${gender})`;
      ttsVoice.appendChild(opt);
    });
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = populateTtsVoices;
    populateTtsVoices();
  }
  // TTS logic
  document.getElementById('ttsGenerate').onclick = function() {
    document.getElementById('ttsStatus').textContent = 'Generating...';
    const text = document.getElementById('ttsText').value;
    const voiceName = document.getElementById('ttsVoice').value;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      if (voice) utter.voice = voice;
      utter.rate = 1.05;
      utter.pitch = 1.1;
      utter.lang = voice ? voice.lang : 'hi-IN';
      document.getElementById('ttsPlaying').style.display = 'block';
      utter.onend = utter.onerror = function() {
        document.getElementById('ttsPlaying').style.display = 'none';
        document.getElementById('ttsStatus').textContent = '';
      };
      window.speechSynthesis.speak(utter);
      document.getElementById('ttsStatus').textContent = '';
    } else {
      document.getElementById('ttsStatus').textContent = 'TTS not supported or no text.';
    }
  };
  document.getElementById('ttsClose').onclick = function() {
    document.getElementById('ttsModal').style.display = 'none';
  };
  window.showTTSModal = function() {
    document.getElementById('ttsModal').style.display = 'flex';
    populateTtsVoices();
  };
})(); 