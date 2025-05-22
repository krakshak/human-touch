import React, { useEffect, useState } from "react";
import { getCredits, getProjects, getHistory } from '../supabaseExamples';


export default function Dashboard() {
  const [credits, setCredits] = useState(null);
  const [projects, setProjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(localStorage.getItem('supabaseUser'));
        if (!user) {
          setError("Not logged in.");
          setLoading(false);
          return;
        }
        const user_id = user.id || user.user?.id;
        const [{ credits }, { data: projects }, { data: history }] = await Promise.all([
          getCredits(user_id),
          getProjects(user_id),
          getHistory(user_id)
        ]);
        setCredits(credits ?? 0);
        setProjects(projects || []);
        setHistory(history || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="container" style={{maxWidth:600, marginTop:56}}>Loading dashboard...</div>;
  if (error) return <div className="container" style={{maxWidth:600, marginTop:56, color:'#e53e3e'}}>{error}</div>;

  const totalCreditsUsed = history.length;
  const manualPrompts = history.filter(h => h.file_name === 'Manual Input');
  const fileUploads = history.filter(h => h.file_name !== 'Manual Input');

  return (
    <div className="container" style={{maxWidth:600, marginTop:56}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
        {/* Folder SVG icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#67b6fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h3.5a2 2 0 0 1 1.6.8l1.8 2.4A2 2 0 0 0 13.5 9H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
      </div>
      <h1 style={{textAlign:'center',marginBottom:18}}>Dashboard</h1>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:18}}>
        <div className="credits-tracker" style={{marginBottom:0}}>
          Credits left: {credits}
        </div>
        <button onClick={() => window.location.href='/pricing'} style={{background:'#1bb76e',color:'#fff',border:'none',borderRadius:8,padding:'8px 18px',fontWeight:700,fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(44,62,80,0.06)'}}>Buy More Credits</button>
      </div>
      <div style={{marginBottom:28, color:'#e53e3e', fontWeight:600}}>
        Total credits used: {totalCreditsUsed}
      </div>

      <h2 style={{marginBottom:12, color:'#377dff',fontWeight:700}}>Past Projects</h2>
      <table style={{width:'100%',background:'#f9fbfc',borderRadius:7,marginBottom:18}}>
        <thead>
          <tr style={{color:'#377dff',fontWeight:700}}>
            <th style={{textAlign:'left',padding:'8px'}}>Input</th>
            <th style={{textAlign:'left',padding:'8px'}}>Output</th>
            <th style={{textAlign:'left',padding:'8px'}}>Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr><td colSpan={3} style={{color:'#5a6a85',padding:'8px'}}>No projects found.</td></tr>
          ) : projects.map((proj, idx) => (
            <tr key={idx} style={{cursor:'pointer'}} onClick={() => setSelectedProject(proj)}>
              <td style={{padding:'8px',fontWeight:600}}>{proj.text_input?.slice(0,60)}{proj.text_input?.length > 60 ? '...' : ''}</td>
              <td style={{padding:'8px',color:'#38b2ac'}}>{proj.humanized_text_output?.slice(0,60)}{proj.humanized_text_output?.length > 60 ? '...' : ''}</td>
              <td style={{padding:'8px'}}>{proj.created_at?.slice(0,10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Project Popup Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }} onClick={() => setSelectedProject(null)}>
          <div style={{
            background:'#fff', borderRadius:12, padding:32, minWidth:340, maxWidth:600, boxShadow:'0 6px 32px rgba(44,62,80,0.18)', position:'relative', cursor:'default',
            maxHeight:'80vh', overflowY:'auto'
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)} style={{position:'absolute',top:10,right:16,fontSize:20,background:'none',border:'none',color:'#888',cursor:'pointer'}}>×</button>
            <h2 style={{color:'#377dff',marginBottom:18}}>Project Details</h2>
            <div style={{marginBottom:14}}>
              <strong>Input:</strong>
              <div style={{background:'#f9fbfc',borderRadius:6,padding:'10px 14px',marginTop:4,wordBreak:'break-word'}}>{selectedProject.text_input}</div>
            </div>
            <div style={{marginBottom:14}}>
              <strong>Humanized Output:</strong>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{background:'#eaf2fb',borderRadius:6,padding:'10px 14px',marginTop:4,wordBreak:'break-word',color:'#2563eb',flex:1}}>{selectedProject.humanized_text_output}</div>
                <button onClick={() => {
                  navigator.clipboard.writeText(selectedProject.humanized_text_output);
                  setCopyMsg('Copied!');
                  setTimeout(() => setCopyMsg(''), 1200);
                }} style={{marginTop:4,background:'#377dff',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}}>Copy</button>
                {copyMsg && <span style={{color:'#38b2ac',fontWeight:500,fontSize:13}}>{copyMsg}</span>}
              </div>
            </div>
            <div>
              <strong>Date:</strong> {selectedProject.created_at?.slice(0,16)}
            </div>
          </div>
        </div>
      )}


      <h2 style={{margin:'22px 0 12px 0', color:'#1bb76e',fontWeight:700}}>File Uploads</h2>
      <table style={{width:'100%',background:'#f9fbfc',borderRadius:7,marginBottom:18}}>
        <thead>
          <tr style={{color:'#1bb76e',fontWeight:700}}>
            <th style={{textAlign:'left',padding:'8px'}}>File Name</th>
            <th style={{textAlign:'left',padding:'8px'}}>Snippet</th>
            <th style={{textAlign:'left',padding:'8px'}}>Date</th>
          </tr>
        </thead>
        <tbody>
          {fileUploads.length === 0 ? (
            <tr><td colSpan={3} style={{color:'#5a6a85',padding:'8px'}}>No file uploads found.</td></tr>
          ) : fileUploads.map((h, idx) => (
            <tr key={idx}>
              <td style={{padding:'8px',fontWeight:600}}>{h.file_name}</td>
              <td style={{padding:'8px',fontSize:'0.98em',color:'#377dff'}}>{h.content?.slice(0,40)}{h.content?.length > 40 ? '...' : ''}</td>
              <td style={{padding:'8px'}}>{h.created_at?.slice(0,10)}</td>
              <td style={{padding:'8px'}}>
                <button style={{background:'#377dff',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px',fontWeight:600,cursor:'pointer'}} onClick={() => {
                  localStorage.setItem('importToHumanizerText', h.content);
                  window.location.href = '/';
                }}>Import to Humanizer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
