'use client';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import {
  Camera,
  Upload,
  Accessibility,
  Volume2,
  Download,
  ArrowLeft,
  Plus,
  X,
  Heart,
  Pill,
  ScanLine,
  FileText,
  Check,
  Signal,
  BatteryFull,
  Play,
  ArrowUpRight,
  Contrast, UserRound, Pause, Square, Printer, Bookmark, Headphones, Columns2, BookOpen, type LucideIcon,
} from 'lucide-react';
import { createDemoResult } from '../lib/demo';
import { textExport, validateResult } from '../lib/analysis.mjs';
type Result = {
  source?: 'demo';
  summary?: string;
  name: string;
  original: string;
  date: string;
  sections: { title: string; text: string; evidence: string }[];
};
type Screen = 'home' | 'camera' | 'preview' | 'result';
function Action({ icon: Icon, label, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string }) {
  return <button type="button" {...props} className={'icon-action ' + className} aria-label={label} title={label}>
    <Icon aria-hidden /><span className="action-label">{label}</span>
  </button>;
}

function clickBloom(event: MouseEvent<HTMLDivElement>) {
  const control = event.target instanceof Element ? event.target.closest('button:enabled, summary, .guide-shortcut') : null;
  if (!control || event.currentTarget.dataset.motionPaused === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = control.getBoundingClientRect();
  const echo = document.createElement('span');
  echo.className = 'click-bloom';
  echo.setAttribute('aria-hidden', 'true');
  Object.assign(echo.style, { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px', borderRadius: getComputedStyle(control).borderRadius });
  (control.closest('dialog') ?? document.body).appendChild(echo);
  control.animate([
    { scale: '1', opacity: 1 }, { scale: '1.10', opacity: .12, offset: .55 }, { scale: '1', opacity: 1 },
  ], { duration: 270, easing: 'ease-out' });
  echo.animate([{ transform: 'scale(.86)', opacity: .66 }, { transform: 'scale(1.58)', opacity: 0 }], { duration: 340, easing: 'cubic-bezier(.16,1,.3,1)' }).finished.then(() => echo.remove());
}
export default function App() {
  const [screen, setScreen] = useState<Screen>('home'),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState(''),
    [result, setResult] = useState<Result | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [access, setAccess] = useState(false),
    [contrast, setContrast] = useState(false),
    [pauseMotion, setPauseMotion] = useState(false),
    [scale, setScale] = useState(100),
    [view, setView] = useState('simple'),
    [account, setAccount] = useState(false),
    [prefReady, setPrefReady] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    controller = useRef<AbortController | null>(null),
    pendingNavigation = useRef<number | undefined>(undefined),
    bar = useRef<HTMLElement>(null),
    main = useRef<HTMLElement>(null);
  usePageMotion(pauseMotion || !prefReady, screen, bar);
  useEffect(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem('bulaclara-preferences') || '{}',
      );
      setScale(Math.min(150, Math.max(90, Number(p.scale) || 100)));
      setContrast(p.contrast === true);
      setPauseMotion(p.pauseMotion === true);
    } catch {}
    setPrefReady(true);
    return () => {
      window.clearTimeout(pendingNavigation.current);
      controller.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
    if (prefReady)
      try {
        localStorage.setItem(
          'bulaclara-preferences',
          JSON.stringify({ scale, contrast, pauseMotion }),
        );
      } catch {}
  }, [scale, contrast, pauseMotion, prefReady]);
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    main.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen]);
  async function selectImage(selected: File) {
    setError('');
    if (
      selected.size > 5 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)
    ) {
      setError('Escolha uma imagem JPEG, PNG ou WebP de até 5 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(selected);
      const valid =
        bitmap.width >= 200 &&
        bitmap.height >= 200 &&
        bitmap.width * bitmap.height <= 32000000;
      bitmap.close();
      if (!valid) throw Error();
      setFile(selected);
      setResult(null);
      setScreen('preview');
    } catch {
      setError(
        'Imagem corrompida, pequena demais ou muito grande. Escolha outra foto.',
      );
    }
  }
  function clear() {
    controller.current?.abort();
    controller.current = null;
    window.speechSynthesis?.cancel();
    setBusy(false);
    setFile(null);
    setResult(null);
    setError('');
    setView('simple');
    setScreen('home');
  }
  async function analyze() {
    if (!file || busy) return;
    setError('');
    setBusy(true);
    const active = new AbortController();
    controller.current = active;
    try {
      const body = new FormData();
      body.append('image', file);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body,
        signal: active.signal,
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw Error(data.error || 'Não foi possível analisar.');
      if (controller.current !== active) return;
      setResult(validateResult(data));
      setScreen('result');
    } catch (e) {
      if (!active.signal.aborted)
        setError(e instanceof Error ? e.message : 'Erro de conexão.');
    } finally {
      if (controller.current === active) {
        setBusy(false);
        controller.current = null;
      }
    }
  }
  function showDemo() {
    setFile(null);
    setError('');
    setView('simple');
    setResult(createDemoResult());
    setScreen('result');
  }
  function afterPress(action: () => void) {
    if (pauseMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) action();
    else pendingNavigation.current = window.setTimeout(action, 140);
  }
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(
      new Blob([textExport(result)], { type: 'text/plain;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulaclara.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const photoActions = (
    <div className="photo-actions">
      <Action icon={Camera} label="Tirar foto" className="primary" onClick={() => afterPress(() => { setError(''); setScreen('camera'); })} />
      <Action icon={Upload} label="Enviar imagem" onClick={() => input.current?.click()} />
    </div>
  );
  return (
    <div className={contrast ? 'application high-contrast' : 'application'} data-motion-paused={pauseMotion || !prefReady}
      onClickCapture={event => { window.clearTimeout(pendingNavigation.current); clickBloom(event); }}>
      <a className="skip-link" href="#content">
        Pular para conteúdo
      </a>
      <header className="topbar" ref={bar}>
        <button
          className="brand"
          onClick={clear}
          aria-label="BulaClara — início"
        >
          <img src="/image1.png" alt="BulaClara" />
        </button>
        {screen === 'home' && <a className="guide-shortcut" href="#como-funciona">Como funciona</a>}
        <nav aria-label="Preferências e conta">
          <Action icon={Contrast} label="Contraste" aria-pressed={contrast} onClick={() => setContrast(!contrast)} />
          <Action icon={Accessibility} label="Acessibilidade" aria-expanded={access} onClick={() => setAccess(!access)} />
          <Action icon={UserRound} label="Entrar" onClick={() => afterPress(() => setAccount(true))} />
        </nav>
      </header>
      {access && (
        <section className="accessibility" aria-label="Acessibilidade">
          <button
            disabled={scale <= 90}
            onClick={() => setScale(Math.max(90, scale - 10))}
          >
            A− Diminuir texto
          </button>
          <output>{scale}%</output>
          <button
            disabled={scale >= 150}
            onClick={() => setScale(Math.min(150, scale + 10))}
          >
            A+ Aumentar texto
          </button>
          <button
            aria-pressed={pauseMotion}
            onClick={() => setPauseMotion(!pauseMotion)}
          >
            Pausar animações
          </button>
          <button
            onClick={() => {
              setScale(100);
              setContrast(false);
              setPauseMotion(false);
            }}
          >
            Restaurar
          </button>
        </section>
      )}
      <main id="content" ref={main} tabIndex={-1} className="content">
        <input
          className="visually-hidden"
          tabIndex={-1}
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void selectImage(f);
            e.target.value = '';
          }}
        />
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {screen === 'home' && (
          <>
            <section className="intro">
              <Starfield />
              <svg className="sky-horizon" viewBox="0 0 1440 230" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 58C72 16 163 47 182 107C239 85 300 113 321 151C375 143 432 168 449 209C524 203 571 216 604 230H0ZM1440 8C1338 -5 1285 50 1274 98C1217 74 1162 105 1143 143C1068 131 1007 171 998 201C920 193 861 212 834 230H1440Z" fill="currentColor" />
              </svg>
              <div className="intro-copy">
              <h1 aria-label="Sua bula, em palavras mais claras.">
                <OpeningText text="Sua bula," /> <span className="headline-symbol" aria-hidden="true"><FileText /></span>
                <br />
                <OpeningText text="em palavras mais claras." start={9} />
              </h1>
              <p>
                Envie uma foto para ler ou ouvir sua bula.
              </p>
              {photoActions}
              <button className="demo-link" onClick={() => afterPress(showDemo)}>
                Analisar bula (teste) <ArrowUpRight aria-hidden />
              </button>
              </div>
              <HeroPhone paused={pauseMotion} />
            </section>
            <ReadingSteps paused={pauseMotion} />
            <section className="send-bula" aria-labelledby="send-title">
              <h2 id="send-title">Sua vez.</h2>
              <p>Escolha uma foto da sua bula.</p>
              {photoActions}
              {error && <p className="error">{error}</p>}
            </section>
          </>
        )}
        {screen === 'camera' && (
          <CameraView
            cancel={() => setScreen(file ? 'preview' : 'home')}
            upload={() => input.current?.click()}
            capture={selectImage}
          />
        )}
        {screen === 'preview' && (
          <>
            <Action icon={ArrowLeft} label="Voltar ao início" onClick={clear} />
            <h1>Confira sua imagem</h1>
            <p>
              O texto está nítido e completo? Você pode substituir a foto antes
              da análise.
            </p>
            {preview && (
              <img
                className="preview"
                src={preview}
                alt="Imagem da bula selecionada para análise"
              />
            )}
            <div className="actions">
              <Action icon={Upload} label="Substituir imagem" disabled={busy} onClick={() => input.current?.click()} />
              <Action icon={X} label="Remover"
                disabled={busy}
                onClick={() => {
                  setFile(null);
                  setScreen('home');
                }}
              />
              <button
                className="primary"
                disabled={busy || !file}
                onClick={analyze}
              >
                {busy ? 'Analisando imagem…' : 'Analisar bula'}
              </button>
              <button disabled={busy} onClick={() => afterPress(showDemo)}>Analisar bula (teste) <ArrowUpRight aria-hidden /></button>
              {busy && (
                <button
                  onClick={() => {
                    controller.current?.abort();
                    controller.current = null;
                    setBusy(false);
                  }}
                >
                  Cancelar análise
                </button>
              )}
            </div>
            <p className="notice">
              Ao analisar, a imagem será enviada ao serviço Google Gemini para
              extração e simplificação. Evite incluir nome, receita ou outros
              dados pessoais.
            </p>
            {busy && (
              <p role="status">Lendo a imagem. Aguarde; você pode cancelar.</p>
            )}
          </>
        )}
        {screen === 'result' && result && (
          <section className="result-sheet" aria-label="Leitura da bula">
            <div className="result-heading">
              <div>
                <p className="eyebrow">{result.source === 'demo' ? 'Demonstração · bula fictícia' : 'Informações da imagem enviada'}</p>
                <h1>{result.name}</h1>
              </div>
              <Action className="no-print" icon={Plus} label="Nova consulta" onClick={clear} />
            </div>
            <article className="reading-summary">
              <h2><BookOpen aria-hidden="true" size={21} />{result.summary ? 'Resumo da bula' : 'Para que serve'}</h2>
              {(result.summary || result.sections.find(s => s.title === 'Para que serve')?.text || 'Informação não identificada na imagem enviada.')
                .split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </article>
            <div className="result-tools no-print">
              <Audio text={textExport(result)} />
              <details className="export-menu">
                <summary>Salvar</summary>
                <div className="actions">
                  <Action icon={Download} label="Baixar TXT" onClick={download} />
                  <Action icon={Printer} label="Salvar PDF" onClick={() => window.print()} />
                  {result.source !== 'demo' && <>
                    <Action icon={Headphones} label="Baixar MP3" onClick={() => setError('MP3 indisponível: o serviço de geração de áudio ainda precisa ser configurado.')} />
                    <Action icon={Bookmark} label="Salvar no histórico" onClick={() => setAccount(true)} />
                  </>}
                </div>
              </details>
            </div>
            <div className="reading-options">
            <h2 className="detail-heading">{view === 'simple' ? 'A bula por assunto' : view === 'original' ? 'Texto original' : 'Comparação de trechos'}</h2>
            <div className="tabs" aria-label="Modo de leitura">
              {[
                ['simple', 'Simplificado'],
                ['original', 'Original'],
                ['compare', 'Comparar'],
              ].map(([id, label]) => (
                <Action label={label} icon={id === 'simple' ? BookOpen : id === 'original' ? FileText : Columns2}
                  aria-pressed={view === id}
                  key={id}
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setView(id);
                  }}
                />
              ))}
            </div>
            </div>
            {view === 'original' ? (
              <article className="original">
                <h2>{result.source === 'demo' ? 'Texto da bula fictícia' : 'Texto original extraído'}</h2>
                <p>{result.original}</p>
              </article>
            ) : (
              <div className="sections">
                {result.sections.map((s, index) => (
                  <details name="bula-assuntos" key={view + s.title}>
                    <summary><span className="topic-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{s.title}</summary>
                    <p>{s.text}</p>
                    {view === 'compare' && (
                      <blockquote>
                        <b>Trecho original</b>
                        <p>
                          {s.evidence || 'Não identificado na imagem enviada'}
                        </p>
                      </blockquote>
                    )}
                    <Audio text={s.text} />
                  </details>
                ))}
              </div>
            )}
          </section>
        )}
        <aside className="disclaimer">
          Informações para facilitar a leitura. Não substituem a bula integral
          nem a orientação de um médico ou farmacêutico.
        </aside>
      </main>
      <footer>BulaClara · Informação acessível, no seu ritmo.</footer>
      {account && <Account close={() => setAccount(false)} />}
    </div>
  );
}
function OpeningText({ text, start = 0 }: { text: string; start?: number }) {
  let delay = start;
  return <span aria-hidden="true">{text.split(' ').map((word, index) => (
    <span key={word}>{index > 0 && ' '}<span className="title-word">{Array.from(word, letter =>
      <span key={delay} className="title-letter" style={{ animationDelay: (delay++ * 24) + 'ms' }}>{letter}</span>
    )}</span></span>
  ))}</span>;
}

