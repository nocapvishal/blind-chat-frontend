"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const router = useRouter();

  const [genderPref,setGenderPref] = useState("any");
  const [intent,setIntent] = useState("friends");

  function startChat(){
    localStorage.setItem("genderPref",genderPref);
    localStorage.setItem("intent",intent);
    router.push("/match");
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <h1 style={styles.title}>Who do you want to meet?</h1>
        <p style={styles.subtitle}>Choose your vibe </p>

        {/* Match Gender */}
        <label style={styles.label}>Match with</label>
        <select 
          value={genderPref}
          onChange={(e)=>setGenderPref(e.target.value)}
        >
          <option value="any">Anyone</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        {/* Intent */}
        <label style={styles.label}>Looking for</label>
        <select 
          value={intent}
          onChange={(e)=>setIntent(e.target.value)}
        >
          <option value="friends">Friends</option>
          <option value="dating">Dating</option>
          <option value="casual">Casual fun</option>
        </select>

        <button className="primary-btn" onClick={startChat}>
          Start Chat →
        </button>

      </div>
    </div>
  );
}

const styles = {
  wrapper:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"20px"
  },

  card:{
    width:"100%",
    maxWidth:380,
    background:"rgba(255,255,255,0.75)",
    backdropFilter:"blur(20px)",
    padding:"40px 32px",
    borderRadius:28,
    boxShadow:"0 20px 60px rgba(0,0,0,.15)",
    display:"flex",
    flexDirection:"column"
  },

  title:{
    fontSize:30,
    fontWeight:700,
    marginBottom:6,
    textAlign:"center"
  },

  subtitle:{
    opacity:.6,
    marginBottom:26,
    textAlign:"center",
    fontSize:14
  },

  label:{
    fontSize:14,
    marginTop:10,
    marginBottom:4,
    opacity:.7
  }
};
