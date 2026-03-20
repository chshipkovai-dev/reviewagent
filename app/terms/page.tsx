export default function TermsPage() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'60px 20px 80px' }}>
      <div style={{ maxWidth:680, margin:'0 auto' }}>

        {/* Header */}
        <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', marginBottom:40 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#059669,#10B981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⭐</div>
          <span style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>ReviewAgent</span>
        </a>

        <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:'-0.6px', color:'var(--text)', marginBottom:8 }}>Terms of Service</h1>
        <p style={{ fontSize:13, color:'var(--muted)', marginBottom:48 }}>Last updated: March 17, 2026</p>

        {[
          {
            title: '1. Acceptance of terms',
            body: `By creating an account or using ReviewAgent, you agree to these Terms of Service. If you do not agree, do not use the service.`,
          },
          {
            title: '2. What ReviewAgent does',
            body: `ReviewAgent is an AI-powered tool that helps business owners draft responses to customer reviews. The service generates suggested replies — you are responsible for reviewing, editing, and posting them. ReviewAgent does not post anything on your behalf.`,
          },
          {
            title: '3. Your responsibilities',
            body: `You are responsible for the content you submit (review text) and for any replies you post to your Google Business or other platforms. You agree not to use ReviewAgent to generate spam, fake reviews, or content that violates Google's policies or any applicable law. You must be 18 years or older to use this service.`,
          },
          {
            title: '4. Subscription and billing',
            body: `ReviewAgent offers a 7-day free trial followed by a $49/month subscription. Your card will be charged on the first day after the trial ends. Subscriptions renew automatically each month. You can cancel at any time from your account settings — cancellation takes effect at the end of the current billing period.`,
          },
          {
            title: '5. Refund policy',
            body: `We offer a 30-day money-back guarantee. If you are not satisfied within the first 30 days of your paid subscription, contact us and we will issue a full refund. After 30 days, charges are non-refundable.`,
          },
          {
            title: '6. Intellectual property',
            body: `The ReviewAgent software, branding, and website are owned by ReviewAgent. The AI-generated replies produced for you are yours to use as you see fit. We do not claim ownership of content generated on your behalf.`,
          },
          {
            title: '7. Limitation of liability',
            body: `ReviewAgent is provided "as is." We are not responsible for any outcomes resulting from replies you post, including changes to your business ratings or customer relationships. We do not guarantee that AI-generated replies will be suitable for every situation.`,
          },
          {
            title: '8. Service availability',
            body: `We aim for high uptime but do not guarantee 100% availability. We may modify or discontinue features with reasonable notice.`,
          },
          {
            title: '9. Termination',
            body: `We reserve the right to suspend or terminate accounts that violate these terms, engage in fraud, or abuse the service.`,
          },
          {
            title: '10. Governing law',
            body: `These terms are governed by the laws of the Czech Republic. Disputes will be resolved in the courts of the Czech Republic.`,
          },
          {
            title: '11. Contact',
            body: `For questions about these terms, email: legal@reviewagent.app`,
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
