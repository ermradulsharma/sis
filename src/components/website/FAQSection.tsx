'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollAnimation } from './useScrollAnimation';

const faqs = [
  {
    question: 'What is SIS ERP and who is it for?',
    answer:
      'SIS ERP is a comprehensive enterprise resource planning platform designed for IT services companies, consulting firms, and software houses. It unifies CRM, HR, Finance, Project Management, and more into a single application with shared data and consistent UI.',
  },
  {
    question: 'Can I try SIS ERP before committing?',
    answer:
      'Absolutely! We offer a free trial on our Starter and Professional plans. You can explore all features with sample data and decide if SIS ERP is the right fit for your organization — no credit card required.',
  },
  {
    question: 'How does the role-based access control work?',
    answer:
      'SIS ERP uses a granular permission system following the format module:resource:action. You can create custom roles with specific permissions, and users inherit access through their assigned roles. Five default roles are provided: Super Admin, Admin, Manager, Employee, and Viewer.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. SIS ERP follows security best practices including encrypted passwords with bcrypt, HTTP-only session cookies, parameterized database queries, and role-based API guards. All data is stored in MongoDB Atlas with enterprise-grade encryption at rest and in transit.',
  },
  {
    question: 'Can SIS ERP integrate with our existing tools?',
    answer:
      'Our Professional and Enterprise plans include API access with 50+ REST endpoints. You can integrate with email providers, payment gateways, and third-party apps. Enterprise customers also get dedicated integration support.',
  },
  {
    question: 'Do you offer on-premise deployment?',
    answer:
      'Yes, our Enterprise plan includes the option for on-premise deployment. This is ideal for organizations with strict data residency requirements or those who prefer to manage their own infrastructure.',
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
  isVisible,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={`border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/10 ${
        isOpen ? 'bg-white/[0.03]' : 'bg-white/[0.01]'
      } ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: isVisible ? `${index * 75}ms` : '0ms' }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-medium text-white pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-slate-950" />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Everything you need to know about SIS&nbsp;ERP.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
