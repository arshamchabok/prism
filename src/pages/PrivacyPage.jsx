import CardNav from '../components/CardNav.jsx'
import Footer from '../components/Footer.jsx'

export default function PrivacyPage() {
  return <div id="app"><CardNav /><main id="main-content" className="about-section">
    <h1 className="about-headline">Privacy at Prism</h1>
    <div className="about-body">
      <p>Prism generates fictional customer profiles from the context you provide. You do not need an account.</p>
      <h2>What gets sent</h2>
      <p>Clicking Generate sends your description, selected fitness goal, and any attached image or optional product URL to Prism’s Cloudflare Worker, which forwards the request to Anthropic’s API. Only submit information you are comfortable sharing with these services.</p>
      <p>Images are processed in your browser before submission: Prism resizes them and re-encodes the pixels to remove embedded file metadata such as GPS coordinates. Visible details in the image remain. File names are not sent with the generation request. URL query strings, fragments, and login credentials are excluded; the URL is context for the model and its page is not fetched.</p>
      <h2>Storage and retention</h2>
      <p>Prism’s application code does not save your inputs or results in a database, cookies, or browser storage, and does not log their contents. They remain in page memory until you reset, leave the tool, or reload. PDF exports are created on your device and remain wherever you save them.</p>
      <p>GitHub Pages hosts the site, Cloudflare handles API requests, and Anthropic processes generation content. These providers may process network information such as IP addresses and retain service data under their own policies. Prism cannot promise zero retention by these providers. Cloudflare also uses your IP address for temporary request limiting.</p>
      <h2>External services</h2>
      <p>Fonts and images are served with the site. Prism does not include advertising or analytics trackers. You can review <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">GitHub’s privacy statement</a>, <a href="https://www.cloudflare.com/privacypolicy/" rel="noreferrer">Cloudflare’s privacy policy</a>, and <a href="https://www.anthropic.com/legal/privacy" rel="noreferrer">Anthropic’s privacy policy</a> for provider-specific details.</p>
      <h2>Use non-sensitive examples</h2>
      <p>Describe a product or audience in general terms. Leave out customer records, health records, access tokens, private URLs, and confidential business material. Generated names, quotes, and behaviors are fictional hypotheses, not information about identified people.</p>
    </div>
  </main><Footer /></div>
}
