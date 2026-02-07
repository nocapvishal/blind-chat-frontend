export default function Guidelines() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Community Guidelines</h1>

        <p>Keep Blind Chat safe and fun ✨</p>

        <ul>
          <li>Be respectful</li>
          <li>No hate speech</li>
          <li>No sexual harassment</li>
          <li>No spamming</li>
          <li>No sharing private info</li>
          <li>Report bad behaviour</li>
        </ul>

        <h3>Violations = instant ban.</h3>
      </div>
    </div>
  );
}

const styles={
  wrapper:{padding:"80px 20px",display:"flex",justifyContent:"center"},
  card:{maxWidth:700,background:"#fff",padding:40,borderRadius:20}
}
