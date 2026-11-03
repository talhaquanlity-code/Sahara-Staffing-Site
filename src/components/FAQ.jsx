import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faqData as fallbackFaqData } from '../data/faqData';
import { useCMS } from '../context/CMSContext';
import ScrollRevealText from './common/ScrollRevealText';

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { content } = useCMS();
  const faqList = content?.faqs && content.faqs.length > 0 ? content.faqs : fallbackFaqData;
  const [openIndex, setOpenIndex] = useState(0); // 1st item open by default
  const faqRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-row',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.faq-list-container',
            start: 'top 85%',
          },
        }
      );
    }, faqRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section ref={faqRef} className="bg-obsidian text-crispWhite py-14 sm:py-32">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Title & Subtitle */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.12] sm:leading-[1.08] text-saharaGold">
              Frequently
              <br className="hidden sm:inline" />{' '}
              Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slateGray max-w-sm leading-relaxed pt-1 sm:pt-2">
              Clear answers to the most common questions about our executive search process, vetting standards, and placement guarantees.
            </p>
          </div>

          {/* Right Column: Interactive Accordion List */}
          <div className="faq-list-container lg:col-span-7 divide-y divide-slateCard border-b border-slateCard">
            {faqList.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.id || index} className="faq-row py-4 sm:py-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-3.5 sm:gap-4 group focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base sm:text-xl font-medium transition-colors duration-200 leading-snug ${
                        isOpen
                          ? 'text-saharaGold'
                          : 'text-crispWhite group-hover:text-saharaGold'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`text-xl sm:text-2xl font-light shrink-0 transition-transform duration-300 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full ${
                        isOpen
                          ? 'text-saharaGold rotate-180 bg-slateCard/60'
                          : 'text-slateGray group-hover:text-saharaGold group-hover:bg-slateCard/40'
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-slateGray leading-relaxed max-w-2xl">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
