export default function Terms() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1>Terms of Service</h1>

        <p>
        By using Blind Chat in Campus you agree to use the platform responsibly.
        This is an anonymous chat platform intended for college students.
        </p>

        <h3>Eligibility</h3>
        <p>You must be 18 years or older to use this platform.</p>

        <h3>User Responsibility</h3>
        <ul>
          <li>No harassment, bullying, hate speech</li>
          <li>No sexual content involving minors</li>
          <li>No threats or illegal activity</li>
          <li>No sharing personal data without consent</li>
        </ul>

        <h3>No Liability</h3>
        <p>
        We are not responsible for user generated content or conversations.
        You use this platform at your own risk.
        </p>

        <h3>Account Termination</h3>
        <p>We may ban users at any time for safety reasons.</p>

      </div>
    </div>
  );
}

const styles={
  wrapper:{padding:"80px 20px",display:"flex",justifyContent:"center"},
  card:{maxWidth:700,background:"#fff",padding:40,borderRadius:20}
}