function usePageMotion(paused: boolean, screen: Screen, bar: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (paused) return;
    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const header = bar.current;
    let frame = 0;
    let destination = window.scrollY;
    let last = 0;
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    function updateBar() {
      const progress = motion.matches && screen === 'home' ? Math.min(1, Math.max(0, (window.scrollY - 35) / 300)) : 0;
      header?.style.setProperty('--bar-exit', String(progress));
    }
    function glide(time: number) {
      const remaining = destination - window.scrollY;
      const blend = 1 - Math.exp(-Math.max(8, Math.min(50, time - last)) / 115);
      last = time;
      if (Math.abs(remaining) < 2) {
        window.scrollTo({ top: destination, behavior: 'instant' });
        frame = 0;
        return;
      }
      const step = Math.sign(remaining) * Math.max(1, Math.abs(remaining) * blend);
      window.scrollTo({ top: window.scrollY + step, behavior: 'instant' });
      frame = requestAnimationFrame(glide);
    }
    function wheel(event: WheelEvent) {
      // Leave pinch zoom, fine trackpad gestures and nested controls to the browser.
      if (!motion.matches || event.ctrlKey || event.shiftKey || !event.cancelable ||
          event.deltaX || (event.deltaMode === 0 && Math.abs(event.deltaY) < 45) ||
          !(event.target instanceof Element) || event.target.closest('dialog, select, textarea, [role="listbox"]')) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      destination = Math.max(0, Math.min(max, (frame ? destination : window.scrollY) + event.deltaY * unit * .82));
      event.preventDefault();
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(glide); }
    }
    function preferenceChanged() { stop(); updateBar(); }
    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('pointerdown', stop);
    window.addEventListener('keydown', stop);
    motion.addEventListener('change', preferenceChanged);
    updateBar();
    return () => {
      stop();
      window.removeEventListener('scroll', updateBar);
      window.removeEventListener('wheel', wheel);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
      motion.removeEventListener('change', preferenceChanged);
      header?.style.removeProperty('--bar-exit');
    };
  }, [paused, screen, bar]);
}

