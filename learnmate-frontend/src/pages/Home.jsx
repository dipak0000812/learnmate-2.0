import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-pink-500 selection:text-white">

            {/* 
        HERO WRAPPER 
        - Mesh Gradient Background
        - Diagonal Clip Path
      */}
            <div className="relative bg-[#0a2540] text-white">
                {/* CSS Gradient Mesh - Simplified for React/Tailwind without external assets */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-10%] w-[80%] h-[150%] bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#06b6d4] opacity-30 blur-[120px] rotate-12 transform-gpu"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[60%] h-[120%] bg-gradient-to-bl from-[#f43f5e] via-[#7c3aed] to-[#3b82f6] opacity-30 blur-[100px] -rotate-12 transform-gpu"></div>
                </div>

                {/* NAVBAR: Transparent & White Text */}
                <nav className="relative z-50 pt-6 pb-6">
                    <div className="max-w-[1080px] mx-auto px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
                                <span className="text-white text-base font-bold font-heading">L</span>
                            </div>
                            <span className="font-heading font-bold text-white text-2xl tracking-tight hover:opacity-90 transition-opacity cursor-default">LearnMate</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link to="/login" className="text-base font-semibold text-white/80 hover:text-white transition-colors hidden sm:block">
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="text-base font-semibold bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition-all backdrop-blur-md border border-white/10"
                            >
                                Get started <span className="ml-1 opacity-70">→</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* HERO CONTENT */}
                <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-48 overflow-hidden">
                    <div className="max-w-[1080px] mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">

                            {/* Left: Typography (MASSIVE SCALE) */}
                            <div className="max-w-2xl relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium text-pink-200 mb-10 backdrop-blur-md">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                                    </span>
                                    New: Interactive Python Environments
                                </div>

                                <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-white mb-10 leading-[0.95]">
                                    Financial <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">velocity</span> <br />
                                    for skills.
                                </h1>

                                <p className="text-xl sm:text-2xl text-slate-300 mb-12 leading-relaxed max-w-lg font-medium">
                                    The infrastructure to grow your engineering capability. Replace passive tutorials with deliberate, measurable practice.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Link
                                        to="/register"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#635bff] text-white rounded-full font-bold text-lg hover:bg-[#5851df] transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-900/20"
                                    >
                                        Start now <span className="ml-2">→</span>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-white font-bold text-lg hover:text-indigo-200 transition-colors"
                                    >
                                        View existing demos
                                    </Link>
                                </div>
                            </div>

                            {/* Right: 3D Product Card (TILTED) */}
                            <div className="hidden lg:block relative perspective-1000 group">
                                {/* 3D Tilt Wrapper */}
                                <div className="relative transform-gpu rotate-y-[-12deg] rotate-x-[10deg] transition-transform duration-700 ease-out group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg] group-hover:scale-105">

                                    {/* Back Layer (Depth) */}
                                    <div className="absolute inset-0 bg-white/5 rounded-2xl transform translate-z-[-40px] translate-x-4 translate-y-4 blur-sm border border-white/5"></div>

                                    {/* Main Card */}
                                    <div className="bg-[#1a1f36] rounded-xl border border-white/10 shadow-2xl shadow-indigo-900/50 p-1 backdrop-blur-xl overflow-hidden relative">
                                        {/* Glass Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none z-20"></div>

                                        {/* Card Content (Simulated IDE) */}
                                        <div className="bg-[#0f111a] rounded-lg p-6 font-mono text-sm relative z-10 min-h-[400px]">
                                            {/* Window Controls */}
                                            <div className="flex gap-2 mb-6">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                            </div>

                                            {/* Code */}
                                            <div className="space-y-1">
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">1</span><span className="text-purple-400">class</span> <span className="text-yellow-200">Engineer</span>(<span className="text-blue-300">Model</span>):</div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">2</span>&nbsp;&nbsp;<span className="text-slate-400">"""Models skill acquisition velocity."""</span></div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">3</span></div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">4</span>&nbsp;&nbsp;<span className="text-purple-400">def</span> <span className="text-blue-400">optimize_learning_rate</span>(<span className="text-orange-300">self</span>):</div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">5</span>&nbsp;&nbsp;&nbsp;&nbsp;current_skill = <span className="text-orange-300">self</span>.assess_competence()</div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">6</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> current_skill &lt; <span className="text-cyan-300">TARGET_THRESHOLD</span>:</div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">7</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-400"># Increase difficulty strictly</span></div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">8</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-300">Difficulty.HARD</span></div>
                                                <div className="flex text-slate-500"><span className="w-6 inline-block opacity-30 select-none">9</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-green-300">Difficulty.MAINTAIN</span></div>
                                            </div>

                                            {/* Floating Badge */}
                                            <div className="absolute bottom-8 right-8 bg-[#635bff] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg animate-bounce transform-gpu">
                                                Validating...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Wave/Slash - Transition to White */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                        <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M1200 120L0 16.48V0h1200v120z" className="fill-white" fill="#FFFFFF"></path>
                        </svg>
                    </div>
                </section>
            </div>

            <main>
                {/* 2. SYSTEM OVERVIEW: Structural Grid */}
                <section className="pt-24 pb-32 bg-white relative z-10">
                    <div className="max-w-[1080px] mx-auto px-6">
                        <div className="mb-20">
                            <h3 className="text-[#635bff] font-bold tracking-wider uppercase text-sm mb-4">The Platform</h3>
                            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-2xl">
                                A complete toolchain for <br /> technical mastery.
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-6 group">
                                <div className="w-12 h-1 bg-[#635bff] rounded-full group-hover:w-24 transition-all duration-300"></div>
                                <h3 className="font-heading text-2xl font-bold text-slate-900 group-hover:text-[#635bff] transition-colors">Unified Roadmap</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Stop random tutorial jumping. Generate a linear, dependency-aware graph of concepts needed to reach your specific engineering goals.
                                </p>
                            </div>
                            <div className="space-y-6 group">
                                <div className="w-12 h-1 bg-[#635bff] rounded-full group-hover:w-24 transition-all duration-300"></div>
                                <h3 className="font-heading text-2xl font-bold text-slate-900 group-hover:text-[#635bff] transition-colors">Active Verification</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Passive watching creates false confidence. We use active recall and code-based implementation tests to verify true competence.
                                </p>
                            </div>
                            <div className="space-y-6 group">
                                <div className="w-12 h-1 bg-[#635bff] rounded-full group-hover:w-24 transition-all duration-300"></div>
                                <h3 className="font-heading text-2xl font-bold text-slate-900 group-hover:text-[#635bff] transition-colors">Continuous Decay</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Our spaced-repetition engine detects decay in your knowledge graph and schedules targeted reinforcement automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. HOW IT WORKS: Horizontal Timeline */}
                <section className="py-32 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-[1080px] mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-20 items-center">
                            <div className="space-y-12">
                                <h2 className="font-heading text-4xl font-bold text-slate-900">The Acquisition Loop</h2>

                                <div className="space-y-10">
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl font-bold text-[#635bff]/20 font-heading">01</span>
                                        <div>
                                            <h4 className="font-heading text-xl font-bold text-slate-900 mb-2">Baseline Assessment</h4>
                                            <p className="text-lg text-slate-600 leading-relaxed">We map your existing knowledge boundary to avoid redundancy. Don't re-learn things you already know.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl font-bold text-[#635bff]/20 font-heading">02</span>
                                        <div>
                                            <h4 className="font-heading text-xl font-bold text-slate-900 mb-2">Graph Generation</h4>
                                            <p className="text-lg text-slate-600 leading-relaxed">The system builds a directed acyclic graph (DAG) of prerequisites tailored to your career vector.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl font-bold text-[#635bff]/20 font-heading">03</span>
                                        <div>
                                            <h4 className="font-heading text-xl font-bold text-slate-900 mb-2">Capstone Verification</h4>
                                            <p className="text-lg text-slate-600 leading-relaxed">Deep work sessions where you build real subsystems. Passes required to unlock adjacent nodes.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphics */}
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h5 className="font-bold text-slate-900">Current Velocity</h5>
                                    <span className="text-green-500 font-bold">+24%</span>
                                </div>
                                {/* Fake Chart */}
                                <div className="flex items-end gap-2 h-48 mb-6">
                                    <div className="bg-slate-100 w-full rounded-t-sm h-[30%]"></div>
                                    <div className="bg-slate-100 w-full rounded-t-sm h-[45%]"></div>
                                    <div className="bg-slate-100 w-full rounded-t-sm h-[40%]"></div>
                                    <div className="bg-[#635bff] w-full rounded-t-sm h-[65%] relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Sprint 4</div>
                                    </div>
                                    <div className="bg-indigo-300 w-full rounded-t-sm h-[85%]"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FOOTER CTA */}
                <section className="py-32 bg-[#0a2540] text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="font-heading text-5xl sm:text-6xl font-bold tracking-tight mb-8">
                            Build career capital.
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link
                                to="/register"
                                className="px-10 py-4 bg-[#635bff] text-white rounded-full font-bold text-lg hover:bg-[#5851df] transition-all shadow-lg"
                            >
                                Start your account
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="bg-[#f6f9fc] py-20 border-t border-slate-200">
                <div className="max-w-[1080px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold font-heading">L</span>
                            </div>
                            <span className="font-heading font-bold text-slate-900 text-lg">LearnMate</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                            © {new Date().getFullYear()} LearnMate Inc.<br />
                            Designing the future of technical education.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-20">
                        <div className="flex flex-col gap-4">
                            <span className="text-sm font-bold text-slate-900 mb-2">Product</span>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">Features</a>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">Methodology</a>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">Pricing</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-sm font-bold text-slate-900 mb-2">Company</span>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">About</a>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">Blog</a>
                            <a href="#" className="text-base text-slate-500 hover:text-[#635bff] font-medium transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
