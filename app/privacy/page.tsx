export default function PrivacyPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'60px 20px 80px' }}>
      <div style={{ maxWidth:680, margin:'0 auto' }}>

        {/* Header */}
        <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:40 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#059669,#10B981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⭐</div>
          <span style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>ReviewAgent</span>
        </a>

        <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.6px', color:'var(--text)', marginBottom:8 }}>Privacy Policy</h1>
        <p style={{ fontSize:13, color:'var(--muted)', marginBottom:48 }}>Last updated: March 17, 2026</p>

        {[
          {
            title: '1. What we collect',
            body: `When you create an account, we collect your email address and a hashed password. When you use the app, you paste review text into our interface — this text is sent to the Claude AI API (Anthropic) to generate a reply and is not stored on our servers after processing. We do not collect your customers' personal data.`,
          },
          {
            title: '2. How we use your data',
            body: `Your email is used to log you in and send service-related emails (e.g. password reset). Review text is used only to generate the AI reply in real time. We do not sell, rent, or share your data with third parties for marketing.`,
          },
          {
            title: '3. Third-party services',
            body: `We use Supabase for authentication and data storage, Stripe for payment processing, and Anthropic (Claude API) to generate review replies. Each of these services has its own privacy policy. Stripe handles your payment card data — we never see or store card numbers.`,
          },
          {
            title: '4. Data retention',
            body: `Your account data (email, business settings) is retained for as long as your account is active. If you delete your account, your data is removed within 30 days. Review text submitted for processing is not stored after the reply is generated.`,
          },
          {
            title: '5. Cookies',
            body: `We use a session cookie to keep you logged in. We do not use advertising cookies or tracking pixels.`,
          },
          {
            title: '6. Your rights',
            body: `You can request to export or delete your account data at any time by emailing us. If you are in the EU or UK, you have rights under GDPR including access, correction, and deletion of your data.`,
          },
          {
            title: '7. Security',
            body: `Passwords are hashed and never stored in plain text. All data is transmitted over HTTPS. We use Supabase's built-in security features including row-level security.`,
          },
          {
            title: '8. Contact',
            body: `For any privacy questions, email: privacy@reviewagent.app`,
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:17, fontWeight:700, color:'var(--text)', marginBottom:10 }}>{title}</h2>
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.7 }}>{body}</p>
          </div>
        ))}

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:24, marginTop:24 }}>
          <a href="/" style={{ fontSize:13, color:'var(--muted)', textDecoration:'none' }}>← Back to ReviewAgent</a>
        </div>
      </div>
    </div>
  )
}
