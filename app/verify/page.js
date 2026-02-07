"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const [email,setEmail] = useState("")
  const [error,setError] = useState("")
  const router = useRouter()

  const handleVerify = () => {
    if(!email.endsWith("@pondiuni.ac.in")){
      setError("Use your official university email 🎓")
      return
    }

    localStorage.setItem("campusEmail", email)
    router.push("/preferences")
  }

  return (
    <main style={styles.page}>
      <motion.div
        style={styles.card}
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.6 }}
      >
        <h1 style={styles.title}>Verify your campus email</h1>

        <p style={styles.subtitle}>
          Only University students allowed 💌
        </p>

        <input
          placeholder="you@pondiuni.ac.in"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <motion.button
          style={styles.button}
          whileHover={{ scale:1.05 }}
          whileTap={{ scale:.95 }}
          onClick={handleVerify}
        >
          Verify & Continue →
        </motion.button>

        <p style={styles.note}>
          We never show your email to anyone. Ever.
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
    background:"linear-gradient(120deg,#ffd6ec,#d7e7ff,#d2ffe8)",
    padding:"20px"
  },

  card:{
    background:"rgba(255,255,255,0.65)",
    backdropFilter:"blur(18px)",
    padding:"45px 35px",
    borderRadius:"30px",
    textAlign:"center",
    width:"100%",
    maxWidth:420,
    boxShadow:"0 25px 60px rgba(0,0,0,0.12)"
  },

  title:{
    fontSize:34,
    fontWeight:800,
    marginBottom:10
  },

  subtitle:{
    opacity:.7,
    marginBottom:30
  },

  input:{
    width:"100%",
    padding:"15px",
    borderRadius:12,
    border:"none",
    marginBottom:15,
    fontSize:16,
    outline:"none",
    boxShadow:"0 5px 15px rgba(0,0,0,.08)"
  },

  button:{
    width:"100%",
    padding:"15px",
    borderRadius:14,
    border:"none",
    fontSize:17,
    fontWeight:700,
    color:"white",
    cursor:"pointer",
    background:"linear-gradient(90deg,#7b8cff,#ff6fb7)",
    boxShadow:"0 10px 25px rgba(0,0,0,.18)"
  },

  error:{
    color:"#ff4d6d",
    fontSize:14,
    marginBottom:10
  },

  note:{
    marginTop:18,
    fontSize:13,
    opacity:.6
  }
}
