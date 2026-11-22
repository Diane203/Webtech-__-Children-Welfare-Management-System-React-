import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert('✅ Message sent successfully!\n\nWe will get back to you within 24 hours.');
      e.target.reset();
      setSubmitted(false);
    }, 100);
  };

  const cards = [
    { icon: MapPin, title: 'Visit Us', lines: ['KG 7 Ave, Kigali', 'Rwanda'], color: 'emerald' },
    { icon: Phone, title: 'Call Us', lines: ['+250 780 565 497', 'Mon–Fri, 8AM–5PM'], color: 'blue' },
    { icon: Mail, title: 'Email Us', lines: ['info@hopehaven.org', 'support@hopehaven.org'], color: 'purple' },
  ];

  const faqs = [
    { q: 'How can I sponsor a child?', a: 'Visit our Sponsor page to choose a child and complete the process online. Monthly sponsorship starts at 25,000 FRw and covers education, healthcare, and daily needs.' },
    { q: 'Can I visit the children?', a: 'Yes! We welcome scheduled visits. Please contact us at least one week in advance to arrange a visit that respects the children\'s routines and privacy.' },
    { q: 'How are donations used?', a: 'All donations go directly to child welfare: 60% education, 25% healthcare, 10% daily needs, and 5% administrative costs.' },
    { q: 'Do you accept in-kind donations?', a: 'Absolutely! We accept clothing, school supplies, bedding, food, and medical supplies. Please contact us first to confirm current needs.' },
  ];

  return (
    <div className="text-slate-300">
      <section className="max-w-6xl mx-auto py-20 px-4 animate-fade-in">
        <p className="text-emerald-500 text-xs font-bold tracking-widest mb-2">GET IN TOUCH</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl">Have a question, want to sponsor a child, or volunteer? Reach out to our team.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl card-hover">
                <div className={`w-12 h-12 bg-${c.color}-500/20 text-${c.color}-400 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-white font-bold mb-2">{c.title}</h3>
                {c.lines.map((l, j) => <p key={j} className="text-slate-400 text-sm">{l}</p>)}
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-400">Full Name *</label>
                  <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-slate-400">Email *</label>
                  <input type="email" required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold mb-2 text-slate-400">Phone</label>
                <input type="tel" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold mb-2 text-slate-400">Subject *</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm">
                  <option value="">Select a subject...</option>
                  <option>Sponsor a Child</option>
                  <option>Volunteer Opportunities</option>
                  <option>Make a Donation</option>
                  <option>General Inquiry</option>
                  <option>Media & Press</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-bold mb-2 text-slate-400">Message *</label>
                <textarea required rows="5" placeholder="How can we help you?" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm" />
              </div>
              <button type="submit" disabled={submitted} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-bold transition">
                {submitted ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Business Hours</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between text-slate-300"><span>Monday – Friday</span><span className="text-emerald-400 font-bold">8:00 AM – 5:00 PM</span></li>
                <li className="flex justify-between text-slate-300"><span>Saturday</span><span className="text-emerald-400 font-bold">9:00 AM – 1:00 PM</span></li>
                <li className="flex justify-between text-slate-300"><span>Sunday</span><span className="text-red-400 font-bold">Closed</span></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 p-8 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-3">Want to Sponsor a Child?</h2>
              <p className="text-slate-300 text-sm mb-5">Your monthly sponsorship provides education, healthcare, and a loving home for a child in need.</p>
              <Link to="/sponsor" className="block text-center bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold transition">
                💝 Sponsor a Child Now
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Emergency Contact</h2>
              <p className="text-slate-400 text-sm mb-2">For urgent child welfare matters:</p>
              <p className="text-emerald-400 font-bold text-lg">+250 788 000 111</p>
              <p className="text-xs text-slate-500 mt-2">Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer group">
              <summary className="text-white font-bold flex justify-between items-center list-none">
                {f.q}
                <span className="text-emerald-400 group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}