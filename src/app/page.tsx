'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { kanaToRomaji } from '@/lib/kana';
import { speakJapanese } from '@/lib/audio';
import defaultVocab from '@/data/n5_vocab.json';
import { BASIC_KANA, DAKUON_KANA, YOON_KANA, KanaRow } from '@/data/kanaChart';
import { 
  BookOpen, Plus, List, Brain, Search, Trash2, Edit2, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, FolderPlus, Check, X, RotateCcw,
  Trophy, ArrowRight, Volume2, VolumeX, Grid, Table, Menu, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

export interface Folder {
  id: string;
  name: string;
}

export interface Word {
  id: string;
  folder_id?: string | null;
  folder?: string | null;
  jp: string;
  romaji: string;
  vi: string;
}

export default function Home() {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  // Sidebar Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'quiz' | 'kana'>('add');
  const [words, setWords] = useState<Word[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<{ mode: 'supabase' | 'local'; message: string }>({
    mode: 'local',
    message: 'Đang kết nối...'
  });

  // Form state
  const [inJp, setInJp] = useState('');
  const [inRomaji, setInRomaji] = useState('');
  const [inVi, setInVi] = useState('');
  const [inFolderId, setInFolderId] = useState('');
  const [jpHint, setJpHint] = useState('');
  const [isAutoLookingUp, setIsAutoLookingUp] = useState(false);

  // Folder management state
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  // Quiz Deck State
  const [quizMode, setQuizMode] = useState<'jp2romaji' | 'romaji2jp' | 'match'>('jp2romaji');
  const [quizFolderId, setQuizFolderId] = useState<string>('all');
  const [quizDeck, setQuizDeck] = useState<Word[]>([]);
  const [quizTotalCount, setQuizTotalCount] = useState<number>(0);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [currentQuizCard, setCurrentQuizCard] = useState<Word | null>(null);
  const [quizCompletedDeck, setQuizCompletedDeck] = useState<boolean>(false);
  const [quizInput, setQuizInput] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'ok' | 'no'; msg: string } | null>(null);
  const [romaji2JpBuilt, setRomaji2JpBuilt] = useState('');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  // Match Game state
  const [matchPool, setMatchPool] = useState<Word[]>([]);
  const [matchTiles, setMatchTiles] = useState<{ id: string; type: 'jp' | 'vi'; text: string }[]>([]);
  const [matchSelected, setMatchSelected] = useState<number[]>([]);
  const [matchWrong, setMatchWrong] = useState<number[]>([]);
  const [matchSolved, setMatchSolved] = useState<Set<number>>(new Set());
  const [matchCompletedRound, setMatchCompletedRound] = useState(false);
  const [matchCompletedAll, setMatchCompletedAll] = useState(false);

  // Kana Chart View State
  const [kanaScript, setKanaScript] = useState<'hira' | 'kata' | 'both'>('hira');
  const [kanaSection, setKanaSection] = useState<'basic' | 'dakuon' | 'yoon'>('basic');

  // -------------------------------------------------------------
  // Load data from Supabase (fallback to Local JSON/LocalStorage)
  // -------------------------------------------------------------
  const fetchData = async () => {
    try {
      const { data: fData, error: fError } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
      const { data: wData, error: wError } = await supabase.from('words').select('*').order('created_at', { ascending: false });

      if (fError || wError) {
        throw new Error(fError?.message || wError?.message || 'Lỗi truy vấn Supabase');
      }

      setFolders(fData || []);
      setWords(wData || []);
      setSyncStatus({ mode: 'supabase', message: 'Cloud Sync' });
    } catch (err: any) {
      console.warn('Fallback to Local due to Supabase:', err?.message);
      loadLocalBackup();
    }
  };

  const loadLocalBackup = () => {
    try {
      const stored = localStorage.getItem('wago-vocab-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.words && parsed.words.length > 0) {
          setWords(parsed.words);
          const formattedFolders = (parsed.folders || []).map((f: any) => 
            typeof f === 'string' ? { id: f, name: f } : f
          );
          setFolders(formattedFolders);
          setSyncStatus({ mode: 'local', message: 'Local Mode' });
          return;
        }
      }
    } catch (e) {
      console.error('Lỗi đọc localStorage:', e);
    }

    const defaultFolder: Folder = { id: 'n5-folder', name: 'N5' };
    const defaultWords: Word[] = (defaultVocab.words || []).map(w => ({
      id: String(w.id),
      jp: w.jp,
      romaji: w.romaji,
      vi: w.vi,
      folder_id: defaultFolder.id
    }));

    setFolders([defaultFolder]);
    setWords(defaultWords);
    setSyncStatus({ mode: 'local', message: `${defaultWords.length} từ N5` });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveLocalBackup = (newWords: Word[], newFolders: Folder[]) => {
    try {
      localStorage.setItem('wago-vocab-data', JSON.stringify({ words: newWords, folders: newFolders }));
    } catch (e) {
      console.error('Lỗi lưu localStorage backup:', e);
    }
  };

  // -------------------------------------------------------------
  // Add Word & Auto Lookup
  // -------------------------------------------------------------
  const handleJpChange = (val: string) => {
    setInJp(val);
    if (!val.trim()) {
      setJpHint('');
      setInRomaji('');
      return;
    }
    const { romaji, unknown } = kanaToRomaji(val.trim());
    setInRomaji(romaji);
    if (unknown) {
      setJpHint('Từ chứa Kanji — nhấn nút "Tra tự động" để tự lấy nghĩa tiếng Việt và Romaji.');
    } else {
      setJpHint('');
    }
  };

  const handleAutoLookup = async () => {
    if (!inJp.trim()) return;
    setIsAutoLookingUp(true);
    try {
      const res = await fetch(`/api/lookup?keyword=${encodeURIComponent(inJp.trim())}`);
      const data = await res.json();
      if (res.ok) {
        if (data.romaji) setInRomaji(data.romaji);
        if (data.meaning) setInVi(data.meaning);
        setJpHint(`Tra cứu thành công!`);
        speakJapanese(inJp.trim());
      }
    } catch (err) {
      console.error('Auto lookup error:', err);
    } finally {
      setIsAutoLookingUp(false);
    }
  };

  const handleSaveWord = async () => {
    const jp = inJp.trim();
    const romaji = inRomaji.trim();
    const vi = inVi.trim();
    const folder_id = inFolderId || null;

    if (!jp || !romaji || !vi) {
      setJpHint('Vui lòng điền đầy đủ từ tiếng Nhật, Romaji và nghĩa tiếng Việt.');
      return;
    }

    const newWord: Word = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      jp, romaji, vi, folder_id
    };

    const updatedWords = [newWord, ...words];
    setWords(updatedWords);
    saveLocalBackup(updatedWords, folders);

    if (syncStatus.mode === 'supabase') {
      try {
        await supabase.from('words').insert([{
          id: newWord.id,
          jp: newWord.jp,
          romaji: newWord.romaji,
          vi: newWord.vi,
          folder_id: newWord.folder_id
        }]);
      } catch (e) {
        console.error('Lỗi lưu từ vào Supabase:', e);
      }
    }

    setInJp(''); setInRomaji(''); setInVi(''); setJpHint('');
    setActiveTab('list');
  };

  const handleDeleteWord = async (id: string) => {
    const updatedWords = words.filter(w => w.id !== id);
    setWords(updatedWords);
    saveLocalBackup(updatedWords, folders);

    if (syncStatus.mode === 'supabase') {
      await supabase.from('words').delete().eq('id', id);
    }
  };

  const handleChangeWordFolder = async (wordId: string, newFolderId: string) => {
    const folder_id = newFolderId || null;
    const updatedWords = words.map(w => w.id === wordId ? { ...w, folder_id } : w);
    setWords(updatedWords);
    saveLocalBackup(updatedWords, folders);

    if (syncStatus.mode === 'supabase') {
      await supabase.from('words').update({ folder_id }).eq('id', wordId);
    }
  };

  // -------------------------------------------------------------
  // Folder Management
  // -------------------------------------------------------------
  const handleAddFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;

    const newFolder: Folder = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    setNewFolderName('');
    saveLocalBackup(words, updatedFolders);

    if (syncStatus.mode === 'supabase') {
      await supabase.from('folders').insert([{ id: newFolder.id, name: newFolder.name }]);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    const updatedWords = words.map(w => w.folder_id === folderId ? { ...w, folder_id: null } : w);
    setFolders(updatedFolders);
    setWords(updatedWords);
    if (activeFolder === folderId) setActiveFolder('all');
    saveLocalBackup(updatedWords, updatedFolders);

    if (syncStatus.mode === 'supabase') {
      await supabase.from('folders').delete().eq('id', folderId);
    }
  };

  const handleRenameFolderCommit = async (folderId: string) => {
    const newName = renameInputValue.trim();
    setRenamingFolderId(null);
    if (!newName) return;

    const updatedFolders = folders.map(f => f.id === folderId ? { ...f, name: newName } : f);
    setFolders(updatedFolders);
    saveLocalBackup(words, updatedFolders);

    if (syncStatus.mode === 'supabase') {
      await supabase.from('folders').update({ name: newName }).eq('id', folderId);
    }
  };

  // -------------------------------------------------------------
  // QUIZ DECK ENGINE
  // -------------------------------------------------------------
  const filteredWords = words.filter(w => {
    if (quizFolderId === 'all') return true;
    return w.folder_id === quizFolderId;
  });

  const initDeck = () => {
    setQuizFeedback(null);
    setQuizInput('');
    setRomaji2JpBuilt('');
    setQuizCompletedDeck(false);

    if (quizMode === 'match') {
      initMatchGame();
      return;
    }

    let pool = filteredWords;
    if (quizMode === 'romaji2jp') {
      pool = filteredWords.filter(w => !kanaToRomaji(w.jp).unknown);
    }

    if (pool.length === 0) {
      setQuizDeck([]);
      setQuizTotalCount(0);
      setQuizCurrentIndex(0);
      setCurrentQuizCard(null);
      setQuizCompletedDeck(true);
      return;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuizDeck(shuffled);
    setQuizTotalCount(shuffled.length);
    setQuizCurrentIndex(1);
    setCurrentQuizCard(shuffled[0]);

    if (autoSpeak && shuffled[0]?.jp) {
      speakJapanese(shuffled[0].jp);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      initDeck();
    }
  }, [activeTab, quizMode, quizFolderId, words]);

  const advanceCard = () => {
    if (quizDeck.length <= 1) {
      setQuizDeck([]);
      setCurrentQuizCard(null);
      setQuizCompletedDeck(true);
    } else {
      const nextDeck = quizDeck.slice(1);
      setQuizDeck(nextDeck);
      setCurrentQuizCard(nextDeck[0]);
      setQuizCurrentIndex(prev => prev + 1);

      if (autoSpeak && nextDeck[0]?.jp) {
        speakJapanese(nextDeck[0].jp);
      }
    }
    setQuizFeedback(null);
    setQuizInput('');
    setRomaji2JpBuilt('');
  };

  const handleGrade = (ok: boolean) => {
    if (!currentQuizCard) return;

    if (ok) speakJapanese(currentQuizCard.jp);

    setQuizFeedback({
      type: ok ? 'ok' : 'no',
      msg: ok 
        ? `○ Chính xác — ${currentQuizCard.jp} (${currentQuizCard.romaji})`
        : `✕ Chưa đúng — Đáp án: ${currentQuizCard.jp} (${currentQuizCard.romaji})`
    });

    setTimeout(() => {
      advanceCard();
    }, 1300);
  };

  // Match Game Deck Logic
  const initMatchGame = () => {
    const pool = [...filteredWords].sort(() => Math.random() - 0.5);
    setMatchPool(pool);
    setMatchCompletedAll(false);
    if (pool.length === 0) return;
    setupMatchRound(pool);
  };

  const setupMatchRound = (remainingPool: Word[]) => {
    const count = Math.min(6, remainingPool.length);
    const chosen = remainingPool.slice(0, count);

    const tiles = chosen.flatMap(w => [
      { id: w.id, type: 'jp' as const, text: w.jp },
      { id: w.id, type: 'vi' as const, text: w.vi }
    ]).sort(() => Math.random() - 0.5);

    setMatchTiles(tiles);
    setMatchSelected([]);
    setMatchWrong([]);
    setMatchSolved(new Set());
    setMatchCompletedRound(false);
  };

  const handleMatchClick = (index: number) => {
    if (matchSolved.has(index) || matchSelected.includes(index) || matchSelected.length >= 2) return;

    const tileClicked = matchTiles[index];
    if (tileClicked.type === 'jp') {
      speakJapanese(tileClicked.text);
    }

    const nextSelected = [...matchSelected, index];
    setMatchSelected(nextSelected);

    if (nextSelected.length === 2) {
      const [idxA, idxB] = nextSelected;
      const tileA = matchTiles[idxA];
      const tileB = matchTiles[idxB];

      if (tileA.id === tileB.id && tileA.type !== tileB.type) {
        const nextSolved = new Set(matchSolved);
        nextSolved.add(idxA);
        nextSolved.add(idxB);
        setMatchSolved(nextSolved);
        setMatchSelected([]);

        if (nextSolved.size === matchTiles.length) {
          setMatchCompletedRound(true);
          const solvedIds = new Set(matchTiles.map(t => t.id));
          const nextPool = matchPool.filter(w => !solvedIds.has(w.id));
          setMatchPool(nextPool);
          if (nextPool.length === 0) {
            setMatchCompletedAll(true);
          }
        }
      } else {
        setMatchWrong([idxA, idxB]);
        setTimeout(() => {
          setMatchWrong([]);
          setMatchSelected([]);
        }, 700);
      }
    }
  };

  const currentKanaRows: KanaRow[] = 
    kanaSection === 'basic' ? BASIC_KANA :
    kanaSection === 'dakuon' ? DAKUON_KANA : YOON_KANA;

  const navItems = [
    { id: 'add' as const, label: 'Thêm từ mới', shortLabel: 'Thêm từ', icon: Plus },
    { id: 'list' as const, label: `Danh sách từ (${words.length})`, shortLabel: `Danh sách`, icon: List },
    { id: 'quiz' as const, label: 'Luyện tập Flashcard', shortLabel: 'Luyện tập', icon: Brain },
    { id: 'kana' as const, label: 'Bảng chữ cái Kana', shortLabel: 'Bảng Kana', icon: Grid },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* MOBILE TOP BAR - CHUYỂN NÚT HAMBURGER SANG BÊN TRÁI CHUẨN UI */}
      <div className="md:hidden bg-[#FFFDF9] border-b border-[var(--card-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 -ml-1 rounded-lg text-[var(--indigo)] hover:bg-black/5 transition"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="font-shippori font-bold text-xl text-[var(--indigo-deep)] tracking-wide flex items-center gap-2">
            和語ノート
            <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[var(--indigo)] text-white font-medium">v2.0</span>
          </h1>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop Collapsible & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-[#FFFDF9] border-r border-[var(--card-border)] p-4 flex flex-col justify-between transition-all duration-200 ease-in-out md:static md:translate-x-0
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        ${mobileMenuOpen ? 'w-64 translate-x-0 shadow-2xl' : 'w-64 -translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo & Branding + Desktop Toggle */}
          <div className="border-b border-[var(--card-border)] pb-4 flex items-center justify-between">
            <div className={`overflow-hidden transition-all ${sidebarCollapsed ? 'md:hidden' : 'block'}`}>
              <h1 className="font-shippori font-bold text-2xl text-[var(--indigo-deep)] tracking-wide flex items-center gap-2">
                和語ノート
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[var(--indigo)] text-white font-medium">v2.0</span>
              </h1>
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 font-medium">Sổ tay học từ vựng</p>
            </div>

            {sidebarCollapsed && (
              <div className="hidden md:block mx-auto font-shippori font-bold text-xl text-[var(--indigo-deep)]" title="和語ノート">
                和
              </div>
            )}

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-[var(--ink-soft)] hover:bg-black/5 hover:text-[var(--indigo-deep)] transition"
              title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  title={item.label}
                  className={`w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-3 ${
                    isActive
                      ? 'bg-[var(--indigo)] text-white shadow-xs'
                      : 'text-[var(--ink-soft)] hover:bg-[#EFE8D8]/50 hover:text-[var(--indigo-deep)]'
                  } ${sidebarCollapsed ? 'md:justify-center md:px-0' : ''}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[var(--indigo)]'}`} />
                  <span className={`${sidebarCollapsed ? 'md:hidden' : 'block'} truncate`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Supabase Sync Status */}
        <div className="pt-4 border-t border-[var(--card-border)] space-y-2">
          <div className={`flex items-center ${sidebarCollapsed ? 'md:justify-center' : 'justify-between'}`}>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              syncStatus.mode === 'supabase' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {syncStatus.mode === 'supabase' ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
              <span className={sidebarCollapsed ? 'md:hidden' : 'inline'}>{syncStatus.message}</span>
            </span>

            <button 
              onClick={fetchData} 
              title="Làm mới dữ liệu"
              className={`p-1.5 rounded-md hover:bg-black/5 text-[var(--ink-soft)] transition ${sidebarCollapsed ? 'md:hidden' : 'block'}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-4xl w-full mx-auto">
        {/* TAB 1: THÊM TỪ */}
        {activeTab === 'add' && (
          <section className="space-y-4 bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-2xl shadow-xs">
            <h2 className="text-xl font-bold text-[var(--indigo-deep)] border-b border-[var(--card-border)] pb-3">Thêm từ vựng mới</h2>
            
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5 uppercase tracking-wider">
                Hiragana / Katakana / Kanji
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inJp}
                  onChange={(e) => handleJpChange(e.target.value)}
                  placeholder="Ví dụ: いぬ, 日本語, ねこ"
                  className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-base font-jp focus:outline-none focus:border-[var(--indigo)] bg-white"
                />
                {inJp.trim() && (
                  <button
                    type="button"
                    onClick={() => speakJapanese(inJp.trim())}
                    title="Nghe phát âm"
                    className="px-3 py-2.5 bg-indigo-50 border border-[var(--indigo)] text-[var(--indigo)] rounded-lg hover:bg-indigo-100 transition flex items-center justify-center shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAutoLookup}
                  disabled={isAutoLookingUp || !inJp.trim()}
                  className="px-4 py-2.5 bg-[var(--indigo)] text-white font-medium text-xs rounded-lg hover:bg-[var(--indigo-deep)] disabled:opacity-50 transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAutoLookingUp ? 'Đang tra...' : 'Tra tự động'}
                </button>
              </div>
              {jpHint && <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {jpHint}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5 uppercase tracking-wider">
                Romaji
              </label>
              <input
                type="text"
                value={inRomaji}
                onChange={(e) => setInRomaji(e.target.value)}
                placeholder="inu"
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-base font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5 uppercase tracking-wider">
                Nghĩa tiếng Việt
              </label>
              <input
                type="text"
                value={inVi}
                onChange={(e) => setInVi(e.target.value)}
                placeholder="Con chó"
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-base focus:outline-none focus:border-[var(--indigo)] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5 uppercase tracking-wider">
                Thư mục
              </label>
              <select
                value={inFolderId}
                onChange={(e) => setInFolderId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--indigo)]"
              >
                <option value="">Không phân loại</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveWord}
              className="w-full py-3 bg-[var(--indigo)] hover:bg-[var(--indigo-deep)] text-white font-bold rounded-lg transition shadow"
            >
              Lưu từ vựng
            </button>
          </section>
        )}

        {/* TAB 2: DANH SÁCH & QUẢN LÝ */}
        {activeTab === 'list' && (
          <section className="space-y-4">
            <div className="flex gap-2 bg-[#FFFDF9] p-2 rounded-lg border border-[var(--card-border)]">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục mới..."
                className="flex-1 px-3 py-1.5 border border-[var(--card-border)] rounded-md text-xs bg-white focus:outline-none"
              />
              <button
                onClick={handleAddFolder}
                className="px-3 py-1.5 bg-[var(--indigo)] text-white rounded-md text-xs font-semibold hover:bg-[var(--indigo-deep)] transition flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Tạo thư mục
              </button>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveFolder('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  activeFolder === 'all'
                    ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                    : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                }`}
              >
                Tất cả ({words.length})
              </button>
              {folders.map(f => {
                const wordCount = words.filter(w => w.folder_id === f.id).length;
                return (
                  <div key={f.id} className="relative inline-flex items-center">
                    {renamingFolderId === f.id ? (
                      <div className="flex items-center gap-1 bg-white border border-[var(--indigo)] rounded-full px-2 py-0.5">
                        <input
                          type="text"
                          value={renameInputValue}
                          onChange={(e) => setRenameInputValue(e.target.value)}
                          className="w-20 text-xs px-1 focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleRenameFolderCommit(f.id)} className="text-emerald-600"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setRenamingFolderId(null)} className="text-rose-600"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <div className={`inline-flex items-center border rounded-full overflow-hidden text-xs font-semibold ${
                        activeFolder === f.id
                          ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                          : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)]'
                      }`}>
                        <button onClick={() => setActiveFolder(f.id)} className="px-3 py-1.5">
                          {f.name} ({wordCount})
                        </button>
                        <button
                          onClick={() => { setRenamingFolderId(f.id); setRenameInputValue(f.name); }}
                          className="px-1 py-1.5 opacity-60 hover:opacity-100 border-l border-current/20"
                          title="Đổi tên"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(f.id)}
                          className="px-1.5 py-1.5 opacity-60 hover:opacity-100 text-rose-300 hover:text-rose-100"
                          title="Xóa thư mục"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {words.filter(w => activeFolder === 'all' || w.folder_id === activeFolder).length === 0 ? (
                <div className="col-span-full text-center py-12 text-sm text-[var(--ink-soft)] bg-[#FFFDF9] rounded-xl border border-dashed border-[var(--card-border)]">
                  Chưa có từ vựng nào trong mục này.
                </div>
              ) : (
                words
                  .filter(w => activeFolder === 'all' || w.folder_id === activeFolder)
                  .map(w => (
                    <div key={w.id} className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 rounded-xl relative shadow-xs hover:border-[var(--indigo)] transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="text-2xl font-medium font-jp text-[var(--ink)]">{w.jp}</div>
                            <button
                              onClick={() => speakJapanese(w.jp)}
                              title="Nghe phát âm"
                              className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50 transition"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteWord(w.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition"
                            title="Xóa từ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm font-jetbrains text-[var(--indigo)] font-semibold mt-0.5">{w.romaji}</div>
                        <div className="text-sm text-[var(--ink-soft)] mt-1.5 font-medium">{w.vi}</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[var(--card-border)]/50 flex justify-between items-center text-xs">
                        <select
                          value={w.folder_id || ''}
                          onChange={(e) => handleChangeWordFolder(w.id, e.target.value)}
                          className="px-2.5 py-1 bg-[#EEF2F7] text-[var(--indigo)] font-semibold rounded-md border border-[var(--card-border)] focus:outline-none text-xs"
                        >
                          <option value="">Không phân loại</option>
                          {folders.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}

        {/* TAB 3: LUYỆN TẬP */}
        {activeTab === 'quiz' && (
          <section className="space-y-4">
            <div className="flex gap-2 bg-[#FFFDF9] p-1.5 border border-[var(--card-border)] rounded-lg">
              <button
                onClick={() => setQuizMode('jp2romaji')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  quizMode === 'jp2romaji'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                Từ → Romaji
              </button>
              <button
                onClick={() => setQuizMode('romaji2jp')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  quizMode === 'romaji2jp'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                Romaji → Chữ
              </button>
              <button
                onClick={() => setQuizMode('match')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                  quizMode === 'match'
                    ? 'bg-[var(--indigo)] text-white shadow-xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                Ghép cặp
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1">Luyện theo thư mục</label>
                <select
                  value={quizFolderId}
                  onChange={(e) => setQuizFolderId(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--card-border)] rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value="all">Tất cả ({words.length} từ)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Options & Progress */}
              <div className="flex items-center gap-2 sm:self-end">
                {quizMode !== 'match' && (
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                      autoSpeak
                        ? 'bg-indigo-50 border-[var(--indigo)] text-[var(--indigo)]'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    title="Tự động đọc phát âm từ tiếng Nhật khi mở thẻ mới"
                  >
                    {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    Tự động đọc
                  </button>
                )}

                {!quizCompletedDeck && quizTotalCount > 0 && (
                  <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0">
                    <Brain className="w-3.5 h-3.5 text-[var(--indigo)]" />
                    Tiến độ: {quizCurrentIndex} / {quizTotalCount} từ
                  </div>
                )}
              </div>
            </div>

            {/* QUIZ MODE 1 & 2 DECK VIEW */}
            {(quizMode === 'jp2romaji' || quizMode === 'romaji2jp') && (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl text-center space-y-4">
                {quizCompletedDeck ? (
                  <div className="py-8 space-y-4">
                    <div className="inline-flex p-4 bg-amber-100 text-amber-700 rounded-full">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành lượt học!</h3>
                    <p className="text-sm text-[var(--ink-soft)] max-w-sm mx-auto">
                      Chúc mừng! Bạn đã ôn luyện qua toàn bộ <strong>{quizTotalCount} từ vựng</strong> trong thư mục này mà không bị sót chữ nào.
                    </p>
                    <button
                      onClick={initDeck}
                      className="px-6 py-2.5 bg-[var(--indigo)] text-white text-xs font-bold rounded-lg hover:bg-[var(--indigo-deep)] inline-flex items-center gap-2 shadow"
                    >
                      <RotateCcw className="w-4 h-4" /> Luyện tập lại từ đầu
                    </button>
                  </div>
                ) : currentQuizCard ? (
                  <>
                    {quizMode === 'jp2romaji' ? (
                      <>
                        <div className="py-6">
                          <div className="inline-flex items-center gap-3">
                            <span className="text-4xl font-medium font-jp text-[var(--ink)]">{currentQuizCard.jp}</span>
                            <button
                              onClick={() => speakJapanese(currentQuizCard.jp)}
                              title="Nghe phát âm"
                              className="p-2 rounded-full text-[var(--indigo)] hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition"
                            >
                              <Volume2 className="w-6 h-6" />
                            </button>
                          </div>
                          <div className="text-sm text-[var(--ink-soft)] mt-2 font-medium">{currentQuizCard.vi}</div>
                        </div>

                        <input
                          type="text"
                          value={quizInput}
                          onChange={(e) => setQuizInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleGrade(quizInput.trim().toLowerCase() === currentQuizCard.romaji.toLowerCase())}
                          placeholder="Gõ Romaji đáp án..."
                          className="w-full text-center py-2.5 border border-[var(--card-border)] rounded-lg text-base font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white"
                          autoFocus
                        />
                      </>
                    ) : (
                      <>
                        <div className="py-4">
                          <div className="inline-flex items-center gap-2">
                            <span className="text-3xl font-jetbrains text-[var(--indigo)] font-bold">{currentQuizCard.romaji}</span>
                            <button
                              onClick={() => speakJapanese(currentQuizCard.jp)}
                              title="Nghe phát âm tiếng Nhật"
                              className="p-1.5 rounded-full text-[var(--indigo)] hover:bg-indigo-50 transition"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="text-sm text-[var(--ink-soft)] mt-1 font-medium">{currentQuizCard.vi}</div>
                        </div>

                        <div className="min-h-[44px] border-2 border-dashed border-[var(--card-border)] rounded-lg p-2 text-2xl font-medium font-jp flex items-center justify-center bg-white">
                          {romaji2JpBuilt || <span className="text-gray-300 text-xs font-normal">Chạm các ký tự bên dưới để ghép từ</span>}
                        </div>

                        <div className="grid grid-cols-5 gap-1.5">
                          {(/[\u30A0-\u30FF]/.test(currentQuizCard.jp)
                            ? ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ン","ー"]
                            : ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","ん","っ"]
                          ).map(t => (
                            <button
                              key={t}
                              onClick={() => setRomaji2JpBuilt(prev => prev + t)}
                              className="py-2 bg-white border border-[var(--card-border)] rounded-md text-base font-jp hover:bg-[var(--paper-deep)] active:bg-gray-200 transition"
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setRomaji2JpBuilt(prev => prev.slice(0, -1))}
                            className="flex-1 py-2 border border-[var(--indigo)] text-[var(--indigo)] rounded-lg text-xs font-semibold hover:bg-gray-100"
                          >
                            Xóa ký tự
                          </button>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={advanceCard}
                        className="px-4 py-2.5 border border-gray-300 text-[var(--ink-soft)] rounded-lg text-xs font-semibold hover:bg-gray-100"
                      >
                        Bỏ qua
                      </button>
                      <button
                        onClick={() => {
                          const isOk = quizMode === 'jp2romaji'
                            ? quizInput.trim().toLowerCase() === currentQuizCard.romaji.toLowerCase()
                            : romaji2JpBuilt === currentQuizCard.jp;
                          handleGrade(isOk);
                        }}
                        className="flex-1 py-2.5 bg-[var(--indigo)] text-white rounded-lg text-xs font-bold hover:bg-[var(--indigo-deep)] transition"
                      >
                        Kiểm tra
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[var(--ink-soft)] py-8">Chưa có từ vựng phù hợp trong thư mục này.</p>
                )}

                {quizFeedback && (
                  <div className={`text-sm font-bold ${quizFeedback.type === 'ok' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {quizFeedback.msg}
                  </div>
                )}
              </div>
            )}

            {/* QUIZ MODE 3: MATCH GAME */}
            {quizMode === 'match' && (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl space-y-4">
                {matchCompletedAll ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex p-4 bg-emerald-100 text-emerald-700 rounded-full">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành ghép toàn bộ thư mục!</h3>
                    <p className="text-sm text-[var(--ink-soft)]">
                      Bạn đã ghép thành công tất cả các từ trong thư mục này.
                    </p>
                    <button
                      onClick={initMatchGame}
                      className="px-6 py-2.5 bg-[var(--indigo)] text-white text-xs font-bold rounded-lg hover:bg-[var(--indigo-deep)] inline-flex items-center gap-2 shadow"
                    >
                      <RotateCcw className="w-4 h-4" /> Chơi lại từ đầu
                    </button>
                  </div>
                ) : matchTiles.length === 0 ? (
                  <p className="text-sm text-[var(--ink-soft)] text-center py-8">Chưa có đủ từ vựng để tạo bài ghép cặp.</p>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-xs text-[var(--ink-soft)] mb-2 font-semibold">
                      <span>Ghép các cặp từ tương ứng</span>
                      <span>Còn lại: {matchPool.length} từ</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {matchTiles.map((tile, idx) => {
                        const isSolved = matchSolved.has(idx);
                        const isSelected = matchSelected.includes(idx);
                        const isWrong = matchWrong.includes(idx);

                        let style = 'bg-[#FFFDF9] border-[var(--card-border)] text-[var(--ink)]';
                        if (isSolved) style = 'bg-emerald-50 border-emerald-400 text-emerald-700 opacity-60 pointer-events-none';
                        else if (isWrong) style = 'bg-rose-50 border-rose-400 text-rose-700';
                        else if (isSelected) style = 'bg-indigo-50 border-[var(--indigo)] text-[var(--indigo)] font-bold';

                        return (
                          <button
                            key={idx}
                            onClick={() => handleMatchClick(idx)}
                            disabled={isSolved}
                            className={`p-3 border-2 rounded-lg text-sm text-center min-h-[56px] flex items-center justify-center transition shadow-2xs ${tile.type === 'jp' ? 'font-jp font-medium' : ''} ${style}`}
                          >
                            {tile.text}
                          </button>
                        );
                      })}
                    </div>

                    {matchCompletedRound && matchPool.length > 0 && (
                      <div className="text-center py-4 space-y-3">
                        <div className="font-bold text-emerald-700 text-sm">
                          ✓ Xuất sắc! Đã hoàn thành đợt này.
                        </div>
                        <button
                          onClick={() => setupMatchRound(matchPool)}
                          className="px-5 py-2 bg-[var(--indigo)] text-white text-xs font-bold rounded-lg hover:bg-[var(--indigo-deep)] inline-flex items-center gap-1.5 shadow"
                        >
                          Tiếp tục lượt tiếp theo ({matchPool.length} từ còn lại) <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: BẢNG CHỮ CÁI (KANA CHART) */}
        {activeTab === 'kana' && (
          <section className="space-y-4">
            <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-1 bg-white p-1 border border-[var(--card-border)] rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setKanaScript('hira')}
                    className={`px-3 py-1.5 rounded-md transition ${kanaScript === 'hira' ? 'bg-[var(--indigo)] text-white' : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'}`}
                  >
                    Hiragana (あ)
                  </button>
                  <button
                    onClick={() => setKanaScript('kata')}
                    className={`px-3 py-1.5 rounded-md transition ${kanaScript === 'kata' ? 'bg-[var(--indigo)] text-white' : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'}`}
                  >
                    Katakana (ア)
                  </button>
                  <button
                    onClick={() => setKanaScript('both')}
                    className={`px-3 py-1.5 rounded-md transition ${kanaScript === 'both' ? 'bg-[var(--indigo)] text-white' : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'}`}
                  >
                    Cả 2 (あ / ア)
                  </button>
                </div>

                <div className="flex gap-1 bg-white p-1 border border-[var(--card-border)] rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setKanaSection('basic')}
                    className={`px-2.5 py-1.5 rounded-md transition ${kanaSection === 'basic' ? 'bg-amber-700 text-white' : 'text-[var(--ink-soft)] hover:text-amber-700'}`}
                  >
                    Chữ gốc (清音)
                  </button>
                  <button
                    onClick={() => setKanaSection('dakuon')}
                    className={`px-2.5 py-1.5 rounded-md transition ${kanaSection === 'dakuon' ? 'bg-amber-700 text-white' : 'text-[var(--ink-soft)] hover:text-amber-700'}`}
                  >
                    Âm đục (濁音)
                  </button>
                  <button
                    onClick={() => setKanaSection('yoon')}
                    className={`px-2.5 py-1.5 rounded-md transition ${kanaSection === 'yoon' ? 'bg-amber-700 text-white' : 'text-[var(--ink-soft)] hover:text-amber-700'}`}
                  >
                    Âm ghép (拗音)
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--ink-soft)] text-center sm:text-left">
                💡 Chạm vào từng ô ký tự để nghe phát âm tiếng Nhật chuẩn và xem phát âm Romaji tương ứng.
              </p>
            </div>

            <div className="space-y-4">
              {currentKanaRows.map((row, rIdx) => (
                <div key={rIdx} className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-[var(--indigo-deep)] mb-2.5 uppercase tracking-wider">
                    {row.group}
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {row.items.map((item, cIdx) => {
                      const charToSpeak = kanaScript === 'kata' ? item.kata : item.hira;
                      const isEmpty = !item.hira && !item.kata;

                      if (isEmpty) {
                        return <div key={cIdx} className="min-h-[64px] bg-transparent"></div>;
                      }

                      return (
                        <button
                          key={cIdx}
                          onClick={() => speakJapanese(charToSpeak)}
                          className="min-h-[64px] bg-white border border-[var(--card-border)] hover:border-[var(--indigo)] rounded-lg p-2 flex flex-col items-center justify-center transition hover:shadow-xs active:scale-95 group"
                        >
                          <div className="text-xl font-medium font-jp text-[var(--ink)] group-hover:text-[var(--indigo)] transition">
                            {kanaScript === 'hira' && item.hira}
                            {kanaScript === 'kata' && item.kata}
                            {kanaScript === 'both' && (
                              <span className="flex items-center gap-1">
                                <span>{item.hira}</span>
                                <span className="text-xs text-gray-400">/</span>
                                <span className="text-sm text-[var(--indigo)]">{item.kata}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-jetbrains text-[var(--indigo)] font-semibold mt-0.5">
                            {item.romaji}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
