import React, { useState } from "react";
import "../App.css";
import { addHistory, decrementCredits, getCredits, addProject, getHistory } from '../supabaseExamples';
import { UNDETECTABLE_API_KEY, UNDETECTABLE_USER_ID } from '../secrets';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [readability, setReadability] = useState("High School");
  const [purpose, setPurpose] = useState("General Writing");
  const [strength, setStrength] = useState("Balanced");
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState("api"); // 'api' or 'demo'
  // Track credits in state
  const [creditsLeft, setCreditsLeft] = useState(null);
  const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);

  // Fetch credits on mount if logged in
  React.useEffect(() => {
    // Check for imported text from Dashboard
    const imported = localStorage.getItem('importToHumanizerText');
    if (imported) {
      setInput(imported);
      localStorage.removeItem('importToHumanizerText');
    }
    async function fetchCreditsAndHistory() {
      const user = JSON.parse(localStorage.getItem('supabaseUser'));
      if (user) {
        const user_id = user.id || user.user?.id;
        const { credits } = await getCredits(user_id);
        setCreditsLeft(credits);
        // Fetch history for total credits used
        const { data: history } = await getHistory(user_id);
        setTotalCreditsUsed(history ? history.length : 0);
      }
    }
    fetchCreditsAndHistory();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleHumanize = async () => {
    setErrorMsg("");
    if (!input || input.length < 50) {
      showToast("Input must be at least 50 characters.");
      setErrorMsg("Input must be at least 50 characters.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      let humanizedText = "";
      if (mode === "demo") {
        // Demo mode: generate a mock humanized text
        humanizedText = "[Demo] " + input.replace(/AI/gi, "Human").replace(/\b(generated|output)\b/gi, "crafted").replace(/\s+/g, " ").slice(0, 800) + (input.length > 800 ? '...' : '');
        setTimeout(async () => {
          setOutput(humanizedText);
          const user = JSON.parse(localStorage.getItem('supabaseUser'));
          if (!user) {
            showToast("Login to save project.");
            setLoading(false);
            return;
          }
          const user_id = user.id || user.user?.id;
          // Decrement credits
          const decRes = await decrementCredits(user_id);
          if (decRes.error) {
            setErrorMsg("Error: " + (decRes.error.message || decRes.error));
            showToast("Error: " + (decRes.error.message || decRes.error));
            setLoading(false);
            return;
          }
          if (decRes.credits_left !== undefined) setCreditsLeft(decRes.credits_left);
          await addProject(user_id, input, humanizedText);
          setTotalCreditsUsed(prev => prev + 1);
          showToast("Demo humanized text saved! 1 credit used.");
          setErrorMsg("");
          setLoading(false);
        }, 800);
        return;
      }
      // API mode
      // Step 1: Submit to Undetectable API
      const submitRes = await fetch('https://humanize.undetectable.ai/submit', {
        method: 'POST',
        headers: {
          'apikey': UNDETECTABLE_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: input,
          readability,
          purpose,
          strength,
          model: 'v2'
        })
      });
      if (!submitRes.ok) throw new Error('API error: ' + submitRes.status);
      const submitData = await submitRes.json();
      // Always use the returned id from the submit API response
      const documentId = submitData.id;
      if (!documentId) throw new Error(submitData.error || 'Failed to submit for humanization');
      // Step 2: Poll for result
      let tries = 0;
      while (tries < 12 && !humanizedText) { // up to ~24s
        await new Promise(r=>setTimeout(r, 2000));
        const docRes = await fetch('https://humanize.undetectable.ai/document', {
          method: 'POST',
          headers: {
            'apikey': UNDETECTABLE_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: documentId })
        });
        if (!docRes.ok) {
          setErrorMsg('Network error while polling for result.');
          break;
        }
        const docData = await docRes.json();
        if (docData.status === 'done' && docData.humanized) {
          humanizedText = docData.humanized;
          break;
        }
        tries++;
      }
      if (!humanizedText) throw new Error('Timed out waiting for humanized text');
      setOutput(humanizedText);
      // Save to Supabase
      const user = JSON.parse(localStorage.getItem('supabaseUser'));
      if (!user) {
        showToast("Login to save project.");
        setLoading(false);
        return;
      }
      const user_id = user.id || user.user?.id;
      await addProject(user_id, input, humanizedText);
      setTotalCreditsUsed(prev => prev + 1);
      showToast("Humanized text saved!");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Error: " + (err.message || err));
      showToast("Error: " + (err.message || err));
    }
    setLoading(false);
  };


  return (
    <div className="container home-page">
      <h1 className="hero-title" style={{textAlign:'center',fontWeight:800,fontSize:'2.3rem',color:'#212b36',marginBottom:8,letterSpacing:'.01em'}}>The Human Touch</h1>
      <p className="hero-subtitle" style={{maxWidth:600,margin:'0 auto',fontSize:'1.13rem',color:'#2d3a4b',fontWeight:500}}>
        Instantly transform AI-generated text into natural, human-sounding writing.
      </p>
      <div className="humanizer-toolbar" style={{display:'flex',justifyContent:'center',alignItems:'center',marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:32,marginBottom:18}}>
          <div className="credits-tracker" style={{marginBottom:0}}>
            Credits left: {creditsLeft}
          </div>
          <div className="credits-tracker" style={{marginBottom:0, background:'#f1f6fc', color:'#38b2ac'}}>
            Total credits used: {totalCreditsUsed}
          </div>
          <button onClick={() => window.location.href='/pricing'} style={{background:'#1bb76e',color:'#fff',border:'none',borderRadius:8,padding:'8px 18px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(44,62,80,0.06)'}}>Buy More Credits</button>
        </div>
      </div>
      {/* Mode selection */}
      <div style={{display:'flex',gap:24,alignItems:'center',marginBottom:10}}>
        <label style={{fontWeight:600}}>Mode:</label>
        <label style={{display:'flex',alignItems:'center',gap:4}}>
          <input type="radio" name="mode" value="api" checked={mode==="api"} onChange={()=>setMode("api")} /> Use API
        </label>
        <label style={{display:'flex',alignItems:'center',gap:4}}>
          <input type="radio" name="mode" value="demo" checked={mode==="demo"} onChange={()=>setMode("demo")} /> Demo
        </label>
      </div>
      <div style={{display:'flex',gap:16,marginBottom:16,flexWrap:'wrap'}}>
        <div>
          <label style={{fontWeight:600}}>Readability</label><br/>
          <select value={readability} onChange={e=>setReadability(e.target.value)} style={{padding:6,borderRadius:6,minWidth:140}}>
            <option>High School</option>
            <option>University</option>
            <option>Doctorate</option>
            <option>Journalist</option>
            <option>Marketing</option>
          </select>
        </div>
        <div>
          <label style={{fontWeight:600}}>Purpose</label><br/>
          <select value={purpose} onChange={e=>setPurpose(e.target.value)} style={{padding:6,borderRadius:6,minWidth:180}}>
            <option>General Writing</option>
            <option>Essay</option>
            <option>Article</option>
            <option>Marketing Material</option>
            <option>Story</option>
            <option>Cover Letter</option>
            <option>Report</option>
            <option>Business Material</option>
            <option>Legal Material</option>
          </select>
        </div>
        <div>
          <label style={{fontWeight:600}}>Strength</label><br/>
          <select value={strength} onChange={e=>setStrength(e.target.value)} style={{padding:6,borderRadius:6,minWidth:120}}>
            <option>Quality</option>
            <option>Balanced</option>
            <option>More Human</option>
          </select>
        </div>
      </div>
      {errorMsg && (
        <div style={{background:'#ffeaea',color:'#e53e3e',padding:'10px 16px',borderRadius:8,marginBottom:12,fontWeight:600}}>{errorMsg}</div>
      )}
      <div className="humanizer-box" style={{marginTop:0}}>
        <textarea
          className="input-area"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste your AI-generated text here (min 50 chars)"
          style={{minHeight:120,resize:'vertical',overflowY:'auto',maxHeight:220}}
        />
        <label htmlFor="file-upload" style={{display:'flex',alignItems:'center',gap:8,margin:'10px 0',cursor:'pointer'}}>
          <svg width="22" height="22" fill="none" stroke="#1bb76e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>
          <span style={{color:'#1bb76e',fontWeight:600}}>Upload File</span>
          <input id="file-upload" type="file" accept=".txt,.md,.docx,.pdf" style={{display:'none'}} onChange={async e => {
            const file = e.target.files[0];
            if (!file) return;
            let fileContent = "";
            if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
              const reader = new FileReader();
              reader.onload = async ev => {
                fileContent = ev.target.result;
                setInput(fileContent);
                // Add to history
                const user = JSON.parse(localStorage.getItem('supabaseUser'));
                if (!user) {
                  showToast("Login to save history.");
                  return;
                }
                const user_id = user.id || user.user?.id;
                const { error } = await addHistory(user_id, file.name, fileContent);
                if (!error) showToast("File added to history!");
                else showToast("Failed to save file history.");
              };
              reader.readAsText(file);
            } else if (file.name.endsWith('.docx')) {
              setInput('Loading .docx file...');
              try {
                const mammoth = await import('mammoth');
                const reader = new FileReader();
                reader.onload = async ev => {
                  const arrayBuffer = ev.target.result;
                  const result = await mammoth.convertToHtml({ arrayBuffer });
                  fileContent = result.value.replace(/<[^>]+>/g, ' ');
                  setInput(fileContent);
                  const user = JSON.parse(localStorage.getItem('supabaseUser'));
                  if (!user) {
                    showToast("Login to save history.");
                    return;
                  }
                  const user_id = user.id || user.user?.id;
                  const { error } = await addHistory(user_id, file.name, fileContent);
                  if (!error) showToast("File added to history!");
                  else showToast("Failed to save file history.");
                };
                reader.readAsArrayBuffer(file);
              } catch (err) {
                setInput('Please install the mammoth package to support .docx files.');
              }
            } else if (file.name.endsWith('.pdf')) {
              setInput('Loading PDF file...');
              try {
                const pdfjsLib = await import('pdfjs-dist/build/pdf');
                pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
                const reader = new FileReader();
                reader.onload = async ev => {
                  const typedarray = new Uint8Array(ev.target.result);
                  const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                  let text = '';
                  for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(item => item.str).join(' ') + '\n';
                  }
                  fileContent = text;
                  setInput(fileContent);
                  const user = JSON.parse(localStorage.getItem('supabaseUser'));
                  if (!user) {
                    showToast("Login to save history.");
                    return;
                  }
                  const user_id = user.id || user.user?.id;
                  const { error } = await addHistory(user_id, file.name, fileContent);
                  if (!error) showToast("File added to history!");
                  else showToast("Failed to save file history.");
                };
                reader.readAsArrayBuffer(file);
              } catch (err) {
                setInput('Please install the pdfjs-dist package to support PDF files.');
              }
            } else {
              alert('File type not supported. Please upload a .txt, .md, .docx, or .pdf file.');
            }
          }} />
        </label>
        <button className="humanize-btn" onClick={handleHumanize} disabled={loading || !input || creditsLeft === 0 || creditsLeft === null}>
          {loading ? "Humanizing..." : "Humanize"}
        </button>
        <textarea
          className="output-area"
          style={{marginTop:18,minHeight:120,resize:'vertical',overflowY:'auto',maxHeight:220}}
          value={output}
          readOnly
          placeholder="Humanized text will appear here..."
        />
      </div>
      {loading && (
        <div style={{
          position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.55)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:28,borderRadius:12,boxShadow:'0 2px 16px rgba(44,62,80,0.16)',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <svg width="52" height="52" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="#377dff" strokeWidth="6" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite"/></circle></svg>
            <div style={{marginTop:16,fontWeight:600,color:'#377dff',fontSize:18}}>Humanizing...</div>
          </div>
        </div>
      )}
      {/* Steps Section */}
      <div style={{marginTop:50, marginBottom:30}}>
        <h2 style={{textAlign:'center',fontWeight:800, fontSize:'2rem',color:'#222b45',marginBottom:10}}>How to use The human touch’s AI Humanizer</h2>
        <p style={{textAlign:'center',color:'#5a6a85',fontSize:'1.13rem',marginBottom:36}}>
          Humanize AI text flawlessly with our AI Humanizer tool in just three simple steps:
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:36,flexWrap:'wrap'}}>
          {[{
            num:1,
            title:'Paste or type your text',
            desc:'Start by either typing or pasting your text into the input box on the left or upload the document that you would like to humanize.'
          },{
            num:2,
            title:'Click "Humanize"',
            desc:'Click the "Humanize" button located near the bottom of the box, and our AI will instantly humanize your text.'
          },{
            num:3,
            title:'Adjust your text',
            desc:'Quickly customize the humanized text to match your style. When the text looks just right, easily copy it with the "Copy All" button in the bottom right corner.'
          }].map(step => (
            <div key={step.num} style={{background:'#eaf2fb',borderRadius:14,padding:'28px 22px',maxWidth:260,minWidth:200,boxShadow:'0 2px 10px rgba(44,62,80,0.07)',textAlign:'center'}}>
              <div style={{background:'#17904b',color:'#fff',borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1.35rem',margin:'0 auto 14px auto'}}>{step.num}</div>
              <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:8}}>{step.title}</div>
              <div style={{color:'#2d3a4b',fontSize:'1rem',fontWeight:400}}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {toast && <div className="auth-message" style={{position:'fixed',top:16,right:16,zIndex:9999}}>{toast}</div>}
    </div>
  );
}
