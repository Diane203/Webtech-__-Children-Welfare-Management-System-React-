import { Heart, Shield, BookOpen, Handshake } from 'lucide-react';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion', desc: 'Every decision is guided by genuine love and empathy for the children.', color: 'emerald' },
    { icon: Shield, title: 'Safety', desc: 'We provide a secure environment where children can heal and thrive.', color: 'blue' },
    { icon: BookOpen, title: 'Education', desc: 'Quality education is the foundation for a brighter, independent future.', color: 'purple' },
    { icon: Handshake, title: 'Integrity', desc: 'We are transparent and accountable to the children, donors, and community.', color: 'orange' },
  ];

  const services = [
    { icon: '🏠', title: 'Residential Care', desc: 'We provide a safe, family-like home for orphaned and vulnerable children, meeting all their daily needs.' },
    { icon: '🎓', title: 'Education Support', desc: 'Every child is enrolled in school. We provide uniforms, materials, tutoring, and monitor academic progress.' },
    { icon: '🏥', title: 'Healthcare & Disability Support', desc: 'Regular medical checkups, specialized treatment, physiotherapy, hearing aids, and vision care.' },
    { icon: '💼', title: 'Life Skills & Transition', desc: 'Preparing older children for independent living through vocational training and mentorship.' },
  ];

  const timeline = [
    { year: '2018', title: 'Foundation', desc: 'Hope Haven was founded in Kigali with a mission to care for orphaned children.', color: 'emerald' },
    { year: '2020', title: 'Disability Program', desc: 'Launched specialized support for children with disabilities, including healthcare and assistive devices.', color: 'blue' },
    { year: '2023', title: 'Digital Transformation', desc: 'Implemented our welfare management system to streamline care, health, and education tracking.', color: 'purple' },
    { year: '2026', title: 'Growing Impact', desc: 'Now caring for 24+ children with a dedicated team of 12 staff members and 8 active sponsors.', color: 'orange' },
  ];

  const faqs = [
    { q: "What is Hope Haven's mission?", a: "Hope Haven is dedicated to providing comprehensive welfare management for orphaned and vulnerable children, with specialized care for those with disabilities. We ensure every child has access to safety, education, healthcare, and the opportunity to reach their full potential." },
    { q: "How long has Hope Haven been operating?", a: "Hope Haven was founded in 2018 in Kigali, Rwanda. Since then, we have grown from caring for a handful of children to now supporting 24+ children with a dedicated team of 12 staff members and 8 active sponsors." },
    { q: "What makes Hope Haven different?", a: "We focus on holistic care — not just food and shelter, but also education, healthcare, emotional support, and life skills. Our specialized disability program provides physiotherapy, hearing aids, vision care, and other assistive devices that many centers cannot offer." },
    { q: "Can I visit the children?", a: "Yes! We welcome scheduled visits from supporters, sponsors, and volunteers. Please contact us at least one week in advance so we can arrange a visit that respects the children's routines and privacy." },
    { q: "Are donations tax-deductible?", a: "Yes, Hope Haven is a registered non-profit organization in Rwanda. All donations are eligible for tax deduction in accordance with Rwandan law." },
    { q: "How do I know my sponsorship is going to the right place?", a: "We provide quarterly impact reports to all sponsors showing how their funds are used. Sponsors can also visit the child they sponsor, receive regular updates and photos, and communicate with our staff through our secure system." },
  ];

  return (
    <div className="text-slate-300">
      {/* HERO */}
      <section className="max-w-4xl mx-auto py-20 px-4 animate-fade-in">
        <p className="text-emerald-500 text-xs font-bold tracking-widest mb-2">ABOUT HOPE HAVEN</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Caring for Rwanda's Children</h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Hope Haven is a comprehensive children welfare management system designed to help orphanages and child care centers manage the welfare, care, and development of orphaned and vulnerable children under 18, with special focus on those with disabilities.
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl card-hover">
            <p className="text-emerald-500 text-xs font-bold tracking-widest mb-3">OUR MISSION</p>
            <p className="text-slate-300 leading-relaxed">To provide a safe, loving, and nurturing environment for every child, ensuring their physical, emotional, and educational needs are met. We empower vulnerable children to become confident, capable, and compassionate members of society.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl card-hover">
            <p className="text-orange-500 text-xs font-bold tracking-widest mb-3">OUR VISION</p>
            <p className="text-slate-300 leading-relaxed">A Rwanda where every child has access to quality care, education, and the opportunity to reach their full potential — regardless of their background, ability, or circumstances.</p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center card-hover">
                <div className={`w-14 h-14 bg-${v.color}-500/20 text-${v.color}-400 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={26} />
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-white mb-8">What We Do</h2>
        <div className="space-y-4">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex gap-6 items-start card-hover">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">{s.icon}</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Our Journey</h2>
        <div className="space-y-6">
          {timeline.map((t, i) => (
            <div key={i} className="flex gap-6">
              <div className={`flex-shrink-0 w-20 h-20 bg-${t.color}-500/20 text-${t.color}-400 rounded-2xl flex items-center justify-center font-bold text-lg`}>
                {t.year}
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex-1 card-hover">
                <h3 className="text-white font-bold mb-1">{t.title}</h3>
                <p className="text-slate-400 text-sm">{t.desc}</p>
              </div>
            </div>
          ))}
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