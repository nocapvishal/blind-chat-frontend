export default function Disclaimer() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Disclaimer</h1>

        <p>
        Blind Chat in Campus is an anonymous social platform.
        Conversations are user-generated and not moderated in real time.
        </p>

        <p>
        We are not responsible for interactions, meetings,
        or relationships formed through this platform.
        </p>

        <p>
        Always prioritize your safety when meeting people offline.
        </p>
      </div>
    </div>
  );
}

const styles={
  wrapper:{padding:"80px 20px",display:"flex",justifyContent:"center"},
  card:{maxWidth:700,background:"#fff",padding:40,borderRadius:20}
}
