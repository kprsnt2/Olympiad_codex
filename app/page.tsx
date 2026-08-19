"use client";

import { FormEvent, useMemo, useState } from "react";

const grades = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
const tracks = [
  { id: "IMO", label: "Maths", icon: "∑", tint: "sun", title: "IMO Maths Mission", sub: "Numbers, logic & bright ideas", progress: 64, lessons: "12 lessons left" },
  { id: "ISO", label: "Science", icon: "✦", tint: "mint", title: "ISO Science Lab", sub: "Observe, wonder, discover", progress: 42, lessons: "18 lessons left" },
  { id: "IEO", label: "English", icon: "Aa", tint: "lilac", title: "IEO Word Studio", sub: "Read, reason & write", progress: 76, lessons: "7 lessons left" },
  { id: "IGKO", label: "GK", icon: "◎", tint: "coral", title: "IGKO World Quest", sub: "Curious facts, connected minds", progress: 27, lessons: "21 lessons left" },
];
const dailyTasks = [
  { icon: "⚡", task: "Number Ninja Sprint", time: "8 min", points: "+15 sparks", color: "yellow" },
  { icon: "◈", task: "Brain-bender of the day", time: "4 min", points: "+10 sparks", color: "pink" },
  { icon: "▣", task: "Read & Recall", time: "6 min", points: "+10 sparks", color: "blue" },
];
type PlanItem = { day: string; task: string; note: string };

