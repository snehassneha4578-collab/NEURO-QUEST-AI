import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, Brain, ChevronRight, Clock3, Cpu,
  Gamepad2, Heart, Lightbulb, LockKeyhole, Play, Radio,
  RotateCcw, Shield, Sparkles, Trophy, Zap
} from 'lucide-react'
import './App.css'

type Screen = 'home' | 'missions' | 'memory' | 'codebreaker' | 'logic' | 'showdown' | 'result'
type Phase = 'preview' | 'playing' | 'won' | 'failed'

const tiles = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6']

const cipherChallenges = [
  {
    title: 'SIGNAL IDENTIFICATION',
    cipher: 'RUELW',
    answer: 'ORBIT',
    shift: 3,
    description: 'Decode the intercepted signal.'
  },
  {
    title: 'VAULT AUTHENTICATION',
    cipher: 'TUJS YMJ AFZQY',
    answer: 'OPEN THE VAULT',
    shift: 5,
    description: 'Recover the security phrase.'
  },
  {
    title: 'FINAL TRANSMISSION',
    cipher: 'ULBYV PZ DHAJOPUN',
    answer: 'NEURO IS WATCHING',
    shift: 7,
    description: 'Decode N.E.U.R.O final transmission.'
  }
]

const logicChallenges = [
  {
    title: 'THE NUMBER SEQUENCE',
    question: 'Find the missing number: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '44'],
    answer: 2,
    hint: 'Look at the differences between consecutive numbers.',
    explanation: 'The differences are 4, 6, 8, 10, then 12. The answer is 42.'
  },
  {
    title: 'THE THREE SWITCHES',
    question: 'A room has three switches outside and one bulb inside. You can enter the room only once. Which method identifies the correct switch?',
    options: [
      'Turn all switches on and enter.',
      'Turn switch 1 on for a few minutes, turn it off, turn switch 2 on, then enter.',
      'Turn every switch off and enter.',
      'Turn switch 1 on and enter immediately.'
    ],
    answer: 1,
    hint: 'Think about what a bulb can reveal besides whether it is glowing.',
    explanation: 'The glowing bulb identifies switch 2. A warm but unlit bulb identifies switch 1. A cold, unlit bulb identifies switch 3.'
  },
  {
    title: 'THE GUARDIAN RIDDLE',
    question: 'One of three terminals contains the access key. Terminal A says: "The key is not here." Terminal B says: "The key is in A." Terminal C says: "The key is not in B." Exactly one statement is true. Where is the key?',
    options: ['Terminal A', 'Terminal B', 'Terminal C', 'Cannot be determined'],
    answer: 1,
    hint: 'Test each possible key location and count the true statements.',
    explanation: 'If the key is in B, A is true, B is false, and C is false. Exactly one statement is true.'
  }
]

const bossChallenges = [
  {
    title: 'THE ADAPTIVE FIREWALL',
    transmission: 'Your attacks are being detected and blocked. The firewall adapts after every attempt. What is your best strategy?',
    options: [
      'Repeat the same attack until it works.',
      'Change the attack pattern and test the firewall response.',
      'Shut down your own terminal.',
      'Wait without taking any action.'
    ],
    answer: 1,
    hint: 'An adaptive system learns repeated patterns. Avoid predictable behavior.',
    success: 'FIREWALL BYPASSED. N.E.U.R.O. is recalculating your behavior.'
  },
  {
    title: 'THE PREDICTION ENGINE',
    transmission: 'N.E.U.R.O. predicts your next move by tracking your previous choices. How do you defeat its prediction model?',
    options: [
      'Always choose the first option.',
      'Follow the same strategy every time.',
      'Introduce unpredictable decisions and vary your strategy.',
      'Give the AI more information about your plan.'
    ],
    answer: 2,
    hint: 'The prediction engine depends on patterns in your behavior.',
    success: 'PREDICTION ENGINE DISRUPTED. N.E.U.R.O. has lost its advantage.'
  },
  {
    title: 'THE CORE OVERRIDE',
    transmission: 'You reached the central AI core. Its main processor and backup power are active. What must you do to secure the facility?',
    options: [
      'Disable the processor and isolate its backup power.',
      'Restart the AI system.',
      'Disconnect the monitor only.',
      'Send another command without checking the system.'
    ],
    answer: 0,
    hint: 'A system remains active if its backup power is still connected.',
    success: 'CORE NEUTRALIZED. THE FACILITY IS UNDER YOUR CONTROL.'
  }
]

function createSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * tiles.length))
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [phase, setPhase] = useState<Phase>('preview')
  const [sequence, setSequence] = useState<number[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(60)
  const [hintUsed, setHintUsed] = useState(false)
  const [completed, setCompleted] = useState(
    () => localStorage.getItem('neuroquest-memory-completed') === 'true'
  )
  const [savedXP, setSavedXP] = useState(
    () => Number(localStorage.getItem('neuroquest-xp') || 0)
  )

  const [cipherStage, setCipherStage] = useState(0)
  const [cipherAnswer, setCipherAnswer] = useState('')
  const [cipherTimeLeft, setCipherTimeLeft] = useState(150)
  const [cipherScore, setCipherScore] = useState(0)
  const [cipherHintUsed, setCipherHintUsed] = useState(false)
  const [cipherStatus, setCipherStatus] = useState<'playing' | 'won' | 'failed'>('playing')
  const [cipherCompleted, setCipherCompleted] = useState(
    () => localStorage.getItem('neuroquest-codebreaker-completed') === 'true'
  )
  const [cipherMessage, setCipherMessage] = useState('Decrypt the intercepted transmission.')

  const [logicStage, setLogicStage] = useState(0)
  const [logicChoice, setLogicChoice] = useState<number | null>(null)
  const [logicTimeLeft, setLogicTimeLeft] = useState(120)
  const [logicScore, setLogicScore] = useState(0)
  const [logicHintUsed, setLogicHintUsed] = useState(false)
  const [logicStatus, setLogicStatus] = useState<'playing' | 'won' | 'failed'>('playing')
  const [logicCompleted, setLogicCompleted] = useState(
    () => localStorage.getItem('neuroquest-logic-completed') === 'true'
  )
  const [logicMessage, setLogicMessage] = useState('Analyze the system and solve the first logic challenge.')

  const [bossStage, setBossStage] = useState(0)
  const [bossChoice, setBossChoice] = useState<number | null>(null)
  const [bossTimeLeft, setBossTimeLeft] = useState(180)
  const [bossScore, setBossScore] = useState(0)
  const [bossHintUsed, setBossHintUsed] = useState(false)
  const [bossStatus, setBossStatus] = useState<'playing' | 'won' | 'failed'>('playing')
  const [bossCompleted, setBossCompleted] = useState(
    () => localStorage.getItem('neuroquest-showdown-completed') === 'true'
  )
  const [bossMessage, setBossMessage] = useState('N.E.U.R.O. is waiting for your first move.')
  const [message, setMessage] = useState('Memorize the sequence before the security terminal activates.')

  function startRound(nextRound: number) {
    setRound(nextRound)
    setSequence(createSequence(nextRound + 2))
    setSelected([])
    setTimeLeft(60)
    setPhase('preview')
    setMessage(`ROUND ${nextRound}: Memorize the sequence.`)
  }

  function startMemory() {
    setScore(0)
    setMoves(0)
    setLives(3)
    setHintUsed(false)
    startRound(1)
    setScreen('memory')
  }

  useEffect(() => {
    if (screen !== 'memory' || phase !== 'preview') return

    const timeout = window.setTimeout(() => {
      setPhase('playing')
      setMessage('Sequence hidden. Reproduce it from memory!')
    }, 3000)

    return () => window.clearTimeout(timeout)
  }, [screen, phase, round])

  useEffect(() => {
    if (screen !== 'memory' || phase !== 'playing') return

    const interval = window.setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          window.clearInterval(interval)
          setPhase('failed')
          setMessage('TIME EXPIRED. The security system locked the terminal.')
          window.setTimeout(() => setScreen('result'), 900)
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [screen, phase])

  useEffect(() => {
    if (phase !== 'failed') return

    const timeout = window.setTimeout(() => setScreen('result'), 900)
    return () => window.clearTimeout(timeout)
  }, [phase])

  function chooseTile(index: number) {
    if (phase !== 'playing' || selected.length >= sequence.length) return

    setMoves(previous => previous + 1)

    if (index !== sequence[selected.length]) {
      const remainingLives = lives - 1
      setLives(remainingLives)
      setSelected([])

      if (remainingLives <= 0) {
        setPhase('failed')
        setMessage('ALL LIVES LOST. N.E.U.R.O HAS LOCKED THE TERMINAL.')
      } else {
        setMessage(`Incorrect tile! ${remainingLives} ${remainingLives === 1 ? 'life' : 'lives'} remaining. Try the sequence again.`)
      }
      return
    }

    const next = [...selected, index]
    setSelected(next)

    if (next.length === sequence.length) {
      const reward = Math.max(50, 150 * round - (hintUsed ? 50 : 0))
      setScore(previous => previous + reward)

      if (round < 3) {
        setMessage(`Round ${round} complete! +${reward} XP. Next security layer incoming.`)
        window.setTimeout(() => startRound(round + 1), 900)
      } else {
        const totalXP = savedXP + score + reward
        localStorage.setItem('neuroquest-xp', String(totalXP))
        localStorage.setItem('neuroquest-memory-completed', 'true')
        setSavedXP(totalXP)
        setCompleted(true)
        setPhase('won')
        setMessage('All memory layers breached. Access granted!')
        window.setTimeout(() => setScreen('result'), 900)
      }
    } else {
      setMessage('Correct tile. Keep going!')
    }
  }

  function useHint() {
    if (phase !== 'playing' || hintUsed) return

    const nextTile = tiles[sequence[selected.length]]
    setHintUsed(true)
    setMessage(`N.E.U.R.O hint: the next tile is ${nextTile}. Your final reward is reduced by 50 XP.`)
  }

  useEffect(() => {
    if (screen !== 'codebreaker' || cipherStatus !== 'playing') return

    const interval = window.setInterval(() => {
      setCipherTimeLeft(previous => {
        if (previous <= 1) {
          window.clearInterval(interval)
          setCipherStatus('failed')
          setCipherMessage('TIME EXPIRED. The encrypted channel has been terminated.')
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [screen, cipherStatus])

  function startCodeBreaker() {
    setCipherStage(0)
    setCipherAnswer('')
    setCipherTimeLeft(150)
    setCipherScore(0)
    setCipherHintUsed(false)
    setCipherStatus('playing')
    setCipherMessage('Decrypt the intercepted transmission.')
    setScreen('codebreaker')
  }

  function submitCipher() {
    if (cipherStatus !== 'playing') return

    const answer = cipherAnswer.trim().toUpperCase().replace(/\s+/g, ' ')
    const challenge = cipherChallenges[cipherStage]

    if (answer !== challenge.answer) {
      setCipherMessage('INCORRECT DECRYPTION. Check the alphabet shift and try again.')
      return
    }

    const rewards = [100, 200, 300]
    const reward = Math.max(50, rewards[cipherStage] - (cipherHintUsed ? 50 : 0))
    setCipherScore(previous => previous + reward)
    setCipherAnswer('')

    if (cipherStage < 2) {
      setCipherStage(previous => previous + 1)
      setCipherHintUsed(false)
      setCipherMessage(`DECRYPTION SUCCESSFUL. +${reward} XP. Next transmission incoming.`)
      return
    }

    const totalXP = savedXP + cipherScore + reward
    localStorage.setItem('neuroquest-xp', String(totalXP))
    localStorage.setItem('neuroquest-codebreaker-completed', 'true')
    setSavedXP(totalXP)
    setCipherCompleted(true)
    setCipherStatus('won')
    setCipherMessage(`ALL TRANSMISSIONS DECRYPTED. +${reward} XP. Access granted.`)
  }

  function useCipherHint() {
    if (cipherStatus !== 'playing' || cipherHintUsed) return

    setCipherHintUsed(true)
    setCipherMessage(
      `N.E.U.R.O HINT: Each encrypted letter was shifted FORWARD by ${cipherChallenges[cipherStage].shift}. Move each letter BACKWARD by that number. -50 XP reward.`
    )
  }

  useEffect(() => {
    if (screen !== 'logic' || logicStatus !== 'playing') return

    const interval = window.setInterval(() => {
      setLogicTimeLeft(previous => {
        if (previous <= 1) {
          window.clearInterval(interval)
          setLogicStatus('failed')
          setLogicMessage('TIME EXPIRED. The logic core has locked.')
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [screen, logicStatus])

  function startLogic() {
    setLogicStage(0)
    setLogicChoice(null)
    setLogicTimeLeft(120)
    setLogicScore(0)
    setLogicHintUsed(false)
    setLogicStatus('playing')
    setLogicMessage('Analyze the system and solve the first logic challenge.')
    setScreen('logic')
  }

  function submitLogic() {
    if (logicStatus !== 'playing' || logicChoice === null) return

    const challenge = logicChallenges[logicStage]

    if (logicChoice !== challenge.answer) {
      setLogicMessage('INCORRECT. Reconsider the evidence and try again.')
      return
    }

    const rewards = [150, 250, 350]
    const reward = Math.max(50, rewards[logicStage] - (logicHintUsed ? 50 : 0))
    const nextScore = logicScore + reward

    setLogicScore(nextScore)
    setLogicChoice(null)

    if (logicStage < 2) {
      setLogicStage(previous => previous + 1)
      setLogicHintUsed(false)
      setLogicMessage(`LOGIC VERIFIED. +${reward} XP. Next challenge unlocked.`)
      return
    }

    const totalXP = savedXP + nextScore
    localStorage.setItem('neuroquest-xp', String(totalXP))
    localStorage.setItem('neuroquest-logic-completed', 'true')
    setSavedXP(totalXP)
    setLogicCompleted(true)
    setLogicStatus('won')
    setLogicMessage(`ALL LOGIC CHALLENGES SOLVED. +${reward} XP. Access granted.`)
  }

  function useLogicHint() {
    if (logicStatus !== 'playing' || logicHintUsed) return

    setLogicHintUsed(true)
    setLogicMessage(`N.E.U.R.O HINT: ${logicChallenges[logicStage].hint} Your reward is reduced by 50 XP.`)
  }

  useEffect(() => {
    if (screen !== 'showdown' || bossStatus !== 'playing') return

    const interval = window.setInterval(() => {
      setBossTimeLeft(previous => {
        if (previous <= 1) {
          window.clearInterval(interval)
          setBossStatus('failed')
          setBossMessage('TIME EXPIRED. N.E.U.R.O. has regained control.')
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [screen, bossStatus])

  function startShowdown() {
    setBossStage(0)
    setBossChoice(null)
    setBossTimeLeft(180)
    setBossScore(0)
    setBossHintUsed(false)
    setBossStatus('playing')
    setBossMessage('N.E.U.R.O.: You made it this far. Let us see if you can outthink me.')
    setScreen('showdown')
  }

  function submitBossChoice() {
    if (bossStatus !== 'playing' || bossChoice === null) return

    const challenge = bossChallenges[bossStage]

    if (bossChoice !== challenge.answer) {
      setBossMessage('N.E.U.R.O.: Predictable. That strategy will not work. Try again.')
      setBossChoice(null)
      return
    }

    const rewards = [200, 300, 500]
    const reward = Math.max(50, rewards[bossStage] - (bossHintUsed ? 50 : 0))
    const nextScore = bossScore + reward

    setBossScore(nextScore)
    setBossChoice(null)

    if (bossStage < 2) {
      setBossStage(previous => previous + 1)
      setBossHintUsed(false)
      setBossMessage(`${challenge.success} +${reward} XP. Next security layer activated.`)
      return
    }

    const totalXP = savedXP + nextScore
    localStorage.setItem('neuroquest-xp', String(totalXP))
    localStorage.setItem('neuroquest-showdown-completed', 'true')
    setSavedXP(totalXP)
    setBossCompleted(true)
    setBossStatus('won')
    setBossMessage('CORE NEUTRALIZED. YOU HAVE DEFEATED N.E.U.R.O.')
  }

  function useBossHint() {
    if (bossStatus !== 'playing' || bossHintUsed) return

    setBossHintUsed(true)
    setBossMessage(`N.E.U.R.O. HINT: ${bossChallenges[bossStage].hint} Your reward is reduced by 50 XP.`)
  }

  function startGame() {
    setScreen('missions')
  }

  return (
    <main className="game-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')}>
          <span className="brand-icon"><Brain size={23} /></span>
          <span>NEURO<span className="accent">QUEST</span><small>THE INTELLIGENCE ESCAPE</small></span>
        </button>
        <div className="top-status">
          <span className="online-dot" /> SYSTEM ONLINE
          <span className="version">BUILD 02.0</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.section key="home" className="hero-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="hero-copy">
              <div className="eyebrow"><span /> CLASSIFIED MISSION // 001</div>
              <h1>YOUR MIND IS<br />THE <span>ONLY KEY.</span></h1>
              <p className="hero-description">
                An experimental AI has taken control of the facility.
                Solve its challenges, outsmart its intelligence, and escape
                before the system locks you in forever.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={startGame}>
                  <Play size={17} fill="currentColor" /> ENTER THE GAME <ChevronRight size={18} />
                </button>
                <span className="difficulty"><Shield size={15} /> CLASSIFIED // LEVEL 01</span>
              </div>
              <div className="hero-stats">
                <div><strong>04</strong><span>MISSIONS</span></div>
                <div><strong>01</strong><span>AI ENEMY</span></div>
                <div><strong>8</strong><span>WAYS TO THINK</span></div>
              </div>
              <p className="saved-xp">YOUR PROFILE // {savedXP} TOTAL XP</p>
            </div>

            <div className="core-stage">
              <div className="core-label"><span className="online-dot" /> UNKNOWN INTELLIGENCE DETECTED</div>
              <div className="core-rings">
                <div className="ring ring-one" />
                <div className="ring ring-two" />
                <div className="ring ring-three" />
                <motion.div className="ai-core"
                  animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 35px #3b82f655', '0 0 85px #8b5cf699', '0 0 35px #3b82f655'] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  <Brain size={66} strokeWidth={1.1} />
                </motion.div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.span key={i} className="orbit-dot"
                    style={{ transform: `rotate(${i * 45}deg) translateY(-155px)` }}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} />
                ))}
              </div>
              <div className="core-caption">N.E.U.R.O <span> // ACTIVE</span></div>
              <div className="core-subcaption">NEURAL ENTITY // UNKNOWN ORIGIN</div>
            </div>
          </motion.section>
        )}

        {screen === 'missions' && (
          <motion.section key="missions" className="content-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="eyebrow"><span /> MISSION CONTROL // SECTOR 01</div>
            <h2>CHOOSE YOUR <span>CHALLENGE.</span></h2>
            <p className="section-description">Four security layers stand between you and freedom.</p>
            <div className="mission-grid">
              <button className="mission-card active-card" onClick={startMemory}>
                <div className="mission-number">01 / {completed ? 'COMPLETED' : 'AVAILABLE'}</div>
                <Brain size={31} />
                <h3>MEMORY MATRIX</h3>
                <p>Three progressive rounds. Remember the sequence and prove your cognitive precision.</p>
                <span className="card-action">{completed ? 'PLAY AGAIN' : 'START MISSION'} <ChevronRight size={16} /></span>
              </button>
              <button className="mission-card active-card" onClick={startCodeBreaker}>
                <div className="mission-number">02 / {cipherCompleted ? 'COMPLETED' : 'AVAILABLE'}</div>
                <LockKeyhole size={31} />
                <h3>CODE BREAKER</h3>
                <p>Decrypt three encrypted transmissions using Caesar cipher techniques.</p>
                <span className="card-action">{cipherCompleted ? 'PLAY AGAIN' : 'START MISSION'} <ChevronRight size={16} /></span>
              </button>
              <button className="mission-card active-card" onClick={startLogic}>
                <div className="mission-number">03 / {logicCompleted ? 'COMPLETED' : 'AVAILABLE'}</div>
                <Cpu size={31} />
                <h3>LOGIC CORE</h3>
                <p>Solve three progressive reasoning challenges and escape the rogue AI logic traps.</p>
                <span className="card-action">{logicCompleted ? 'PLAY AGAIN' : 'START MISSION'} <ChevronRight size={16} /></span>
              </button>
              <button className="mission-card active-card" onClick={startShowdown}>
                <div className="mission-number">04 / {bossCompleted ? 'COMPLETED' : 'AVAILABLE'}</div>
                <Zap size={31} />
                <h3>AI SHOWDOWN</h3>
                <p>Challenge N.E.U.R.O. through three escalating AI strategy battles and escape the facility.</p>
                <span className="card-action">{bossCompleted ? 'PLAY AGAIN' : 'FACE THE AI'} <ChevronRight size={16} /></span>
              </button>
            </div>
            <button className="back-button" onClick={() => setScreen('home')}>? BACK TO MAIN MENU</button>
          </motion.section>
        )}

        {screen === 'memory' && (
          <motion.section key="memory" className="content-screen puzzle-screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <div className="eyebrow"><span /> MISSION 01 // MEMORY MATRIX</div>
            <div className="puzzle-heading">
              <div>
                <h2>RECALL THE <span>SEQUENCE.</span></h2>
                <p className="section-description">
                  {phase === 'preview' ? 'Memorize the displayed sequence!' : 'The sequence is hidden. Recall it!'}
                </p>
              </div>
              <div className="timer-chip"><Clock3 size={16} /> {phase === 'preview' ? 'PREVIEW' : `${timeLeft}s LEFT`}</div>
            </div>

            <div className="game-hud">
              <div><Heart size={17} /> <strong>{lives}</strong><span>LIVES</span></div>
              <div><Trophy size={17} /> <strong>{score}</strong><span>SESSION XP</span></div>
              <div><Activity size={17} /> <strong>{round}/3</strong><span>ROUND</span></div>
            </div>

            <div className="round-progress">
              {Array.from({ length: 3 }).map((_, index) => (
                <span key={index} className={index < round ? 'round-active' : ''} />
              ))}
            </div>

            <div className="puzzle-panel">
              <div className="panel-top">
                <span><Radio size={15} /> SECURITY TERMINAL</span>
                <span>ACCESS LEVEL 0{round}</span>
              </div>

              <div className={`sequence-display ${phase === 'preview' ? 'sequence-visible' : ''}`}>
                {phase === 'preview'
                  ? sequence.map(index => tiles[index]).join('  ?  ')
                  : '??  ?  ??  ?  ??'}
              </div>

              <div className="memory-grid">
                {tiles.map((tile, index) => (
                  <button key={tile}
                    className={`memory-tile ${selected.includes(index) ? 'tile-selected' : ''}`}
                    onClick={() => chooseTile(index)}
                    disabled={phase !== 'playing' || selected.length === sequence.length}>
                    <span>0{index + 1}</span><strong>{tile}</strong>
                  </button>
                ))}
              </div>

              <p className="puzzle-message"><Sparkles size={15} /> {message}</p>

              <div className="game-actions">
                <button className="hint-button" onClick={useHint} disabled={phase !== 'playing' || hintUsed}>
                  <Lightbulb size={15} /> {hintUsed ? 'HINT USED' : 'USE HINT (-50 XP)'}
                </button>
                <span>ATTEMPTS: {moves}</span>
                <span>PROGRESS: {selected.length}/{sequence.length}</span>
              </div>
            </div>
            <button className="back-button" onClick={() => setScreen('missions')}>? BACK TO MISSIONS</button>
          </motion.section>
        )}

        {screen === 'codebreaker' && (
          <motion.section
            key="codebreaker"
            className="content-screen puzzle-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="eyebrow"><span /> MISSION 02 // CODE BREAKER</div>

            {cipherStatus === 'playing' ? (
              <>
                <div className="puzzle-heading">
                  <div>
                    <h2>CRACK THE <span>CIPHER.</span></h2>
                    <p className="section-description">{cipherChallenges[cipherStage].description}</p>
                  </div>
                  <div className="timer-chip">
                    <Clock3 size={16} /> {cipherTimeLeft}s LEFT
                  </div>
                </div>

                <div className="game-hud">
                  <div><LockKeyhole size={17} /><strong>{cipherStage + 1}/3</strong><span>STAGE</span></div>
                  <div><Trophy size={17} /><strong>{cipherScore}</strong><span>SESSION XP</span></div>
                  <div><Activity size={17} /><strong>{cipherHintUsed ? 'USED' : 'READY'}</strong><span>HINT</span></div>
                </div>

                <div className="round-progress">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} className={index <= cipherStage ? 'round-active' : ''} />
                  ))}
                </div>

                <div className="puzzle-panel cipher-panel">
                  <div className="panel-top">
                    <span><Radio size={15} /> ENCRYPTED TRANSMISSION</span>
                    <span>CAESAR CIPHER</span>
                  </div>

                  <div className="cipher-stage-title">{cipherChallenges[cipherStage].title}</div>
                  <div className="cipher-message">{cipherChallenges[cipherStage].cipher}</div>

                  <p className="cipher-instruction">
                    The alphabet has been shifted forward. Decode the original message by reversing the shift.
                  </p>

                  <form
                    className="cipher-form"
                    onSubmit={(event) => {
                      event.preventDefault()
                      submitCipher()
                    }}
                  >
                    <label htmlFor="cipher-answer">YOUR DECRYPTED MESSAGE</label>
                    <input
                      id="cipher-answer"
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      value={cipherAnswer}
                      onChange={(event) => setCipherAnswer(event.target.value)}
                      placeholder="ENTER DECODED MESSAGE"
                      disabled={cipherStatus !== 'playing'}
                    />
                    <button className="primary-button" type="submit">
                      DECRYPT TRANSMISSION <ChevronRight size={17} />
                    </button>
                  </form>

                  <p className="puzzle-message"><Sparkles size={15} /> {cipherMessage}</p>

                  <div className="game-actions">
                    <button
                      className="hint-button"
                      onClick={useCipherHint}
                      disabled={cipherHintUsed || cipherStatus !== 'playing'}
                    >
                      <Lightbulb size={15} /> {cipherHintUsed ? 'HINT USED' : 'REVEAL SHIFT (-50 XP)'}
                    </button>
                    <span>STAGE: {cipherStage + 1}/3</span>
                    <span>TIME: {cipherTimeLeft}s</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="cipher-result">
                {cipherStatus === 'won' ? <Trophy size={58} /> : <RotateCcw size={58} />}
                <div className="eyebrow"><span /> {cipherStatus === 'won' ? 'TRANSMISSION DECRYPTED' : 'MISSION TERMINATED'}</div>
                <h2>{cipherStatus === 'won' ? <>ACCESS <span>GRANTED.</span></> : <>ACCESS <span>DENIED.</span></>}</h2>
                <p className="section-description">
                  {cipherStatus === 'won'
                    ? 'All three encrypted transmissions were successfully decoded.'
                    : 'The decryption window expired. N.E.U.R.O has secured the channel.'}
                </p>
                <div className="score-card">
                  <strong>{cipherStatus === 'won' ? `+${cipherScore} XP` : `${cipherScore} XP`}</strong>
                  <span>MISSION SCORE</span>
                </div>
                <p className="saved-xp">TOTAL PROFILE XP: {savedXP}</p>
                <button className="primary-button" onClick={() => setScreen('missions')}>
                  CONTINUE <ChevronRight size={18} />
                </button>
                <button className="back-button" onClick={startCodeBreaker}>
                  RETRY MISSION <RotateCcw size={14} />
                </button>
              </div>
            )}

            <button className="back-button" onClick={() => setScreen('missions')}>? BACK TO MISSIONS</button>
          </motion.section>
        )}

        {screen === 'logic' && (
          <motion.section
            key="logic"
            className="content-screen puzzle-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="eyebrow"><span /> MISSION 03 // LOGIC CORE</div>

            {logicStatus === 'playing' ? (
              <>
                <div className="puzzle-heading">
                  <div>
                    <h2>BREAK THE <span>LOGIC.</span></h2>
                    <p className="section-description">Think critically. Every answer unlocks another layer.</p>
                  </div>
                  <div className="timer-chip"><Clock3 size={16} /> {logicTimeLeft}s LEFT</div>
                </div>

                <div className="game-hud">
                  <div><Cpu size={17} /><strong>{logicStage + 1}/3</strong><span>STAGE</span></div>
                  <div><Trophy size={17} /><strong>{logicScore}</strong><span>SESSION XP</span></div>
                  <div><Activity size={17} /><strong>{logicHintUsed ? 'USED' : 'READY'}</strong><span>HINT</span></div>
                </div>

                <div className="round-progress">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} className={index <= logicStage ? 'round-active' : ''} />
                  ))}
                </div>

                <div className="puzzle-panel logic-panel">
                  <div className="panel-top">
                    <span><Cpu size={15} /> NEURAL REASONING</span>
                    <span>CHALLENGE {logicStage + 1}/3</span>
                  </div>

                  <div className="cipher-stage-title">{logicChallenges[logicStage].title}</div>
                  <p className="logic-question">{logicChallenges[logicStage].question}</p>

                  <div className="logic-options">
                    {logicChallenges[logicStage].options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`logic-option ${logicChoice === index ? 'logic-option-selected' : ''}`}
                        onClick={() => setLogicChoice(index)}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        {option}
                      </button>
                    ))}
                  </div>

                  <button
                    className="primary-button logic-submit"
                    type="button"
                    disabled={logicChoice === null}
                    onClick={submitLogic}
                  >
                    VERIFY SOLUTION <ChevronRight size={17} />
                  </button>

                  <p className="puzzle-message"><Sparkles size={15} /> {logicMessage}</p>

                  <div className="game-actions">
                    <button
                      className="hint-button"
                      type="button"
                      onClick={useLogicHint}
                      disabled={logicHintUsed}
                    >
                      <Lightbulb size={15} /> {logicHintUsed ? 'HINT USED' : 'REVEAL HINT (-50 XP)'}
                    </button>
                    <span>STAGE: {logicStage + 1}/3</span>
                    <span>TIME: {logicTimeLeft}s</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="cipher-result">
                {logicStatus === 'won' ? <Trophy size={58} /> : <RotateCcw size={58} />}
                <div className="eyebrow"><span /> {logicStatus === 'won' ? 'LOGIC CORE BREACHED' : 'MISSION TERMINATED'}</div>
                <h2>{logicStatus === 'won' ? <>ACCESS <span>GRANTED.</span></> : <>ACCESS <span>DENIED.</span></>}</h2>
                <p className="section-description">
                  {logicStatus === 'won'
                    ? 'All three reasoning challenges were successfully solved.'
                    : 'The logic core locked before you completed the challenges.'}
                </p>
                <div className="score-card">
                  <strong>{logicStatus === 'won' ? `+${logicScore} XP` : `${logicScore} XP`}</strong>
                  <span>MISSION SCORE</span>
                </div>
                <p className="saved-xp">TOTAL PROFILE XP: {savedXP}</p>
                <button className="primary-button" onClick={() => setScreen('missions')}>
                  CONTINUE <ChevronRight size={18} />
                </button>
                <button className="back-button" onClick={startLogic}>
                  RETRY MISSION <RotateCcw size={14} />
                </button>
              </div>
            )}

            <button className="back-button" onClick={() => setScreen('missions')}>? BACK TO MISSIONS</button>
          </motion.section>
        )}

        {screen === 'showdown' && (
          <motion.section
            key="showdown"
            className="content-screen puzzle-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="eyebrow"><span /> MISSION 04 // FINAL ENCOUNTER</div>

            {bossStatus === 'playing' ? (
              <>
                <div className="boss-identity">
                  <div className="boss-orb"><Zap size={42} /></div>
                  <div>
                    <div className="boss-name">N.E.U.R.O.</div>
                    <div className="boss-subtitle">NEURAL ENTITY // HOSTILE AI</div>
                    <div className="boss-health"><span style={{ width: `${((3 - bossStage) / 3) * 100}%` }} /></div>
                    <div className="boss-health-label">AI CONTROL: {3 - bossStage}/3 SECURITY LAYERS</div>
                  </div>
                </div>

                <div className="puzzle-heading">
                  <div>
                    <h2>DEFEAT THE <span>AI.</span></h2>
                    <p className="section-description">Outthink the system. Take control of the facility.</p>
                  </div>
                  <div className="timer-chip"><Clock3 size={16} /> {bossTimeLeft}s LEFT</div>
                </div>

                <div className="game-hud">
                  <div><Shield size={17} /><strong>{bossStage + 1}/3</strong><span>ROUND</span></div>
                  <div><Trophy size={17} /><strong>{bossScore}</strong><span>SESSION XP</span></div>
                  <div><Activity size={17} /><strong>{bossHintUsed ? 'USED' : 'READY'}</strong><span>HINT</span></div>
                </div>

                <div className="round-progress">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <span key={index} className={index <= bossStage ? 'round-active' : ''} />
                  ))}
                </div>

                <div className="puzzle-panel boss-panel">
                  <div className="panel-top">
                    <span><Radio size={15} /> ENCRYPTED AI TRANSMISSION</span>
                    <span>THREAT LEVEL: HIGH</span>
                  </div>

                  <div className="boss-dialogue">
                    <span>N.E.U.R.O.:</span>
                    "Human intelligence is limited. Prove that yours is different."
                  </div>

                  <div className="cipher-stage-title">{bossChallenges[bossStage].title}</div>
                  <p className="logic-question">{bossChallenges[bossStage].transmission}</p>

                  <div className="logic-options">
                    {bossChallenges[bossStage].options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`logic-option ${bossChoice === index ? 'logic-option-selected' : ''}`}
                        onClick={() => setBossChoice(index)}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        {option}
                      </button>
                    ))}
                  </div>

                  <button
                    className="primary-button logic-submit"
                    type="button"
                    disabled={bossChoice === null}
                    onClick={submitBossChoice}
                  >
                    EXECUTE COUNTERSTRATEGY <ChevronRight size={17} />
                  </button>

                  <p className="puzzle-message"><Sparkles size={15} /> {bossMessage}</p>

                  <div className="game-actions">
                    <button
                      className="hint-button"
                      type="button"
                      onClick={useBossHint}
                      disabled={bossHintUsed}
                    >
                      <Lightbulb size={15} /> {bossHintUsed ? 'HINT USED' : 'REQUEST INTEL (-50 XP)'}
                    </button>
                    <span>ROUND: {bossStage + 1}/3</span>
                    <span>TIME: {bossTimeLeft}s</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="cipher-result">
                {bossStatus === 'won' ? <Trophy size={58} /> : <RotateCcw size={58} />}
                <div className="eyebrow"><span /> {bossStatus === 'won' ? 'FINAL BOSS DEFEATED' : 'AI CONTROL RESTORED'}</div>
                <h2>{bossStatus === 'won' ? <>HUMANITY <span>WINS.</span></> : <>SYSTEM <span>LOCKED.</span></>}</h2>
                <p className="section-description">
                  {bossStatus === 'won'
                    ? 'N.E.U.R.O. has been neutralized. You escaped the intelligence-controlled facility.'
                    : 'N.E.U.R.O. regained control before you could finish the final encounter. Try again.'}
                </p>
                <div className="score-card">
                  <strong>{bossStatus === 'won' ? `+${bossScore} XP` : `${bossScore} XP`}</strong>
                  <span>FINAL MISSION SCORE</span>
                </div>
                <p className="saved-xp">TOTAL PROFILE XP: {savedXP}</p>
                <button className="primary-button" onClick={() => setScreen('missions')}>
                  RETURN TO MISSION CONTROL <ChevronRight size={18} />
                </button>
                <button className="back-button" onClick={startShowdown}>
                  RETRY FINAL ENCOUNTER <RotateCcw size={14} />
                </button>
              </div>
            )}

            <button className="back-button" onClick={() => setScreen('missions')}>? BACK TO MISSIONS</button>
          </motion.section>
        )}

        {screen === 'result' && (
          <motion.section key="result" className="content-screen result-screen" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
            {completed && phase === 'won' ? <Trophy size={58} /> : <RotateCcw size={58} />}
            <div className="eyebrow"><span /> {completed && phase === 'won' ? 'SECURITY LAYER BREACHED' : 'MISSION TERMINATED'}</div>
            <h2>{completed && phase === 'won' ? <>ACCESS <span>GRANTED.</span></> : <>ACCESS <span>DENIED.</span></>}</h2>
            <p className="section-description">
              {completed && phase === 'won'
                ? 'You successfully passed all three Memory Matrix rounds.'
                : 'N.E.U.R.O stopped your escape. Regroup and try again.'}
            </p>
            <div className="score-card"><strong>+{score} XP</strong><span>MISSION SCORE</span></div>
            <p className="saved-xp">TOTAL PROFILE XP: {savedXP}</p>
            <button className="primary-button" onClick={() => setScreen('missions')}>
              CONTINUE <ChevronRight size={18} />
            </button>
            <button className="back-button" onClick={startMemory}>RETRY MISSION <RotateCcw size={14} /></button>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="bottom-bar">
        <span><Activity size={14} /> NEURAL NETWORK: STABLE</span>
        <span><Gamepad2 size={14} /> THINK SMART. PLAY SMART. ESCAPE SMARTER.</span>
        <span><Zap size={14} /> POWERED BY INTELLIGENCE</span>
      </footer>
    </main>
  )
}

export default App







