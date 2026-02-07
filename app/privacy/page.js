export default function Privacy() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Privacy Policy</h1>

        <p>We respect your privacy.</p>

        <h3>What we collect</h3>
        <ul>
          <li>College email (for verification)</li>
          <li>Preferences (gender & intent)</li>
          <li>Anonymous chat messages</li>
        </ul>

        <h3>What we DO NOT collect</h3>
        <ul>
          <li>Real names</li>
          <li>Location</li>
          <li>Passwords</li>
        </ul>

        <h3>Data Usage</h3>
        <p>Data is used only to operate the chat service.</p>

        <h3>Data Removal</h3>
        <p>You may request deletion anytime.</p>

      </div>
    </div>
  );
}

const styles={
  wrapper:{padding:"80px 20px",display:"flex",justifyContent:"center"},
  card:{maxWidth:700,background:"#fff",padding:40,borderRadius:20}
}
