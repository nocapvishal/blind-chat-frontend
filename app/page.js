"use client"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main style={styles.page}>
      
      {/* floating emojis */}
      <div style={styles.emoji1}>💬</div>
      <div style={styles.emoji2}>✨</div>
      <div style={styles.emoji3}>👀</div>
      <div style={styles.emoji4}>🔥</div>
      <div style={styles.emoji5}>💞</div>

      <motion.div 
        style={styles.card}
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.8 }}
      >
        <h1 style={styles.title}>
          Meet someone <br/> No Pressure
        </h1>

        <p style={styles.subtitle}>
          Anonymous campus chat. No profiles. Just vibes ✨
        </p>

        {/* IMPORTANT: now goes to email verification */}
        <a href="/verify">
          <motion.button
            style={styles.button}
            whileHover={{ scale:1.06 }}
            whileTap={{ scale:.95 }}
          >
            Enter Campus →
          </motion.button>
        </a>

        {/* LEGAL FOOTER */}
        <p style={styles.legal}>
          By continuing you agree to our{" "}
          <a href="/terms" style={styles.link}>Terms</a>,{" "}
          <a href="/privacy" style={styles.link}>Privacy</a> &{" "}
          <a href="/community-guidelines" style={styles.link}>Guidelines</a>
        </p>

      </motion.div>
    </main>
  )
}

const styles = {

  page:{
    minHeight:"100vh",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    background:
      "linear-gradient(120deg,#ffd6ec,#d7e7ff,#d2ffe8)",
    position:"relative",
    overflow:"hidden",
    padding:"20px"
  },

  card:{
    background:"rgba(255,255,255,0.65)",
    backdropFilter:"blur(18px)",
    padding:"50px 35px",
    borderRadius:"30px",
    textAlign:"center",
    maxWidth:520,
    width:"100%",
    boxShadow:"0 25px 60px rgba(0,0,0,0.12)"
  },

  title:{
    fontSize:"clamp(32px,6vw,56px)",
    fontWeight:800,
    lineHeight:1.1,
    marginBottom:18,
    letterSpacing:"-1px"
  },

  subtitle:{
    fontSize:18,
    opacity:.75,
    marginBottom:35
  },

  button:{
    background:"linear-gradient(90deg,#7b8cff,#ff6fb7)",
    border:"none",
    padding:"16px 40px",
    fontSize:18,
    borderRadius:14,
    color:"white",
    fontWeight:700,
    cursor:"pointer",
    boxShadow:"0 10px 25px rgba(0,0,0,.18)"
  },

  legal:{
    marginTop:28,
    fontSize:13,
    opacity:.6
  },

  link:{
    textDecoration:"underline"
  },

  emoji1:{position:"absolute",top:80,left:80,fontSize:30,opacity:.5},
  emoji2:{position:"absolute",top:120,right:100,fontSize:26,opacity:.6},
  emoji3:{position:"absolute",bottom:120,left:120,fontSize:28,opacity:.6},
  emoji4:{position:"absolute",bottom:80,right:90,fontSize:28,opacity:.6},
  emoji5:{position:"absolute",top:"50%",left:40,fontSize:28,opacity:.5},
}