export default function Home() {
  const [grade, setGrade] = useState("Grade 4");
  const [activeTrack, setActiveTrack] = useState("IMO");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [coachLine, setCoachLine] = useState("Pick a grade and I’ll build a tiny plan that feels doable.");
  const [provider, setProvider] = useState("");
  const active = useMemo(() => tracks.find((track) => track.id === activeTrack) ?? tracks[0], [activeTrack]);
  const questions = [
    { q: "A robot takes 4 steps, then 6 steps, then 8 steps. What comes next?", options: ["9 steps", "10 steps", "12 steps"], answer: 1, hint: "Look at how much is added each time." },
    { q: "Which shape has exactly 3 sides and 3 corners?", options: ["Square", "Triangle", "Pentagon"], answer: 1, hint: "Count both its sides and corners." },
  ];
  const currentQuestion = questions[questionIndex];

  function checkAnswer(index: number) { setAnswered(true); setIsCorrect(index === currentQuestion.answer); }
  function nextQuestion() { setQuestionIndex((index) => (index + 1) % questions.length); setAnswered(false); setIsCorrect(null); }
  async function makePlan(event: FormEvent) {
    event.preventDefault(); setLoadingPlan(true);
    try {
      const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grade, exam: active.id, subject: active.label, goal: `feeling ready for the ${active.id} exam` }) });
      const data = await response.json(); setPlan(data.plan); setCoachLine(data.reply); setProvider(data.provider);
    } catch { setCoachLine("Your plan is waiting — check your connection and try one more time."); }
    finally { setLoadingPlan(false); }
  }

  return <main>
    <nav className="topbar">
      <a className="brand" href="#top" aria-label="Olympi home"><span className="brand-star">✦</span>olympi<span className="brand-dot">.</span></a>
      <div className="nav-links"><a href="#paths">Learn</a><a href="#practice">Practice</a><a href="#paper">Papers</a><a href="#coach">Coach</a></div>
      <div className="nav-actions"><button className="icon-btn" aria-label="Notifications">♧<span className="notify" /></button><button className="avatar">A<span className="online" /></button></div>
    </nav>

    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span /> THE BRIGHT WAY TO PREPARE</div><h1>Big thoughts.<br /><em>Tiny wins.</em></h1>
        <p>Olympiad prep that feels less like homework and more like discovering what your brain can do.</p>
        <div className="hero-buttons"><a href="#paths" className="button primary">Find my path <b>→</b></a><a href="#practice" className="text-link">Take a 4-min spark test <span>↗</span></a></div>
        <div className="trust-row"><div className="faces"><span>R</span><span>D</span><span>S</span><span>M</span></div><p><b>1,20,000+ curious minds</b><br />are growing a little every day</p></div>
      </div>
      <div className="hero-art" aria-label="A playful space explorer with learning cards">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="star sparkle-one">✦</div><div className="star sparkle-two">✦</div><div className="star sparkle-three">✧</div>
        <div className="planet"><i /><i /><i /></div><div className="rocket"><div className="window">●</div><div className="rocket-wing left" /><div className="rocket-wing right" /><div className="flame">✦</div></div>
        <div className="float-card card-math"><span>7 × 8 = ?</span><b>56</b><i>nailed it! ✨</i></div><div className="float-card card-star"><b>★</b><span>new spark<br /><strong>unlocked</strong></span></div><div className="float-card card-badge"><b>4</b><span>day<br />streak</span></div><div className="hero-caption">explore <span>your</span> orbit</div>
      </div>
    </section>

    <section className="grade-section" id="paths">
      <div className="section-heading"><div><span className="micro-label">START HERE</span><h2>What grade are you in?</h2></div><p>We’ll tune every challenge to the way<br />you’re learning right now.</p></div>
      <div className="grade-picker" role="list" aria-label="Choose your grade">{grades.map((item) => <button key={item} className={grade === item ? "grade active" : "grade"} onClick={() => setGrade(item)}><span>{item.replace("Grade ", "")}</span><small>Grade</small></button>)}</div>
      <div className="path-topline"><span>YOUR {grade.toUpperCase()} ADVENTURES</span><button onClick={() => setActiveTrack("IMO")}>See all subjects <b>→</b></button></div>
      <div className="track-grid">{tracks.map((track) => <button key={track.id} className={`track-card ${track.tint} ${activeTrack === track.id ? "chosen" : ""}`} onClick={() => setActiveTrack(track.id)}><div className="track-icon">{track.icon}</div><span className="exam-code">SOF {track.id}</span><h3>{track.title}</h3><p>{track.sub}</p><div className="track-progress"><span><b style={{ width: `${track.progress}%` }} /></span><small>{track.progress}% explored</small></div><footer>{track.lessons}<b>→</b></footer></button>)}</div>
    </section>

    <section className="momentum">
      <div className="momentum-intro"><span className="micro-label pale">YOUR MOMENTUM</span><h2>Every small step<br />makes a <em>difference.</em></h2><p>Show up, wonder out loud, and watch your confidence grow.</p><div className="stat-pills"><div><b>4</b><span>day streak<br />so far</span></div><div><b>183</b><span>sparks<br />collected</span></div></div></div>
      <div className="trail" aria-label="Progress trail"><div className="trail-lines" /><div className="trail-node start"><b>1</b><span>Start</span></div><div className="trail-node done"><b>2</b><span>Explorer</span></div><div className="trail-node current"><b>3</b><span>Thinker</span><i>YOU ARE<br />HERE</i></div><div className="trail-node locked"><b>★</b><span>Whiz</span></div><div className="trail-node locked last"><b>♛</b><span>Champion</span></div></div>
    </section>

    <section className="practice" id="practice">
      <div className="section-heading"><div><span className="micro-label">TODAY’S TINY WINS</span><h2>Pick a spark. Get started.</h2></div><p>No huge sessions. Just small moments<br />that make your brain brighter.</p></div>
      <div className="daily-grid">{dailyTasks.map((item) => <button className={`daily-card ${item.color}`} key={item.task}><div className="daily-icon">{item.icon}</div><span className="time">{item.time}</span><h3>{item.task}</h3><footer><span>{item.points}</span><b>Start <i>→</i></b></footer></button>)}</div>
    </section>

    <section className="quiz-shell" id="paper">
      <div className="quiz-card"><div className="quiz-head"><div><span>DAILY SPARK TEST</span><h2>One good question<br />is all it takes.</h2></div><div className="timer"><b>04:00</b><small>time to think</small></div></div><div className="progress-dots"><i className="on" /><i /><i /><i /><i /></div><div className="question"><small>QUESTION {questionIndex + 1} OF 5</small><h3>{currentQuestion.q}</h3><div className="answers">{currentQuestion.options.map((option, index) => <button key={option} disabled={answered} className={answered ? (index === currentQuestion.answer ? "correct" : "faded") : ""} onClick={() => checkAnswer(index)}><b>{String.fromCharCode(65 + index)}</b>{option}{answered && index === currentQuestion.answer && <span>✓</span>}</button>)}</div>{answered && <div className={isCorrect ? "answer-note yay" : "answer-note"}><span>{isCorrect ? "✦" : "◌"}</span><p><b>{isCorrect ? "That’s it — you spotted the pattern!" : "Nearly! Try adding 2 each time."}</b><br />{isCorrect ? "You just earned 15 sparks." : currentQuestion.hint}</p><button onClick={nextQuestion}>Next <b>→</b></button></div>}</div></div>
      <aside className="paper-teaser"><span>GO DEEPER</span><h3>Previous year<br />papers, but kinder.</h3><p>Build exam calm with timed papers, friendly hints and step-by-step solutions.</p><div className="paper-stack"><div className="paper back" /><div className="paper front"><b>SOF</b><span>IMO<br />Grade 4</span><i>2025</i></div></div><a href="#coach">Browse papers <b>→</b></a></aside>
    </section>

    <section className="coach-section" id="coach">
      <div className="coach-copy"><div className="nova">✦</div><span className="micro-label">MEET COACH NOVA</span><h2>A plan that knows<br />your <em>next step.</em></h2><p>When you get stuck, Nova turns confusion into a small, clear next move — never a lecture.</p><div className="coach-tip"><b>“</b><span>Tell Nova what feels tricky. That’s where your best learning begins.</span></div></div>
      <form className="coach-panel" onSubmit={makePlan}><div className="coach-panel-top"><span>YOUR MINI MISSION</span><i>{provider ? `powered by ${provider}` : "AI study buddy"}</i></div><p>{coachLine}</p><label>Choose your grade<select value={grade} onChange={(event) => setGrade(event.target.value)}>{grades.map((item) => <option key={item}>{item}</option>)}</select></label><label>Today I want to work on<select value={activeTrack} onChange={(event) => setActiveTrack(event.target.value)}>{tracks.map((track) => <option key={track.id} value={track.id}>{track.label} · SOF {track.id}</option>)}</select></label><button className="button primary full" disabled={loadingPlan}>{loadingPlan ? "Nova is thinking..." : "Make my tiny plan"} <b>→</b></button>{plan && <div className="plan-result">{plan.map((item) => <div key={item.day}><span>{item.day}</span><p><b>{item.task}</b><br />{item.note}</p></div>)}</div>}</form>
    </section>
    <footer className="site-footer"><a className="brand" href="#top"><span className="brand-star">✦</span>olympi<span className="brand-dot">.</span></a><p>For young minds that were made to wonder.</p><div><a href="#paths">Learning paths</a><a href="#practice">Mock tests</a><a href="#coach">Ask Coach Nova</a></div></footer>
  </main>;
}
