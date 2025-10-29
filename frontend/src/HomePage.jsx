import _React from 'react';
import timelineVideo from './assets/Timeline 1.mov';

const HomePage = () => {
  return (
    <div className="w-full">
      
      <section 
        className="relative bg-gradient-to-br from-[#023047] via-[#012a40] to-[#001a2b] text-white min-h-[90vh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-0" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-0" style={{ animation: 'pulse 3s ease-in-out infinite 1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl opacity-0" style={{ animation: 'pulse 3s ease-in-out infinite 2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold">AI-Powered Socratic Learning</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                Master Sorting
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Through Discovery
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                Join <span className="font-bold text-cyan-300">Sorty the Monster</span> on an epic journey to restore order to chaotic unsorted arrays!
              </p>
            </div>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Learn sorting algorithms through adaptive AI questioning, interactive visualizations, and hands-on practice. No boring lectures — just pure discovery.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500/90 to-pink-500/90 rounded-full shadow-lg backdrop-blur-sm">
                <span className="text-white text-base">⚡</span>
                <span className="text-xs text-white font-semibold">Earn XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 rounded-full shadow-lg backdrop-blur-sm">
                <span className="text-white text-base">🏆</span>
                <span className="text-xs text-white font-semibold">Unlock Milestones</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 rounded-full shadow-lg backdrop-blur-sm">
                <span className="text-white text-base">🎮</span>
                <span className="text-xs text-white font-semibold">Interactive Quests</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="#quests" 
                className="group relative px-6 py-3 bg-white text-[#023047] font-bold text-sm rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 text-center"
              >
                <span className="relative z-10">START YOUR QUEST</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a 
                href="#about" 
                className="px-6 py-3 rounded-xl border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-300 text-center backdrop-blur-sm"
              >
                HOW IT WORKS
              </a>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse" />
              
              <img 
                src="/loading_image.png" 
                alt="Sorty the Monster" 
                className="relative w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl animate-bounce"
                style={{ animationDuration: '3s' }}
              />

              <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-xl animate-bounce text-sm font-bold text-white" style={{ animationDelay: '0.5s', animationDuration: '2s' }}>
                +50 XP
              </div>
              <div className="absolute top-1/4 -left-8 px-3 py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-xl animate-bounce text-xs font-bold text-white" style={{ animationDelay: '1s', animationDuration: '2.5s' }}>
                Level Up! 🎯
              </div>
              <div className="absolute bottom-1/4 -right-8 px-3 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-xl animate-bounce text-xs font-bold text-white" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }}>
                Milestone! 🏆
              </div>

              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
                <div className="w-3 h-12 bg-blue-400 opacity-0" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <div className="w-3 h-16 bg-purple-400 opacity-0" style={{ animation: 'pulse 2s ease-in-out infinite 0.2s' }} />
                <div className="w-3 h-8 bg-pink-400 opacity-0" style={{ animation: 'pulse 2s ease-in-out infinite 0.4s' }} />
                <div className="w-3 h-20 bg-cyan-400 opacity-0" style={{ animation: 'pulse 2s ease-in-out infinite 0.6s' }} />
                <div className="w-3 h-14 bg-green-400 opacity-0" style={{ animation: 'pulse 2s ease-in-out infinite 0.8s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
          <div className="text-center">
            <h2 className="font-pixel-large text-[#023047]"><span >CORE IDEA</span></h2>
            <p className="mt-3 text-gray-700 max-w-3xl mx-auto">An AI teaching assistant that uses the Socratic Method to help students discover answers about sorting algorithms through guided, adaptive questioning — not by giving solutions outright.</p>
            <blockquote className="mt-4 text-lg italic text-gray-900 font-medium max-w-3xl mx-auto">"Don't tell students what to think" — <span className="bg-[#023047]/20 px-2 py-1 rounded">teach them how to think.</span>".</blockquote>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#023047]">Pillar 1</div>
              <h3 className="mt-1 text-base font-semibold text-[#023047]">Mentor mindset</h3>
              <p className="mt-1.5 text-sm text-gray-700">Prioritizes questions over answers to develop independent reasoning and durable understanding, not rote recall.</p>
              <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Encourages step-by-step justification.</li>
                <li>Promotes reflection before conclusion.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#023047]">Pillar 2</div>
              <h3 className="mt-1 text-base font-semibold text-[#023047]">Adaptive guidance</h3>
              <p className="mt-1.5 text-sm text-gray-700">Follow-up questions adjust to your current mental model, narrowing the gap from where you are to the target insight.</p>
              <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Detects misconceptions and re-frames.</li>
                <li>Scaffolds complexity progressively.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-[#023047]">Pillar 3</div>
              <h3 className="mt-1 text-base font-semibold text-[#023047]">Sorting focus</h3>
              <p className="mt-1.5 text-sm text-gray-700">Keeps discussion centered on core sorting algorithms and their trade-offs in time, space, stability, and practicality.</p>
              <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>Contrast O(n log n) vs O(n²) patterns.</li>
                <li>Highlight stability and memory usage.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 flex items-center">
                <div className="h-8 w-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-sm font-semibold">1</div>
                <div className="h-0.5 bg-[#023047]/50 flex-1 mx-3" />
              </div>
              <div className="flex-1 flex items-center">
                <div className="h-8 w-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-sm font-semibold">2</div>
                <div className="h-0.5 bg-[#023047]/50 flex-1 mx-3" />
              </div>
              <div className="flex-1 flex items-center">
                <div className="h-8 w-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-sm font-semibold">3</div>
                <div className="h-0.5 bg-[#023047]/40 flex-1 mx-3" />
              </div>
              <div className="flex-none">
                <div className="h-8 w-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-sm font-semibold">4</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm text-gray-700">
              <div>Identify topic</div>
              <div>Ask targeted question</div>
              <div>Adapt follow-ups</div>
              <div>Contrast for insight</div>
            </div>
          </div>
        </div>
      </section>

      
      <section id="quests" className="bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#023047] font-pixel">CHOOSE YOUR QUEST</h2>
            <p className="mt-1 text-gray-700 font-pixel text-sm">EARN XP, COLLECT BADGES, AND HELP SORTY THE MONSTER RESTORE ORDER!</p>
          </div>

          
          <div className="relative mt-8">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
            <ul className="space-y-8">
              <li className="relative pl-16">
                <div className="absolute left-3 top-0 h-6 w-6 rounded-full bg-[#023047] ring-4 ring-[#023047]/20" />
                <div className="flex items-start gap-3">
                  <svg className="h-8 w-8 text-[#023047]" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="36" r="18" fill="#023047"/>
                    <circle cx="26" cy="32" r="3" fill="#fff"/>
                    <circle cx="38" cy="32" r="3" fill="#fff"/>
                  </svg>
                  <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[#fb8500] font-pixel">QUEST 1</div>
              <h3 className="text-lg font-semibold text-[#023047] font-pixel">BUBBLE SORT BASICS</h3>
                    <p className="text-sm text-gray-700">Swap, compare, and make the biggest bubble rise to the top.</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-[#fb8500]/10 text-[#fb8500]">+50 XP</span>
                      <span className="px-2 py-1 rounded bg-[#023047]/10 text-[#023047]">Badge: Bubbler</span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Easy</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative pl-16">
                <div className="absolute left-3 top-0 h-6 w-6 rounded-full bg-[#023047] ring-4 ring-[#023047]/20" />
                <div className="flex items-start gap-3">
                  <svg className="h-8 w-8" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <rect x="14" y="26" width="36" height="24" rx="6" fill="#023047"/>
                    <path d="M14 38 H50" stroke="#fff" strokeWidth="3"/>
                  </svg>
                  <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[#8B5CF6] font-pixel">QUEST 2</div>
              <h3 className="text-lg font-semibold text-[#023047] font-pixel">MERGE SORT ADVENTURE</h3>
                    <p className="text-sm text-gray-700">Split, sort, and merge your way to victory using teamwork.</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-[#8B5CF6]/10 text-[#8B5CF6]">+80 XP</span>
                      <span className="px-2 py-1 rounded bg-[#023047]/10 text-[#023047]">Badge: Merger</span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Medium</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative pl-16">
                <div className="absolute left-3 top-0 h-6 w-6 rounded-full bg-[#023047] ring-4 ring-[#023047]/20" />
                <div className="flex items-start gap-3">
                  <svg className="h-8 w-8" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="32,16 52,32 32,48 12,32" fill="#023047"/>
                    <circle cx="32" cy="32" r="4" fill="#fff"/>
                  </svg>
                  <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[#10B981] font-pixel">QUEST 3</div>
              <h3 className="text-lg font-semibold text-[#023047] font-pixel">QUICK SORT CHALLENGE</h3>
                    <p className="text-sm text-gray-700">Pick a pivot, split the monsters, and sort super fast.</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981]">+100 XP</span>
                      <span className="px-2 py-1 rounded bg-[#023047]/10 text-[#023047]">Badge: Splitter</span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Hard</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600">
            <span className="px-2 py-1 rounded bg-[#fb8500]/10 text-[#fb8500]">XP</span>
            <span className="px-2 py-1 rounded bg-[#023047]/10 text-[#023047]">Badge</span>
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Difficulty</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Testimonials</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#023047] mt-1">
                WHAT <span className="text-[#8B5CF6] px-2 py-1 rounded">SORTIT CUSTOMERS</span> SAY
              </h2>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-[#023047] text-white flex items-center justify-center hover:bg-[#012c43] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-lg bg-[#023047] text-white flex items-center justify-center hover:bg-[#012c43] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 border border-gray-200 shadow-sm">
              <div className="text-lg font-bold text-[#023047] mb-4">Stanford University</div>
              <div className="text-gray-700 text-lg leading-relaxed mb-6">
                "Before SortIt, I was just memorizing sorting algorithms for exams. Now I actually understand why Quick Sort is O(n log n) on average. The Socratic questions made me think through the recursion depth myself."
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#023047] to-[#012c43] flex items-center justify-center text-white font-bold text-lg">S</div>
                <div>
                  <div className="font-bold text-[#023047]">Sarah Chen</div>
                  <div className="text-gray-600">Computer Science Student</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 border border-gray-200 shadow-sm">
              <div className="text-lg font-bold text-[#023047] mb-4">Google</div>
              <div className="text-gray-700 text-lg leading-relaxed mb-6">
                "Perfect for interview prep. The adaptive questions helped me explain trade-offs between Merge and Quick Sort confidently. I landed my dream job partly because I could reason through sorting algorithms clearly."
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#023047] to-[#012c43] flex items-center justify-center text-white font-bold text-lg">M</div>
                <div>
                  <div className="font-bold text-[#023047]">Mike Rodriguez</div>
                  <div className="text-gray-600">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-8 h-1 bg-[#023047] rounded-full"></div>
            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#023047] font-pixel">ABOUT SORTIT</h2>
              <p className="mt-3 text-gray-700">SortIt presents a modern, approachable interface for exploring sorting algorithms with a Socratic teaching philosophy. It’s built to help students reason their way to understanding.</p>
              
              <ul className="mt-4 space-y-2 text-gray-700 list-disc list-inside">
                <li>Socratic, question-first guidance</li>
                <li>Focused scope: sorting algorithms and their trade-offs</li>
                <li>Fast, responsive UI with React and Tailwind</li>
              </ul>
            </div>
            <div>
              <div className="rounded-2xl bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-700">Getting started is easy</div>
                <video 
                className="mt-2 h-80  rounded-lg border border-gray-200 w-full object-cover" 
                controls
                muted
                loop
                autoPlay
                playbackRate={0.75}
              >
                <source src={timelineVideo} type="video/mp4" />
                <source src={timelineVideo} type="video/quicktime" />
                Your browser does not support the video tag.
              </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-[#023047]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold font-pixel">READY TO GET ORGANIZED WITH SORTIT?</h3>
              <p className="opacity-90">Dive in and start exploring sorting with clarity.</p>
            </div>
            <a href="#features" className="btn-pixel">GET STARTED</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