const readingSteps = [
  { title: 'Fotografe', body: 'Enquadre uma página por vez.', icon: Camera },
  { title: 'Confira', body: 'Veja se o texto está nítido.', icon: ScanLine },
  { title: 'Ouça', body: 'Escute no seu ritmo ou leia o resumo.', icon: Volume2 },
];

function ReadingSteps({ paused }: { paused: boolean }) {
  const guide = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = guide.current;
    if (!section || paused) return;
    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const scenes = Array.from(section.querySelectorAll<HTMLElement>('.word-scene')).map(scene => ({
      scene, letters: Array.from(scene.querySelectorAll<HTMLElement>('.story-letter')),
    }));
    let frame = 0;
    function paint() {
      frame = 0;
      for (const { scene, letters } of scenes) {
        const rect = scene.getBoundingClientRect();
        const position = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
        const distance = Math.min(1, Math.max(0, (Math.abs(position) - .13) / .62));
        const direction = Math.sign(position);
        scene.style.setProperty('--travel', String(distance * direction));
        letters.forEach((letter, i) => {
          const phase = i / Math.max(1, letters.length - 1);
          const wave = Math.min(1, distance * (1.25 + phase * .8));
          const offset = wave * direction * (32 + 68 * (.5 + .5 * Math.sin(i * 1.56)));
          letter.style.transform = 'translateY(' + offset.toFixed(2) + '%) rotate(' + (wave * Math.sin(i * 1.6) * 19).toFixed(2) + 'deg)';
        });
      }
    }
    function queue() { if (motion.matches && !frame) frame = requestAnimationFrame(paint); }
    function refresh() {
      section?.toggleAttribute('data-wave', motion.matches);
      queue();
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    motion.addEventListener('change', refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      motion.removeEventListener('change', refresh);
      section.removeAttribute('data-wave');
    };
  }, [paused]);
  return (
    <section ref={guide} id="como-funciona" className="reading-guide" aria-label="Como funciona">
      {readingSteps.map(({ title, body, icon: Icon }, index) => (
        <article key={title} className="word-scene">
          <div className="word-stage">
            <p className="scene-number">Como funciona <span>0{index + 1} / 03</span></p>
            <div className="word-lockup">
              <span className="word-orbit" aria-hidden="true"><Icon /></span>
              <h2 aria-label={title}>{Array.from(title, (letter, i) => <span key={i} aria-hidden="true" className="story-letter">{letter}</span>)}</h2>
            </div>
            <p className="scene-caption">{body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

// Stable on server and client so the sky stays in place during hydration.
const sky = Array.from({ length: 74 }, (_, i) => {
  const noise = (salt: number) => {
    const n = Math.sin((i + 1) * 71.37 + salt * 39.17) * 43758.5453;
    return n - Math.floor(n);
  };
  return {
    left: (noise(1) * 100).toFixed(2) + '%',
    top: (noise(2) * 100).toFixed(2) + '%',
    width: (2.3 + noise(3) * 2.1).toFixed(2) + 'px',
    animationDuration: (4 + noise(4) * 9).toFixed(2) + 's, ' + (17 + noise(8) * 16).toFixed(2) + 's',
    animationDelay: (-noise(5) * 20).toFixed(2) + 's, ' + (-noise(9) * 33).toFixed(2) + 's',
    '--star-brightness': (.32 + noise(10) * .38).toFixed(2),
    '--star-size': (11 + noise(11) * 3).toFixed(2) + 'px',
    '--drift-x': (noise(6) * 22 - 11).toFixed(1) + 'px',
    '--drift-y': (-4 - noise(7) * 12).toFixed(1) + 'px',
  } as CSSProperties;
});
function Starfield() {
  return <div className="starfield" aria-hidden="true">{sky.map((style, i) => <i key={i} style={style} />)}</div>;
}

const phoneTips = [
  { id: 'heart', icon: Heart, label: 'Cuidados', text: 'Encontre os cuidados descritos na bula.' },
  { id: 'camera', icon: Camera, label: 'Foto', text: 'Fotografe uma página bem iluminada por vez.' },
  { id: 'audio', icon: Volume2, label: 'Áudio', text: 'Ouça o texto na velocidade que preferir.' },
  { id: 'pill', icon: Pill, label: 'Leitura', text: 'Compare a versão simples com o trecho original.' },
];

function HeroPhone({ paused }: { paused: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = hovered ?? focused ?? selected;
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (paused || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const scene = event.currentTarget;
    const bounds = scene.getBoundingClientRect();
    scene.style.setProperty('--tilt-y', ((event.clientX - bounds.left) / bounds.width * 8 - 4).toFixed(2) + 'deg');
    scene.style.setProperty('--tilt-x', (4 - (event.clientY - bounds.top) / bounds.height * 8).toFixed(2) + 'deg');
  }
  function resetTilt(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty('--tilt-x');
    event.currentTarget.style.removeProperty('--tilt-y');
  }
  return (
    <div className="phone-scene" onPointerMove={tilt} onPointerLeave={resetTilt} role="group" aria-label="Explore os recursos do BulaClara">
      <div className="phone-art">
        {phoneTips.map(({ id, icon: Icon, label, text }, i) => (
          <button key={id} type="button" className={'floating-icon float-' + id}
            aria-label={label + ': ' + text} aria-pressed={selected === i}
            onPointerEnter={e => { if (e.pointerType === 'mouse') setHovered(i); }}
            onPointerLeave={() => setHovered(null)} onFocus={() => setFocused(i)} onBlur={() => setFocused(null)}
            onClick={() => { setSelected(selected === i ? null : i); setFocused(null); setHovered(null); }}
            onKeyDown={e => { if (e.key === 'Escape') { setSelected(null); setHovered(null); setFocused(null); } }}>
            <Icon aria-hidden />
          </button>
        ))}
        <div className="phone-device" role="img" aria-label="Prévia ilustrativa de uma bula organizada no celular">
          <div className="phone-screen">
            <div className="phone-status"><b>9:41</b><span><Signal /><BatteryFull /></span></div>
            <div className="phone-island" />
            <div className="phone-appbar"><img src="/image1.png" alt="" /><Accessibility /></div>
            <div className="phone-body">
              <span className="phone-tag"><Check /> Leitura organizada</span>
              <h2>Sua bula.<br />Mais simples.</h2>
              <div className="phone-document"><div className="document-heading"><FileText /><span>Informações da bula<small>Uma leitura por vez</small></span></div><div className="document-lines"><i /><i /><i /></div><ScanLine className="scan-corner" /></div>
              <div className="phone-section"><span><Pill /></span><div><b>Para que serve</b><i /><i /></div></div>
              <div className="phone-section"><span><Heart /></span><div><b>Cuidados importantes</b><i /><i /></div></div>
              <div className="phone-player"><span><Play /></span><div><b>Ouça no seu ritmo</b><div className="waveform">{[8,16,24,12,30,20,12,26,16,8,22,30,18,10,24,14].map((height,i)=><i key={i} style={{height}} />)}</div></div></div>
              <p className="phone-caption">Prévia ilustrativa</p>
            </div>
            <div className="phone-homebar" />
          </div>
        </div>
      </div>
      {active !== null && <div className="phone-tip"><b>{phoneTips[active].label}</b> {phoneTips[active].text}</div>}
    </div>
  );
}

function CameraView({
  cancel,
  upload,
  capture,
}: {
  cancel: () => void;
  upload: () => void;
  capture: (f: File) => Promise<void>;
}) {
  const video = useRef<HTMLVideoElement>(null),
    stream = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw Error(
            'Câmera indisponível. Use HTTPS e um navegador compatível, ou envie uma imagem.',
          );
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
          },
          audio: false,
        });
        if (!alive) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream.current = s;
        if (video.current) {
          video.current.srcObject = s;
          await video.current.play();
          setReady(true);
        }
      } catch (e) {
        if (alive)
          setError(
            e instanceof Error && e.name === 'NotAllowedError'
              ? 'Permissão da câmera negada. Autorize nas configurações do navegador ou envie uma imagem.'
              : e instanceof Error
                ? e.message
                : 'Não foi possível abrir a câmera.',
          );
      }
    }
    void start();
    return () => {
      alive = false;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  function take() {
    const v = video.current;
    if (!v?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext('2d')?.drawImage(v, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob)
          void capture(
            new File([blob], 'foto-bula.jpg', { type: 'image/jpeg' }),
          );
      },
      'image/jpeg',
      0.92,
    );
  }
  return (
    <section>
      <h1>Fotografe sua bula</h1>
      <p>Mantenha o texto inteiro dentro da imagem e evite sombras.</p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <video
        className="camera"
        ref={video}
        muted
        playsInline
        aria-label="Visualização da câmera"
      />
      <div className="actions">
        <Action icon={ArrowLeft} label="Cancelar" onClick={cancel} />
        <Action icon={Upload} label="Enviar imagem" onClick={upload} />
        <Action icon={Camera} label="Capturar foto" className="primary" disabled={!ready} onClick={take} />
      </div>
    </section>
  );
}
function Audio({ text }: { text: string }) {
  const [state, setState] = useState('idle'),
    [rate, setRate] = useState('1'),
    [supported, setSupported] = useState(false);
  const speech = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => {
      if (speech.current) {
        speech.current.onend = null;
        speech.current.onerror = null;
        window.speechSynthesis?.cancel();
      }
    };
  }, []);
  function stop() {
    window.speechSynthesis.cancel();
    speech.current = null;
    setState('idle');
  }
  function play() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    speech.current = utterance;
    utterance.lang = 'pt-BR';
    utterance.rate = Number(rate);
    utterance.voice =
      window.speechSynthesis.getVoices().find((v) => v.lang === 'pt-BR') ||
      null;
    utterance.onstart = () => setState('playing');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div className="audio no-print">
      <Action icon={Volume2} label="Ouvir" disabled={!supported} onClick={play} />
      {state !== 'idle' && <><Action
        icon={state === 'paused' ? Play : Pause} label={state === 'paused' ? 'Retomar' : 'Pausar'}
        onClick={() => {
          if (state === 'paused') {
            window.speechSynthesis.resume();
            setState('playing');
          } else {
            window.speechSynthesis.pause();
            setState('paused');
          }
        }}
      />
      <Action icon={Square} label="Parar" onClick={stop} /></>}
      <label>
        <span className="visually-hidden">Velocidade</span>
        <select
          value={rate}
          onChange={(e) => {
            setRate(e.target.value);
            stop();
          }}
        >
          {['0.75', '1', '1.25', '1.5'].map((r) => (
            <option key={r} value={r}>{r.replace('.', ',')}×</option>
          ))}
        </select>
      </label>
      {!supported && (
        <small>Leitura em voz não disponível neste navegador.</small>
      )}
    </div>
  );
}
function Account({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog className="account" ref={dialog} onCancel={close}>
      <h2>Sua conta é opcional</h2>
      <p>
        O histórico em nuvem ainda não está disponível. Você pode continuar a
        consulta sem cadastro.
      </p>
      <button className="primary" onClick={close}>
        Continuar sem conta
      </button>
    </dialog>
  );
}
