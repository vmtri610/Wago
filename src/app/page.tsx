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
  Trophy, ArrowRight, Volume2, VolumeX, Grid, Table, Menu, PanelLeftClose, PanelLeftOpen,
  GraduationCap, Headphones, Type, Keyboard, CheckSquare, Layers, Clock, Flame, Zap, Share2, Flag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import UserMenu from '@/components/auth/UserMenu';
import AuthLanding from '@/components/auth/AuthLanding';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import ShareFolderModal from '@/components/folder/ShareFolderModal';
import ReportWordModal from '@/components/report/ReportWordModal';
import ReportListModal from '@/components/report/ReportListModal';

export interface Folder {
  id: string;
  name: string;
  user_id?: string;
  shared_with?: string[];
}

export interface Word {
  id: string;
  folder_id?: string | null;
  folder?: string | null;
  jp: string;
  romaji: string;
  vi: string;
  srs_level?: number;
  next_review_at?: string | null;
  user_id?: string;
  shared_with?: string[];
}

export interface WordReport {
  id: string;
  user_id?: string;
  word_id: string;
  word_jp: string;
  word_romaji: string;
  word_vi: string;
  reason?: string;
  status?: 'pending' | 'resolved';
  created_at?: string;
}

// SRS Intervals in hours for Level 0..5
const SRS_INTERVAL_HOURS = [0, 4, 24, 72, 168, 336];

export default function Home() {
  const supabase = createClient();
  const { user, profile, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Sidebar Layout State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [sharingFolder, setSharingFolder] = useState<Folder | null>(null);

  // Report State
  const [reports, setReports] = useState<WordReport[]>([]);
  const [reportingWord, setReportingWord] = useState<Word | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportListModalOpen, setReportListModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'srs' | 'quiz' | 'kana' | 'theory'>('srs');
  const [theorySubTab, setTheorySubTab] = useState<'choon' | 'suuji'>('choon');
  const [suujiTab, setSuujiTab] = useState<'basic' | 'combine' | 'counters'>('basic');
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
  const [listSearchQuery, setListSearchQuery] = useState('');

  // -------------------------------------------------------------
  // DEDICATED SRS TAB STATE
  // -------------------------------------------------------------
  const [srsQuizMode, setSrsQuizMode] = useState<'jp2romaji' | 'mcq' | 'audio'>('jp2romaji');
  const [srsFolderIds, setSrsFolderIds] = useState<string[]>(['all']);
  const [srsDeck, setSrsDeck] = useState<Word[]>([]);
  const [srsTotalCount, setSrsTotalCount] = useState<number>(0);
  const [srsCurrentIndex, setSrsCurrentIndex] = useState<number>(0);
  const [currentSrsCard, setCurrentSrsCard] = useState<Word | null>(null);
  const [srsCompletedDeck, setSrsCompletedDeck] = useState<boolean>(false);
  const [srsInput, setSrsInput] = useState('');
  const [srsFeedback, setSrsFeedback] = useState<{ type: 'ok' | 'no'; msg: string; oldLevel?: number; newLevel?: number } | null>(null);
  const [srsMcqOptions, setSrsMcqOptions] = useState<Word[]>([]);
  const [selectedSrsMcqWordId, setSelectedSrsMcqWordId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // STANDARD QUIZ TAB STATE (FREE PRACTICE)
  // -------------------------------------------------------------
  const [quizMode, setQuizMode] = useState<'jp2romaji' | 'romaji2jp' | 'mcq' | 'audio' | 'match'>('jp2romaji');
  const [quizFolderIds, setQuizFolderIds] = useState<string[]>(['all']);
  const [quizDeck, setQuizDeck] = useState<Word[]>([]);
  const [quizTotalCount, setQuizTotalCount] = useState<number>(0);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [currentQuizCard, setCurrentQuizCard] = useState<Word | null>(null);
  const [quizCompletedDeck, setQuizCompletedDeck] = useState<boolean>(false);
  const [quizInput, setQuizInput] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'ok' | 'no'; msg: string; oldLevel?: number; newLevel?: number } | null>(null);
  const [romaji2JpBuilt, setRomaji2JpBuilt] = useState('');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [quizMcqOptions, setQuizMcqOptions] = useState<Word[]>([]);
  const [selectedMcqWordId, setSelectedMcqWordId] = useState<string | null>(null);

  // Match Game state
  const [matchPool, setMatchPool] = useState<Word[]>([]);
  const [matchTiles, setMatchTiles] = useState<{ id: string; type: 'jp' | 'romaji'; text: string }[]>([]);
  const [matchSelected, setMatchSelected] = useState<number[]>([]);
  const [matchWrong, setMatchWrong] = useState<number[]>([]);
  const [matchSolved, setMatchSolved] = useState<Set<number>>(new Set());
  const [matchCompletedRound, setMatchCompletedRound] = useState(false);
  const [matchCompletedAll, setMatchCompletedAll] = useState(false);

  // Kana Chart View State
  const [kanaScript, setKanaScript] = useState<'hira' | 'kata' | 'both'>('hira');
  const [kanaSection, setKanaSection] = useState<'basic' | 'dakuon' | 'yoon'>('basic');

  // Helper function to check if word is due for SRS review
  const isWordSrsDue = (w: Word) => {
    if (!w.next_review_at) return true;
    return new Date(w.next_review_at) <= new Date();
  };

  // Helper renderer for SRS Colored Level Chips
  const renderSrsChip = (level: number = 0, isDue?: boolean) => {
    const configs = [
      { label: 'Level 0', bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-500' },
      { label: 'Level 1', bg: 'bg-orange-100 text-orange-800 border-orange-300', dot: 'bg-orange-500' },
      { label: 'Level 2', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300', dot: 'bg-cyan-500' },
      { label: 'Level 3', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
      { label: 'Level 4', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', dot: 'bg-indigo-500' },
      { label: 'Level 5', bg: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-500' }
    ];
    const cfg = configs[Math.min(Math.max(0, level), 5)];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} shadow-2xs`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
    );
  };

  // -------------------------------------------------------------
  // Load data DIRECTLY from Supabase Database (with local storage fallback for reports)
  // -------------------------------------------------------------
  const fetchData = async () => {
    try {
      const { data: fData, error: fError } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
      const { data: wData, error: wError } = await supabase.from('words').select('*').order('created_at', { ascending: false });

      if (fError || wError) {
        throw new Error(fError?.message || wError?.message || 'Lỗi truy vấn Supabase DB');
      }

      setFolders(fData || []);

      // Fetch user-specific SRS progress if logged in
      let progressMap: Record<string, { srs_level: number; next_review_at: string | null }> = {};
      if (user?.id) {
        try {
          const { data: pData } = await supabase
            .from('user_word_progress')
            .select('word_id, srs_level, next_review_at')
            .eq('user_id', user.id);

          if (pData) {
            pData.forEach((p: any) => {
              progressMap[p.word_id] = {
                srs_level: p.srs_level,
                next_review_at: p.next_review_at || null
              };
            });
          }
        } catch (pErr) {
          console.warn('Không thể tải tiến trình SRS cá nhân:', pErr);
        }
      }

      setWords((wData || []).map((w: any) => {
        const prog = progressMap[w.id];
        return {
          ...w,
          srs_level: prog ? prog.srs_level : (w.srs_level ?? 0),
          next_review_at: prog ? prog.next_review_at : (w.next_review_at || null)
        };
      }));
      setSyncStatus({ mode: 'supabase', message: 'Supabase DB Live' });

      // Fetch pending reports
      try {
        const { data: rData, error: rError } = await supabase
          .from('word_reports')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        if (!rError && rData) {
          setReports(rData as WordReport[]);
        } else {
          const local = localStorage.getItem('wago_reports');
          if (local) setReports(JSON.parse(local));
        }
      } catch (rErr) {
        const local = localStorage.getItem('wago_reports');
        if (local) setReports(JSON.parse(local));
      }
    } catch (err: any) {
      console.error('Lỗi kết nối Supabase DB:', err?.message);
      setSyncStatus({ mode: 'local', message: 'Lỗi Supabase DB' });
      const local = localStorage.getItem('wago_reports');
      if (local) setReports(JSON.parse(local));
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Report Handling Functions
  const handleSubmitReport = async (word: Word, reason: string) => {
    const newReport: WordReport = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      user_id: user?.id,
      word_id: word.id,
      word_jp: word.jp,
      word_romaji: word.romaji,
      word_vi: word.vi,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('wago_reports', JSON.stringify(updated));

    try {
      await supabase.from('word_reports').insert({
        word_id: word.id,
        word_jp: word.jp,
        word_romaji: word.romaji,
        word_vi: word.vi,
        reason,
        status: 'pending',
      });
    } catch (err) {
      console.error('Lỗi gửi báo cáo lên Supabase DB:', err);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    const updated = reports.filter(r => r.id !== reportId);
    setReports(updated);
    localStorage.setItem('wago_reports', JSON.stringify(updated));

    try {
      await supabase.from('word_reports').update({ status: 'resolved' }).eq('id', reportId);
    } catch (err) {
      console.error('Lỗi giải quyết báo cáo trên Supabase DB:', err);
    }
  };

  const handleUpdateWordFromReport = async (updatedWord: Word) => {
    const updatedWords = words.map(w => w.id === updatedWord.id ? updatedWord : w);
    setWords(updatedWords);

    try {
      await supabase.from('words').update({
        jp: updatedWord.jp,
        romaji: updatedWord.romaji,
        vi: updatedWord.vi,
      }).eq('id', updatedWord.id);
    } catch (e) {
      console.error('Lỗi cập nhật từ vựng từ báo cáo:', e);
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
      jp, romaji, vi, folder_id,
      srs_level: 0,
      next_review_at: new Date().toISOString()
    };

    const updatedWords = [newWord, ...words];
    setWords(updatedWords);

    try {
      await supabase.from('words').insert([{
        id: newWord.id,
        jp: newWord.jp,
        romaji: newWord.romaji,
        vi: newWord.vi,
        folder_id: newWord.folder_id,
        ...(user ? { user_id: user.id } : {})
      }]);
    } catch (e) {
      console.error('Lỗi lưu từ vào Supabase DB:', e);
    }

    setInJp(''); setInRomaji(''); setInVi(''); setJpHint('');
    setActiveTab('list');
  };

  const handleDeleteWord = async (id: string) => {
    const updatedWords = words.filter(w => w.id !== id);
    setWords(updatedWords);
    await supabase.from('words').delete().eq('id', id);
  };

  const handleChangeWordFolder = async (wordId: string, newFolderId: string) => {
    const folder_id = newFolderId || null;
    const updatedWords = words.map(w => w.id === wordId ? { ...w, folder_id } : w);
    setWords(updatedWords);
    await supabase.from('words').update({ folder_id }).eq('id', wordId);
  };

  // -------------------------------------------------------------
  // Folder Management (Direct Supabase DB)
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
    await supabase.from('folders').insert([{ 
      id: newFolder.id, 
      name: newFolder.name,
      ...(user ? { user_id: user.id } : {})
    }]);
  };

  const handleDeleteFolder = async (folderId: string) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    const updatedWords = words.map(w => w.folder_id === folderId ? { ...w, folder_id: null } : w);
    setFolders(updatedFolders);
    setWords(updatedWords);
    if (activeFolder === folderId) setActiveFolder('all');
    await supabase.from('folders').delete().eq('id', folderId);
  };

  const handleRenameFolderCommit = async (folderId: string) => {
    const newName = renameInputValue.trim();
    setRenamingFolderId(null);
    if (!newName) return;

    const updatedFolders = folders.map(f => f.id === folderId ? { ...f, name: newName } : f);
    setFolders(updatedFolders);
    await supabase.from('folders').update({ name: newName }).eq('id', folderId);
  };

  // -------------------------------------------------------------
  // DEDICATED SRS TAB LOGIC WITH MULTI-FOLDER FILTER
  // -------------------------------------------------------------
  const dueSrsWords = words.filter(w => {
    const matchesFolder = srsFolderIds.includes('all') || (w.folder_id && srsFolderIds.includes(w.folder_id));
    return matchesFolder && isWordSrsDue(w);
  });

  const toggleSrsFolder = (fId: string) => {
    if (fId === 'all') {
      setSrsFolderIds(['all']);
      return;
    }
    let next: string[];
    if (srsFolderIds.includes('all')) {
      next = [fId];
    } else if (srsFolderIds.includes(fId)) {
      next = srsFolderIds.filter(id => id !== fId);
      if (next.length === 0) next = ['all'];
    } else {
      next = [...srsFolderIds, fId];
    }
    setSrsFolderIds(next);
  };

  const generateSrsMcqOptions = (targetCard: Word, pool: Word[]) => {
    const distractors = pool.filter(w => w.id !== targetCard.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [targetCard, ...shuffledDistractors].sort(() => Math.random() - 0.5);
    return options;
  };

  const initSrsDeck = () => {
    setSrsFeedback(null);
    setSrsInput('');
    setSrsCompletedDeck(false);
    setSelectedSrsMcqWordId(null);

    if (dueSrsWords.length === 0) {
      setSrsDeck([]);
      setSrsTotalCount(0);
      setSrsCurrentIndex(0);
      setCurrentSrsCard(null);
      setSrsCompletedDeck(true);
      return;
    }

    const shuffled = [...dueSrsWords].sort(() => Math.random() - 0.5);
    setSrsDeck(shuffled);
    setSrsTotalCount(shuffled.length);
    setSrsCurrentIndex(1);
    setCurrentSrsCard(shuffled[0]);

    if (srsQuizMode === 'mcq' || srsQuizMode === 'audio') {
      setSrsMcqOptions(generateSrsMcqOptions(shuffled[0], words));
    }

    if ((autoSpeak || srsQuizMode === 'audio') && shuffled[0]?.jp) {
      speakJapanese(shuffled[0].jp);
    }
  };

  useEffect(() => {
    if (activeTab === 'srs') {
      initSrsDeck();
    }
  }, [activeTab, srsQuizMode, srsFolderIds]);

  const advanceSrsCard = () => {
    if (srsDeck.length <= 1) {
      setSrsDeck([]);
      setCurrentSrsCard(null);
      setSrsCompletedDeck(true);
    } else {
      const nextDeck = srsDeck.slice(1);
      setSrsDeck(nextDeck);
      setCurrentSrsCard(nextDeck[0]);
      setSrsCurrentIndex(prev => prev + 1);

      if (srsQuizMode === 'mcq' || srsQuizMode === 'audio') {
        setSrsMcqOptions(generateSrsMcqOptions(nextDeck[0], words));
      }

      if ((autoSpeak || srsQuizMode === 'audio') && nextDeck[0]?.jp) {
        speakJapanese(nextDeck[0].jp);
      }
    }
    setSrsFeedback(null);
    setSrsInput('');
    setSelectedSrsMcqWordId(null);
  };

  const handleSrsGrade = async (ok: boolean) => {
    if (!currentSrsCard) return;

    if (ok) speakJapanese(currentSrsCard.jp);

    const oldLevel = currentSrsCard.srs_level || 0;
    const newLevel = ok ? Math.min(oldLevel + 1, 5) : 0;
    const hoursToAdd = SRS_INTERVAL_HOURS[newLevel] || 0;

    const nextDate = new Date();
    nextDate.setHours(nextDate.getHours() + hoursToAdd);
    const nextReviewIso = nextDate.toISOString();

    const updatedWord: Word = {
      ...currentSrsCard,
      srs_level: newLevel,
      next_review_at: nextReviewIso
    };

    const updatedWords = words.map(w => w.id === updatedWord.id ? updatedWord : w);
    setWords(updatedWords);

    try {
      if (user?.id) {
        await supabase.from('user_word_progress').upsert({
          user_id: user.id,
          word_id: updatedWord.id,
          srs_level: newLevel,
          next_review_at: nextReviewIso,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,word_id' });
      }
    } catch (e) {
      console.error('Lỗi cập nhật SRS lên Supabase DB:', e);
    }

    setSrsFeedback({
      type: ok ? 'ok' : 'no',
      msg: ok 
        ? `Chính xác — ${currentSrsCard.jp} (${currentSrsCard.romaji})`
        : `Chưa đúng — ${currentSrsCard.jp} (${currentSrsCard.romaji})`,
      oldLevel,
      newLevel
    });
  };

  const handleSrsMcqChoiceSelect = (option: Word) => {
    if (!currentSrsCard || srsFeedback) return;
    setSelectedSrsMcqWordId(option.id);
    const isCorrect = option.id === currentSrsCard.id;
    handleSrsGrade(isCorrect);
  };

  // -------------------------------------------------------------
  // STANDARD QUIZ DECK ENGINE (FREE PRACTICE)
  // -------------------------------------------------------------
  const filteredWords = words.filter(w => {
    return quizFolderIds.includes('all') || (w.folder_id && quizFolderIds.includes(w.folder_id));
  });

  const toggleQuizFolder = (fId: string) => {
    if (fId === 'all') {
      setQuizFolderIds(['all']);
      return;
    }
    let next: string[];
    if (quizFolderIds.includes('all')) {
      next = [fId];
    } else if (quizFolderIds.includes(fId)) {
      next = quizFolderIds.filter(id => id !== fId);
      if (next.length === 0) next = ['all'];
    } else {
      next = [...quizFolderIds, fId];
    }
    setQuizFolderIds(next);
  };

  const generateMcqOptions = (targetCard: Word, pool: Word[]) => {
    const distractors = pool.filter(w => w.id !== targetCard.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [targetCard, ...shuffledDistractors].sort(() => Math.random() - 0.5);
    return options;
  };

  const initDeck = () => {
    setQuizFeedback(null);
    setQuizInput('');
    setRomaji2JpBuilt('');
    setQuizCompletedDeck(false);
    setSelectedMcqWordId(null);

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

    if (quizMode === 'mcq' || quizMode === 'audio') {
      const poolForMcq = filteredWords.length >= 4 ? filteredWords : words;
      setQuizMcqOptions(generateMcqOptions(shuffled[0], poolForMcq));
    }

    if ((autoSpeak || quizMode === 'audio') && shuffled[0]?.jp) {
      speakJapanese(shuffled[0].jp);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      initDeck();
    }
  }, [activeTab, quizMode, quizFolderIds]);

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

      if (quizMode === 'mcq' || quizMode === 'audio') {
        const poolForMcq = filteredWords.length >= 4 ? filteredWords : words;
        setQuizMcqOptions(generateMcqOptions(nextDeck[0], poolForMcq));
      }

      if ((autoSpeak || quizMode === 'audio') && nextDeck[0]?.jp) {
        speakJapanese(nextDeck[0].jp);
      }
    }
    setQuizFeedback(null);
    setQuizInput('');
    setRomaji2JpBuilt('');
    setSelectedMcqWordId(null);
  };

  const handleGrade = async (ok: boolean) => {
    if (!currentQuizCard) return;

    if (ok) speakJapanese(currentQuizCard.jp);

    const oldLevel = currentQuizCard.srs_level || 0;
    const newLevel = ok ? Math.min(oldLevel + 1, 5) : 0;
    const hoursToAdd = SRS_INTERVAL_HOURS[newLevel] || 0;

    const nextDate = new Date();
    nextDate.setHours(nextDate.getHours() + hoursToAdd);
    const nextReviewIso = nextDate.toISOString();

    const updatedWord: Word = {
      ...currentQuizCard,
      srs_level: newLevel,
      next_review_at: nextReviewIso
    };

    const updatedWords = words.map(w => w.id === updatedWord.id ? updatedWord : w);
    setWords(updatedWords);

    try {
      if (user?.id) {
        await supabase.from('user_word_progress').upsert({
          user_id: user.id,
          word_id: updatedWord.id,
          srs_level: newLevel,
          next_review_at: nextReviewIso,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,word_id' });
      }
    } catch (e) {
      console.error('Lỗi cập nhật SRS lên Supabase DB:', e);
    }

    setQuizFeedback({
      type: ok ? 'ok' : 'no',
      msg: ok 
        ? `Chính xác — ${currentQuizCard.jp} (${currentQuizCard.romaji})`
        : `Chưa đúng — ${currentQuizCard.jp} (${currentQuizCard.romaji})`,
      oldLevel,
      newLevel
    });
  };

  const handleMcqChoiceSelect = (option: Word) => {
    if (!currentQuizCard || quizFeedback) return;
    setSelectedMcqWordId(option.id);
    const isCorrect = option.id === currentQuizCard.id;
    handleGrade(isCorrect);
  };

  // Match Game Deck Logic (Romaji <-> Japanese Word)
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
      { id: w.id, type: 'romaji' as const, text: w.romaji }
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
    } else {
      const matchedWord = words.find(w => w.id === tileClicked.id);
      if (matchedWord) speakJapanese(matchedWord.jp);
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
    { id: 'list' as const, label: 'Danh sách từ', shortLabel: 'Danh sách', icon: List },
    { id: 'srs' as const, label: 'Lặp lại ngắt quãng', shortLabel: 'Ôn ngắt quãng', icon: Flame },
    { id: 'quiz' as const, label: 'Luyện tập Tự do', shortLabel: 'Luyện tập', icon: Brain },
    { id: 'kana' as const, label: 'Bảng chữ cái Kana', shortLabel: 'Bảng Kana', icon: Grid },
    { id: 'theory' as const, label: 'Lý thuyết', shortLabel: 'Lý thuyết', icon: GraduationCap },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-[var(--indigo)] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[var(--ink-soft)]">Đang kết nối phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthLanding onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#FFFDF9] border-b border-[var(--card-border)] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 -ml-1 rounded-lg text-[var(--indigo)] hover:bg-black/5 transition"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="font-shippori font-bold text-xl text-[var(--indigo-deep)] tracking-wide whitespace-nowrap">
            和語ノート
          </h1>
        </div>

        {/* Mobile User Avatar Only & Dropdown Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileModalOpen(!profileModalOpen)}
              className="p-0.5 rounded-full border-2 border-[var(--indigo)]/30 hover:border-[var(--indigo)] transition shrink-0 active:scale-95"
              title="Tùy chọn tài khoản"
            >
              {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                <img
                  src={profile?.avatar_url || user.user_metadata?.avatar_url}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--indigo)] text-white flex items-center justify-center font-bold text-xs">
                  {(user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </button>

            <UserProfileDropdown
              isOpen={profileModalOpen}
              onClose={() => setProfileModalOpen(false)}
              user={user}
              profile={profile}
              onSignOut={signOut}
            />
          </div>
        )}
      </div>

      {/* Share Folder Modal */}
      {user && (
        <ShareFolderModal
          isOpen={!!sharingFolder}
          onClose={() => setSharingFolder(null)}
          folder={sharingFolder}
          currentUserId={user.id}
          onSuccess={fetchData}
        />
      )}

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
              <h1 className="font-shippori font-bold text-2xl text-[var(--indigo-deep)] tracking-wide">
                和語ノート
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
                  className={`w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-between ${
                    isActive
                      ? 'bg-[var(--indigo)] text-white shadow-xs'
                      : 'text-[var(--ink-soft)] hover:bg-[#EFE8D8]/50 hover:text-[var(--indigo-deep)]'
                  } ${sidebarCollapsed ? 'md:justify-center md:px-0' : ''}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.id === 'srs' ? 'text-rose-500' : 'text-[var(--indigo)]'}`} />
                    <span className={`${sidebarCollapsed ? 'md:hidden' : 'block'} truncate`}>
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Supabase Sync & User Auth */}
        <div className="pt-4 border-t border-[var(--card-border)] space-y-3">
          {/* User Profile / Login Button */}
          {user ? (
            <UserMenu
              user={user}
              profile={profile}
              onSignOut={signOut}
              collapsed={sidebarCollapsed}
            />
          ) : (
            <GoogleSignInButton
              onClick={signInWithGoogle}
              collapsed={sidebarCollapsed}
            />
          )}

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
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục mới..."
                className="flex-1 px-3.5 py-2 border border-[var(--card-border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--indigo)]"
              />
              <button
                onClick={handleAddFolder}
                className="px-4 py-2 bg-[var(--indigo)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--indigo-deep)] transition flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Tạo thư mục
              </button>
            </div>

            {/* Single-line Horizontal Scrollable Folder Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 whitespace-nowrap">
                <button
                  onClick={() => setActiveFolder('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
                    activeFolder === 'all'
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                      : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                  }`}
                >
                  Tất cả ({words.length})
                </button>
                {folders.map(f => {
                  const wordCount = words.filter(w => w.folder_id === f.id).length;
                  const isActive = activeFolder === f.id;
                  return (
                    <div key={f.id} className="relative inline-flex items-center shrink-0">
                      {renamingFolderId === f.id ? (
                        <div className="flex items-center gap-1 bg-white border border-[var(--indigo)] rounded-full px-2.5 py-0.5 shadow-2xs">
                          <input
                            type="text"
                            value={renameInputValue}
                            onChange={(e) => setRenameInputValue(e.target.value)}
                            className="w-24 text-xs px-1 focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleRenameFolderCommit(f.id)} className="text-emerald-600 p-0.5"><Check className="w-3 h-3" /></button>
                          <button onClick={() => setRenamingFolderId(null)} className="text-rose-600 p-0.5"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center border rounded-full overflow-hidden text-xs font-semibold shadow-2xs transition ${
                          isActive
                            ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                            : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-gray-300'
                        }`}>
                          <button onClick={() => setActiveFolder(f.id)} className="px-3 py-1.5 whitespace-nowrap">
                            {f.name} ({wordCount})
                          </button>
                          <button
                            onClick={() => setSharingFolder(f)}
                            className="px-1.5 py-1.5 opacity-60 hover:opacity-100 border-l border-current/20 hover:text-amber-300"
                            title="Chia sẻ thư mục"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => { setRenamingFolderId(f.id); setRenameInputValue(f.name); }}
                            className="px-1.5 py-1.5 opacity-60 hover:opacity-100 border-l border-current/20"
                            title="Đổi tên"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteFolder(f.id)}
                            className="px-1.5 py-1.5 opacity-60 hover:opacity-100 text-rose-300 hover:text-rose-100 border-l border-current/20"
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
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiếng Nhật, Romaji hoặc tiếng Việt..."
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs border border-[var(--card-border)] rounded-xl bg-white focus:outline-none focus:border-[var(--indigo)] shadow-2xs"
              />
              {listSearchQuery && (
                <button
                  onClick={() => setListSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(() => {
                const filteredListWords = words.filter(w => {
                  const matchesFolder = activeFolder === 'all' || w.folder_id === activeFolder;
                  if (!matchesFolder) return false;
                  if (!listSearchQuery.trim()) return true;
                  const q = listSearchQuery.toLowerCase().trim();
                  return (
                    w.jp.toLowerCase().includes(q) ||
                    w.romaji.toLowerCase().includes(q) ||
                    w.vi.toLowerCase().includes(q)
                  );
                });

                if (filteredListWords.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12 text-sm text-[var(--ink-soft)] bg-[#FFFDF9] rounded-xl border border-dashed border-[var(--card-border)]">
                      {listSearchQuery ? `Không tìm thấy từ vựng khớp với "${listSearchQuery}".` : 'Chưa có từ vựng nào trong mục này.'}
                    </div>
                  );
                }

                return filteredListWords.map(w => (
                  <div key={w.id} className="bg-[#FFFDF9] border border-[var(--card-border)] p-4 rounded-xl relative shadow-xs hover:border-[var(--indigo)] transition flex flex-col justify-between space-y-2">
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

                      {/* SRS Colored Level Chip */}
                      <div>
                        {renderSrsChip(w.srs_level, isWordSrsDue(w))}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>
        )}

        {/* TAB 3: DEDICATED TAB ÔN TẬP SRS */}
        {activeTab === 'srs' && (
          <section className="space-y-5">
            {/* SRS Header Dashboard */}
            <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--card-border)] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                    <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
                    Ôn tập Lặp lại ngắt quãng
                  </h2>
                </div>

                <div className="px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold text-xs flex items-center gap-1.5 shrink-0">
                  <Clock className="w-4 h-4 text-rose-600" />
                  {dueSrsWords.length} từ đến hạn hôm nay
                </div>
              </div>

              {/* SRS Level Distribution Chips */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[var(--ink-soft)]">Tiến trình ghi nhớ (6 Cấp độ):</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[0, 1, 2, 3, 4, 5].map(lvl => {
                    const count = words.filter(w => (w.srs_level || 0) === lvl).length;
                    return (
                      <div key={lvl} className="bg-white border border-[var(--card-border)] p-2 rounded-xl text-center space-y-1">
                        <div className="flex justify-center">{renderSrsChip(lvl)}</div>
                        <div className="text-sm sm:text-base font-bold text-[var(--indigo-deep)]">{count} <span className="text-[10px] font-normal text-gray-500">từ</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SRS Multi-selection Folder Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 whitespace-nowrap pt-2 border-t border-[var(--card-border)]/60">
                <button
                  onClick={() => setSrsFolderIds(['all'])}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
                    srsFolderIds.includes('all')
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                      : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                  }`}
                >
                  Tất cả ({words.length})
                </button>

                {folders.map(f => {
                  const isSelected = !srsFolderIds.includes('all') && srsFolderIds.includes(f.id);
                  const wordCount = words.filter(w => w.folder_id === f.id).length;
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleSrsFolder(f.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                          : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {f.name} ({wordCount})
                    </button>
                  );
                })}
              </div>

              {/* SRS Quiz Mode Options & Auto Speak Toggle */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1 items-stretch sm:items-center">
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={() => setSrsQuizMode('jp2romaji')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 ${
                      srsQuizMode === 'jp2romaji'
                        ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                        : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" /> Từ → Romaji
                  </button>
                  <button
                    onClick={() => setSrsQuizMode('mcq')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 ${
                      srsQuizMode === 'mcq'
                        ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                        : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Trắc nghiệm
                  </button>
                  <button
                    onClick={() => setSrsQuizMode('audio')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition flex items-center justify-center gap-1.5 ${
                      srsQuizMode === 'audio'
                        ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                        : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" /> Luyện nghe
                  </button>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                      autoSpeak
                        ? 'bg-indigo-50 border-[var(--indigo)] text-[var(--indigo)]'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    title="Tự động đọc phát âm từ tiếng Nhật khi mở thẻ mới"
                  >
                    {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    Tự động đọc
                  </button>

                  <button
                    onClick={() => setReportListModalOpen(true)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition flex items-center justify-center gap-1.5 shrink-0"
                    title="Xem lại các từ bị báo cáo lỗi nhập liệu"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-600" />
                    Báo cáo lỗi {reports.length > 0 && <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-bold rounded-full">{reports.length}</span>}
                  </button>
                </div>
              </div>
            </div>

            {/* SRS QUIZ CARD VIEW */}
            <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl text-center space-y-4">
              {srsCompletedDeck ? (
                <div className="py-8 space-y-4">
                  <div className="inline-flex p-4 bg-emerald-100 text-emerald-700 rounded-full">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Tuyệt vời! Bạn đã hoàn thành tất cả các từ cần ôn hôm nay!</h3>
                  <p className="text-sm text-[var(--ink-soft)] max-w-sm mx-auto">
                    Bạn không còn từ nào đến hạn cần ôn tập. Hãy quay lại vào ngày mai để tiếp tục duy trì trí nhớ nhé!
                  </p>
                  <button
                    onClick={initSrsDeck}
                    className="px-6 py-2.5 bg-[var(--indigo)] text-white text-xs font-bold rounded-lg hover:bg-[var(--indigo-deep)] inline-flex items-center gap-2 shadow"
                  >
                    <RotateCcw className="w-4 h-4" /> Làm mới lại danh sách ôn
                  </button>
                </div>
              ) : currentSrsCard ? (
                <>
                  <div className="flex justify-between items-center text-xs text-[var(--ink-soft)] font-semibold border-b border-[var(--card-border)] pb-3">
                    <span>Từ cần ôn: {srsCurrentIndex} / {srsTotalCount}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setReportingWord(currentSrsCard); setReportModalOpen(true); }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
                        title="Báo cáo lỗi nhập liệu từ này"
                      >
                        <Flag className="w-4 h-4" />
                        <span className="text-[10px] hidden sm:inline font-medium">Báo lỗi</span>
                      </button>
                      {renderSrsChip(currentSrsCard.srs_level, isWordSrsDue(currentSrsCard))}
                    </div>
                  </div>

                  {srsQuizMode === 'jp2romaji' && (
                    <>
                      <div className="py-4">
                        <div className="inline-flex items-center gap-3">
                          <span className="text-4xl font-medium font-jp text-[var(--ink)]">{currentSrsCard.jp}</span>
                          <button
                            onClick={() => speakJapanese(currentSrsCard.jp)}
                            title="Nghe phát âm"
                            className="p-2 rounded-full text-[var(--indigo)] hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition"
                          >
                            <Volume2 className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="text-sm text-[var(--ink-soft)] mt-2 font-medium">{currentSrsCard.vi}</div>
                      </div>

                      <input
                        type="text"
                        value={srsInput}
                        onChange={(e) => setSrsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (srsFeedback) {
                              advanceSrsCard();
                            } else {
                              handleSrsGrade(srsInput.trim().toLowerCase() === currentSrsCard.romaji.toLowerCase());
                            }
                          }
                        }}
                        placeholder=""
                        className="w-full text-center py-2.5 border border-[var(--card-border)] rounded-lg text-base font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white"
                        autoFocus
                      />
                    </>
                  )}

                  {(srsQuizMode === 'mcq' || srsQuizMode === 'audio') && (
                    <>
                      <div className="py-2 space-y-3 border-b border-[var(--card-border)] pb-4 flex flex-col items-center justify-center">
                        {srsQuizMode === 'mcq' ? (
                          <div className="inline-flex items-center gap-3">
                            <span className="text-3xl font-bold font-jetbrains text-[var(--indigo-deep)]">{currentSrsCard.romaji}</span>
                            <button
                              onClick={() => speakJapanese(currentSrsCard.jp)}
                              title="Nghe phát âm"
                              className="p-2 rounded-full text-[var(--indigo)] hover:bg-indigo-50 transition"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => speakJapanese(currentSrsCard.jp)}
                              className="p-5 bg-indigo-50 border-2 border-[var(--indigo)] text-[var(--indigo)] rounded-full hover:bg-indigo-100 active:scale-95 transition shadow-sm inline-flex items-center justify-center"
                              title="Bấm để nghe lại phát âm"
                            >
                              <Volume2 className="w-8 h-8 animate-pulse text-[var(--indigo)]" />
                            </button>
                            {srsFeedback && (
                              <div className="text-lg font-bold font-jp text-[var(--indigo-deep)]">
                                {currentSrsCard.jp} <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">({currentSrsCard.romaji})</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {srsMcqOptions.map((opt, idx) => {
                          const isSelected = selectedSrsMcqWordId === opt.id;
                          const isTarget = opt.id === currentSrsCard.id;

                          let style = 'bg-white border-[var(--card-border)] text-[var(--ink)] hover:border-[var(--indigo)] hover:bg-indigo-50/50';

                          if (srsFeedback) {
                            if (isTarget) {
                              style = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                            } else if (isSelected && !isTarget) {
                              style = 'bg-rose-100 border-rose-500 text-rose-900 font-bold shadow-xs';
                            } else {
                              style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60 pointer-events-none';
                            }
                          }

                          return (
                            <button
                              key={opt.id || idx}
                              onClick={() => handleSrsMcqChoiceSelect(opt)}
                              disabled={srsFeedback !== null}
                              className={`p-4 border-2 rounded-xl text-center min-h-[64px] flex flex-col items-center justify-center transition ${style}`}
                            >
                              <span className="text-2xl font-medium font-jp">{opt.jp}</span>
                              {srsFeedback && <span className="text-xs font-normal text-gray-500 mt-1">{opt.vi}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {srsFeedback && (
                    <div className="space-y-2 pt-2">
                      <div className={`text-sm font-semibold transition ${srsFeedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {srsFeedback.msg}
                      </div>
                      {srsFeedback.oldLevel !== undefined && srsFeedback.newLevel !== undefined && (
                        <div className="flex items-center justify-center gap-2 pt-0.5">
                          {renderSrsChip(srsFeedback.oldLevel)}
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                          {renderSrsChip(srsFeedback.newLevel)}
                        </div>
                      )}
                    </div>
                  )}

                  {srsFeedback ? (
                    <div className="pt-2">
                      <button
                        onClick={advanceSrsCard}
                        autoFocus
                        className="w-full py-2.5 bg-[var(--indigo)] text-white rounded-lg text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        Tiếp tục <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : srsQuizMode === 'jp2romaji' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={advanceSrsCard}
                        className="px-4 py-2.5 border border-gray-300 text-[var(--ink-soft)] rounded-lg text-xs font-semibold hover:bg-gray-100"
                      >
                        Bỏ qua
                      </button>
                      <button
                        onClick={() => handleSrsGrade(srsInput.trim().toLowerCase() === currentSrsCard.romaji.toLowerCase())}
                        className="flex-1 py-2.5 bg-[var(--indigo)] text-white rounded-lg text-xs font-bold hover:bg-[var(--indigo-deep)] transition"
                      >
                        Kiểm tra
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-[var(--ink-soft)] py-8">Chưa có từ vựng nào cần ôn tập hôm nay!</p>
              )}
            </div>
          </section>
        )}

        {/* TAB 4: LUYỆN TẬP TỰ DO (STANDALONE) */}
        {activeTab === 'quiz' && (
          <section className="space-y-4">
            {/* Quiz Mode Tabs with Icons */}
            <div className="flex gap-1.5 bg-[#FFFDF9] p-1.5 border border-[var(--card-border)] rounded-2xl overflow-x-auto no-scrollbar whitespace-nowrap">
              <button
                onClick={() => setQuizMode('jp2romaji')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  quizMode === 'jp2romaji'
                    ? 'bg-[var(--indigo)] text-white shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                Từ → Romaji
              </button>
              <button
                onClick={() => setQuizMode('romaji2jp')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  quizMode === 'romaji2jp'
                    ? 'bg-[var(--indigo)] text-white shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                Romaji → Chữ
              </button>
              <button
                onClick={() => setQuizMode('mcq')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  quizMode === 'mcq'
                    ? 'bg-[var(--indigo)] text-white shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Trắc nghiệm
              </button>
              <button
                onClick={() => setQuizMode('audio')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  quizMode === 'audio'
                    ? 'bg-[var(--indigo)] text-white shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                Luyện nghe
              </button>
              <button
                onClick={() => setQuizMode('match')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  quizMode === 'match'
                    ? 'bg-[var(--indigo)] text-white shadow-2xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Ghép cặp
              </button>
            </div>

            {/* Multi-selection Folder Filter & Controls */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 whitespace-nowrap">
                <button
                  onClick={() => setQuizFolderIds(['all'])}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
                    quizFolderIds.includes('all')
                      ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                      : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                  }`}
                >
                  Tất cả ({words.length})
                </button>

                {folders.map(f => {
                  const isSelected = !quizFolderIds.includes('all') && quizFolderIds.includes(f.id);
                  const wordCount = words.filter(w => w.folder_id === f.id).length;
                  return (
                    <button
                      key={f.id}
                      onClick={() => toggleQuizFolder(f.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[var(--indigo)] text-white border-[var(--indigo)] shadow-2xs'
                          : 'bg-white text-[var(--ink-soft)] border-[var(--card-border)] hover:border-[var(--indigo)]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {f.name} ({wordCount})
                    </button>
                  );
                })}
              </div>

              {/* Progress & Speaker Toggle & Report List Button */}
              <div className="flex items-center justify-between pt-2 gap-2">
                <div className="flex items-center gap-2">
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

                  <button
                    onClick={() => setReportListModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition flex items-center gap-1.5"
                    title="Xem lại các từ bị báo cáo lỗi nhập liệu"
                  >
                    <Flag className="w-3.5 h-3.5 text-rose-600" />
                    Báo cáo lỗi {reports.length > 0 && <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-bold rounded-full">{reports.length}</span>}
                  </button>
                </div>

                {!quizCompletedDeck && quizTotalCount > 0 && (
                  <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 ml-auto">
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
                      Chúc mừng! Bạn đã ôn luyện qua toàn bộ <strong>{quizTotalCount} từ vựng</strong> trong lượt học này.
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
                    {/* SRS Level Chip & Report Icon */}
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[var(--card-border)]/50">
                      <button
                        onClick={() => { setReportingWord(currentQuizCard); setReportModalOpen(true); }}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 text-xs font-semibold"
                        title="Báo cáo lỗi nhập liệu từ này"
                      >
                        <Flag className="w-4 h-4" />
                        <span className="text-[11px] font-medium text-gray-500 hover:text-rose-600">Báo lỗi</span>
                      </button>
                      <div>
                        {renderSrsChip(currentQuizCard.srs_level, isWordSrsDue(currentQuizCard))}
                      </div>
                    </div>

                    {quizMode === 'jp2romaji' ? (
                      <>
                        <div className="py-4">
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (quizFeedback) {
                                advanceCard();
                              } else {
                                handleGrade(quizInput.trim().toLowerCase() === currentQuizCard.romaji.toLowerCase());
                              }
                            }
                          }}
                          placeholder=""
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

                    {quizFeedback && (
                      <div className="space-y-2 pt-2">
                        <div className={`text-sm font-semibold transition ${quizFeedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {quizFeedback.msg}
                        </div>
                        {quizFeedback.oldLevel !== undefined && quizFeedback.newLevel !== undefined && (
                          <div className="flex items-center justify-center gap-2 pt-0.5">
                            {renderSrsChip(quizFeedback.oldLevel)}
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                            {renderSrsChip(quizFeedback.newLevel)}
                          </div>
                        )}
                      </div>
                    )}

                    {quizFeedback ? (
                      <div className="pt-2">
                        <button
                          onClick={advanceCard}
                          autoFocus
                          className="w-full py-2.5 bg-[var(--indigo)] text-white rounded-lg text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          Tiếp tục <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
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
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[var(--ink-soft)] py-8">Chưa có từ vựng phù hợp trong thư mục đã chọn.</p>
                )}
              </div>
            )}

            {/* QUIZ MODE 3 & 4: TRẮC NGHIỆM (ROMAJI -> JP) & LUYỆN NGHE (AUDIO -> JP) */}
            {(quizMode === 'mcq' || quizMode === 'audio') && (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl text-center space-y-5">
                {quizCompletedDeck ? (
                  <div className="py-8 space-y-4">
                    <div className="inline-flex p-4 bg-amber-100 text-amber-700 rounded-full">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành lượt học!</h3>
                    <p className="text-sm text-[var(--ink-soft)] max-w-sm mx-auto">
                      Chúc mừng! Bạn đã hoàn thành bài trắc nghiệm cho <strong>{quizTotalCount} từ vựng</strong> trong lượt học này.
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
                    {/* SRS Level Chip Indicator */}
                    <div className="flex justify-center mb-1">
                      {renderSrsChip(currentQuizCard.srs_level, isWordSrsDue(currentQuizCard))}
                    </div>

                    {/* Header Question */}
                    <div className="py-2 space-y-3 border-b border-[var(--card-border)] pb-4 flex flex-col items-center justify-center">
                      {quizMode === 'mcq' ? (
                        <>
                          <div className="inline-flex items-center gap-3">
                            <span className="text-3xl font-bold font-jetbrains text-[var(--indigo-deep)]">{currentQuizCard.romaji}</span>
                            <button
                              onClick={() => speakJapanese(currentQuizCard.jp)}
                              title="Nghe phát âm"
                              className="p-2 rounded-full text-[var(--indigo)] hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Minimalist Audio Icon Button */}
                          <div className="py-2">
                            <button
                              onClick={() => speakJapanese(currentQuizCard.jp)}
                              className="p-5 bg-indigo-50 border-2 border-[var(--indigo)] text-[var(--indigo)] rounded-full hover:bg-indigo-100 active:scale-95 transition shadow-sm inline-flex items-center justify-center"
                              title="Bấm để nghe lại phát âm"
                            >
                              <Volume2 className="w-8 h-8 animate-pulse text-[var(--indigo)]" />
                            </button>
                          </div>
                          {quizFeedback && (
                            <div className="text-lg font-bold font-jp text-[var(--indigo-deep)]">
                              {currentQuizCard.jp} <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">({currentQuizCard.romaji})</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* 4 Japanese Word Choice Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {quizMcqOptions.map((opt, idx) => {
                        const isSelected = selectedMcqWordId === opt.id;
                        const isTarget = opt.id === currentQuizCard.id;

                        let style = 'bg-white border-[var(--card-border)] text-[var(--ink)] hover:border-[var(--indigo)] hover:bg-indigo-50/50';

                        if (quizFeedback) {
                          if (isTarget) {
                            style = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                          } else if (isSelected && !isTarget) {
                            style = 'bg-rose-100 border-rose-500 text-rose-900 font-bold shadow-xs';
                          } else {
                            style = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60 pointer-events-none';
                          }
                        }

                        return (
                          <button
                            key={opt.id || idx}
                            onClick={() => handleMcqChoiceSelect(opt)}
                            disabled={quizFeedback !== null}
                            className={`p-4 border-2 rounded-xl text-center min-h-[64px] flex flex-col items-center justify-center transition ${style}`}
                          >
                            <span className="text-2xl font-medium font-jp">{opt.jp}</span>
                            {quizFeedback && <span className="text-xs font-normal text-gray-500 mt-1">{opt.vi}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Next Button */}
                    {quizFeedback && (
                      <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                          <div className={`text-sm font-semibold transition ${quizFeedback.type === 'ok' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {quizFeedback.msg}
                          </div>
                          {quizFeedback.oldLevel !== undefined && quizFeedback.newLevel !== undefined && (
                            <div className="flex items-center justify-center gap-2 pt-0.5">
                              {renderSrsChip(quizFeedback.oldLevel)}
                              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                              {renderSrsChip(quizFeedback.newLevel)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={advanceCard}
                          autoFocus
                          className="w-full py-2.5 bg-[var(--indigo)] text-white rounded-lg text-xs font-bold hover:bg-[var(--indigo-deep)] transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          Tiếp tục <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-[var(--ink-soft)] py-8">Chưa có đủ từ vựng trong thư mục đã chọn để tạo bài trắc nghiệm.</p>
                )}
              </div>
            )}

            {/* QUIZ MODE 5: MATCH GAME (ROMAJI <-> JP WORD) */}
            {quizMode === 'match' && (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl space-y-4">
                {matchCompletedAll ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex p-4 bg-emerald-100 text-emerald-700 rounded-full">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành ghép toàn bộ thư mục!</h3>
                    <p className="text-sm text-[var(--ink-soft)]">
                      Bạn đã ghép thành công tất cả các từ trong lượt học này.
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
                    <div className="flex justify-end items-center text-xs text-[var(--ink-soft)] mb-2 font-semibold">
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
                            className={`p-3 border-2 rounded-lg text-center min-h-[56px] flex items-center justify-center transition shadow-2xs ${
                              tile.type === 'jp' ? 'font-jp font-medium text-xl' : 'font-jetbrains font-bold text-sm text-[var(--indigo)]'
                            } ${style}`}
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

        {/* TAB 5: BẢNG CHỮ CÁI (KANA CHART) */}
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
                    className={`px-3 py-1.5 rounded-md transition ${kanaScript === 'both' ? 'bg-[var(--indigo)] text-white' : 'text-[var(--indigo)] hover:text-[var(--indigo)]'}`}
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

        {/* TAB 6: LÝ THUYẾT TIẾNG NHẬT (TỔNG HỢP MULTI-SUBTABS) */}
        {activeTab === 'theory' && (
          <section className="space-y-5 bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-2xl shadow-xs">
            {/* Header & Subtab Navigation */}
            <div className="space-y-4 border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-[var(--indigo)]" />
                  Lý thuyết
                </h2>
              </div>

              {/* Subtabs Selector */}
              <div className="flex items-center gap-1.5 bg-[#EEF2F7] p-1.5 rounded-xl overflow-x-auto no-scrollbar whitespace-nowrap text-xs font-semibold">
                <button
                  onClick={() => setTheorySubTab('choon')}
                  className={`px-4 py-2 rounded-lg transition shrink-0 ${
                    theorySubTab === 'choon'
                      ? 'bg-[var(--indigo)] text-white shadow-2xs'
                      : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                  }`}
                >
                  Trường âm (長音)
                </button>
                <button
                  onClick={() => setTheorySubTab('suuji')}
                  className={`px-4 py-2 rounded-lg transition shrink-0 ${
                    theorySubTab === 'suuji'
                      ? 'bg-[var(--indigo)] text-white shadow-2xs'
                      : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                  }`}
                >
                  Số đếm (数字)
                </button>
              </div>
            </div>

            {/* SUBTAB 1: TRƯỜNG ÂM */}
            {theorySubTab === 'choon' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[var(--indigo-deep)]">Quy tắc Trường âm (長音 - Chōon)</h3>
                  <p className="text-xs text-[var(--ink-soft)]">
                    Trường âm là việc kéo dài phát âm của nguyên âm đứng trước gấp 2 lần thời lượng (2 nhịp/phách).
                  </p>
                </div>

                {/* Section 1: Quy tắc Hiragana */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--indigo-deep)] uppercase tracking-wider">
                    1. Quy tắc 5 Hàng âm (Hiragana)
                  </h4>
                  
                  <div className="overflow-x-auto border border-[var(--card-border)] rounded-xl bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#EEF2F7] text-[var(--indigo-deep)] font-bold border-b border-[var(--card-border)]">
                        <tr>
                          <th className="p-3">Hàng âm</th>
                          <th className="p-3">Quy tắc (Chữ đi sau)</th>
                          <th className="p-3">Ví dụ</th>
                          <th className="p-3">Cách đọc ngân</th>
                          <th className="p-3">Nghĩa</th>
                          <th className="p-3 text-center">Nghe</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--card-border)]">
                        <tr className="hover:bg-amber-50/40">
                          <td className="p-3 font-semibold">Hàng A (あ)</td>
                          <td className="p-3 font-bold text-amber-700">Thêm あ</td>
                          <td className="p-3 font-jp text-sm">おかあさん</td>
                          <td className="p-3 font-jetbrains font-semibold text-[var(--indigo)]">Okāsan</td>
                          <td className="p-3 text-gray-600">Mẹ</td>
                          <td className="p-3 text-center">
                            <button onClick={() => speakJapanese('おかあさん')} className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50/40">
                          <td className="p-3 font-semibold">Hàng I (い)</td>
                          <td className="p-3 font-bold text-amber-700">Thêm い</td>
                          <td className="p-3 font-jp text-sm">おじいさん</td>
                          <td className="p-3 font-jetbrains font-semibold text-[var(--indigo)]">Ojīsan</td>
                          <td className="p-3 text-gray-600">Ông</td>
                          <td className="p-3 text-center">
                            <button onClick={() => speakJapanese('おじいさん')} className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50/40">
                          <td className="p-3 font-semibold">Hàng U (う)</td>
                          <td className="p-3 font-bold text-amber-700">Thêm う</td>
                          <td className="p-3 font-jp text-sm">くうき</td>
                          <td className="p-3 font-jetbrains font-semibold text-[var(--indigo)]">Kūki</td>
                          <td className="p-3 text-gray-600">Không khí</td>
                          <td className="p-3 text-center">
                            <button onClick={() => speakJapanese('くうき')} className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50/40">
                          <td className="p-3 font-semibold">Hàng E (え)</td>
                          <td className="p-3 font-bold text-emerald-700">Thêm い (95%)</td>
                          <td className="p-3 font-jp text-sm">えいが</td>
                          <td className="p-3 font-jetbrains font-semibold text-[var(--indigo)]">Ēga (Eiga)</td>
                          <td className="p-3 text-gray-600">Phim điện ảnh</td>
                          <td className="p-3 text-center">
                            <button onClick={() => speakJapanese('えいが')} className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-amber-50/40">
                          <td className="p-3 font-semibold">Hàng O (お)</td>
                          <td className="p-3 font-bold text-emerald-700">Thêm う (95%)</td>
                          <td className="p-3 font-jp text-sm">おとうさん</td>
                          <td className="p-3 font-jetbrains font-semibold text-[var(--indigo)]">Otōsan (Otousan)</td>
                          <td className="p-3 text-gray-600">Bố</td>
                          <td className="p-3 text-center">
                            <button onClick={() => speakJapanese('おとうさん')} className="p-1 rounded-full text-[var(--indigo)] hover:bg-indigo-50">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 2: Katakana */}
                <div className="space-y-2 p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <h4 className="text-xs font-bold text-[var(--indigo-deep)]">
                    Trường âm trong Katakana (Từ mượn tiếng Anh)
                  </h4>
                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    Tất cả trường âm trong Katakana đều dùng duy nhất một dấu gạch ngang <strong>ー</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-indigo-200 flex items-center justify-between">
                      <span>ケーキ (Kēki - Bánh)</span>
                      <button onClick={() => speakJapanese('ケーキ')} className="text-[var(--indigo)]"><Volume2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-indigo-200 flex items-center justify-between">
                      <span>コーヒー (Kōhī - Cà phê)</span>
                      <button onClick={() => speakJapanese('コーヒー')} className="text-[var(--indigo)]"><Volume2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-indigo-200 flex items-center justify-between">
                      <span>スーパー (Sūpā - Siêu thị)</span>
                      <button onClick={() => speakJapanese('スーパー')} className="text-[var(--indigo)]"><Volume2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Cặp từ dễ nhầm lẫn */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[var(--indigo-deep)] uppercase tracking-wider flex items-center gap-1.5">
                    Các cặp từ dễ nhầm lẫn nhất (Âm ngắn vs Trường âm)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-[var(--card-border)] rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-rose-700 font-semibold">
                        <span>おじさん (Ojisan - Âm ngắn 1 nhịp)</span>
                        <span className="text-gray-500">Chú / Bác</span>
                        <button onClick={() => speakJapanese('おじさん')} className="text-[var(--indigo)]"><Volume2 className="w-4 h-4" /></button>
                      </div>
                      <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center text-emerald-700 font-semibold">
                        <span>おじいさん (Ojīsan - Dài 2 nhịp)</span>
                        <span className="text-gray-500">Ông</span>
                        <button onClick={() => speakJapanese('おじいさん')} className="text-[var(--indigo)]"><Volume2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-[var(--card-border)] rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-rose-700 font-semibold">
                        <span>おばさん (Obasan - Âm ngắn 1 nhịp)</span>
                        <span className="text-gray-500">Cô / Dì</span>
                        <button onClick={() => speakJapanese('obasan')} className="text-[var(--indigo)]"><Volume2 className="w-4 h-4" /></button>
                      </div>
                      <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center text-emerald-700 font-semibold">
                        <span>おばあさん (Obāsan - Dài 2 nhịp)</span>
                        <span className="text-gray-500">Bà</span>
                        <button onClick={() => speakJapanese('おばあさん')} className="text-[var(--indigo)]"><Volume2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: SỐ ĐẾM (GỌN GÀNG - DỄ NHÌN) */}
            {theorySubTab === 'suuji' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Header & Sub-pills */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FFFDF9] p-4 border border-[var(--card-border)] rounded-2xl shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-[var(--indigo-deep)]">Quy tắc Số đếm & Trợ từ đếm (数字 - Sūji)</h3>
                    <p className="text-xs text-[var(--ink-soft)] font-medium">Chọn chủ đề bên dưới để xem từng phần rành mạch, không bị ngợp:</p>
                  </div>

                  <div className="flex gap-1 bg-[#EEF2F7] p-1 rounded-xl shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setSuujiTab('basic')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        suujiTab === 'basic'
                          ? 'bg-[var(--indigo)] text-white shadow-2xs'
                          : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                      }`}
                    >
                      Số 1 ~ 10
                    </button>
                    <button
                      onClick={() => setSuujiTab('combine')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        suujiTab === 'combine'
                          ? 'bg-[var(--indigo)] text-white shadow-2xs'
                          : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                      }`}
                    >
                      Ghép số lớn
                    </button>
                    <button
                      onClick={() => setSuujiTab('counters')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        suujiTab === 'counters'
                          ? 'bg-[var(--indigo)] text-white shadow-2xs'
                          : 'text-[var(--ink-soft)] hover:text-[var(--indigo)]'
                      }`}
                    >
                      Trợ từ đếm
                    </button>
                  </div>
                </div>

                {/* TAB 1: SỐ ĐẾM CƠ BẢN 1 - 10 */}
                {suujiTab === 'basic' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { num: '1', jp: 'いち', romaji: 'ichi' },
                        { num: '2', jp: 'に', romaji: 'ni' },
                        { num: '3', jp: 'さん', romaji: 'san' },
                        { num: '4', jp: 'よん / し', romaji: 'yon / shi' },
                        { num: '5', jp: 'ご', romaji: 'go' },
                        { num: '6', jp: 'ろく', romaji: 'roku' },
                        { num: '7', jp: 'なな / しち', romaji: 'nana / shichi' },
                        { num: '8', jp: 'はち', romaji: 'hachi' },
                        { num: '9', jp: 'きゅう / く', romaji: 'kyuu / ku' },
                        { num: '10', jp: 'じゅう', romaji: 'juu' },
                      ].map(item => (
                        <div key={item.num} className="p-3 bg-white border border-[var(--card-border)] rounded-2xl text-center space-y-1 shadow-2xs hover:border-[var(--indigo)] transition">
                          <div className="text-[11px] font-bold text-amber-700">Số {item.num}</div>
                          <div className="text-lg font-jp font-bold text-[var(--indigo-deep)]">{item.jp}</div>
                          <div className="text-[11px] font-jetbrains text-gray-500">{item.romaji}</div>
                          <button onClick={() => speakJapanese(item.jp.split('/')[0].trim())} className="p-1 text-[var(--indigo)] hover:bg-indigo-50 rounded-full mt-1">
                            <Volume2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: CÁCH GHÉP SỐ LỚN (11 ~ VẠN) */}
                {suujiTab === 'combine' && (
                  <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-900 font-medium">
                      💡 <strong>Công thức ghép chung:</strong> <code className="bg-white px-2 py-0.5 rounded border border-indigo-200 font-bold text-[var(--indigo-deep)]">[Số] + [Đơn vị hàng] + [Số tiếp theo]</code>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Hàng chục */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>Hàng chục (11 ~ 99)</span>
                          <span className="text-xs font-jetbrains font-normal text-amber-700">じゅう (juu)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--ink-soft)] pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center"><span>• 15 (10 + 5):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">じゅうご</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (juu-go)</span></div></div>
                            <div className="flex justify-between items-center"><span>• 23 (2x10 + 3):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にじゅうさん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-juu-san)</span></div></div>
                          </div>
                          <div className="space-y-1 sm:border-l sm:pl-3 border-gray-100">
                            <div className="flex justify-between items-center"><span>• 47 (4x10 + 7):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんじゅうなな</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-juu-nana)</span></div></div>
                            <div className="flex justify-between items-center"><span>• 99 (9x10 + 9):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">きゅうじゅうきゅう</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (kyuu-juu-kyuu)</span></div></div>
                          </div>
                        </div>
                      </div>

                      {/* Hàng trăm */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>Hàng trăm (100 ~ 999)</span>
                          <span className="text-xs font-jetbrains font-normal text-amber-700">ひゃく (hyaku)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Đọc bình thường */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đọc bình thường:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 200:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にひゃく</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-hyaku)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 152:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ひゃくごじゅうに</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (hyaku-go-juu-ni)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 425:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんひゃくにじゅうご</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-hyaku-ni-juu-go)</span></div></div>
                            </div>
                          </div>

                          {/* Phải: Biến âm */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Biến âm:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 300:</span> <div><strong className="font-jp text-sm text-rose-900">さんびゃく</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (sam-byaku)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 600:</span> <div><strong className="font-jp text-sm text-rose-900">ろっぴゃく</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (ro-ppyaku)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 800:</span> <div><strong className="font-jp text-sm text-rose-900">はっぴゃく</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (ha-ppyaku)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hàng nghìn */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>Hàng nghìn (1.000 ~ 9.999)</span>
                          <span className="text-xs font-jetbrains font-normal text-amber-700">せん (sen)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Đọc bình thường */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đọc bình thường:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 2000:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にせん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-sen)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 2026:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にせんにじゅうろく</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-sen-ni-juu-roku)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 1995:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">せんきゅうひゃくきゅうじゅうご</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (sen-kyuu-hyaku-kyuu-juu-go)</span></div></div>
                            </div>
                          </div>

                          {/* Phải: Biến âm */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Biến âm:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 3000:</span> <div><strong className="font-jp text-sm text-rose-900">さんぜん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (san-zen)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 8000:</span> <div><strong className="font-jp text-sm text-rose-900">はっせん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (has-sen)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hàng vạn */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>Hàng vạn (10.000+)</span>
                          <span className="text-xs font-jetbrains font-normal text-amber-700">万 (まん - man)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center"><span>• 10.000 (1 Vạn):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">いちまん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ichi-man)</span></div></div>
                            <div className="flex justify-between items-center"><span>• 25.000 (2 Vạn 5k):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にまんごせん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-man-go-sen)</span></div></div>
                          </div>
                          <div className="space-y-1 sm:border-l sm:pl-3 border-gray-100">
                            <div className="flex justify-between items-center"><span>• 100.000 (10 Vạn):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">じゅうまん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (juu-man)</span></div></div>
                            <div className="flex justify-between items-center"><span>• 1.000.000 (100 Vạn):</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ひゃくまん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (hyaku-man)</span></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: TRỢ TỪ ĐẾM THÔNG DỤNG (KEY-VALUE ALIGNED ROW LAYOUT) */}
                {suujiTab === 'counters' && (
                  <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 font-medium">
                      💡 <strong>Quy tắc ghép đếm chuẩn:</strong> Cột Trái là cách đọc ghép trực tiếp <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">Số cơ bản + Trợ từ</code>. Cột Phải ghi nhận các trường hợp biến âm / đặc biệt.
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Đếm Tuổi */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>1. Đếm Tuổi (-歳 / さい)</span>
                          <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">sai</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Đếm bình thường */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đếm bình thường:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 2歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">さんさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 4歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 6歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ろくさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (roku-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 7歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ななさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (nana-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 9歳:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">きゅうさい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (kyuu-sai)</span></div></div>
                            </div>
                          </div>

                          {/* Phải: Biến âm & Đặc biệt */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Biến âm & Đặc biệt:</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 1歳:</span> <div><strong className="font-jp text-sm text-rose-900">いっさい</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (is-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 8歳:</span> <div><strong className="font-jp text-sm text-rose-900">はっさい</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (has-sai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 10歳:</span> <div><strong className="font-jp text-sm text-rose-900">じゅっさい</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (jus-sai)</span></div></div>
                              <div className="flex justify-between items-center pt-1 border-t border-dashed"><span>• 20歳 (Đặc biệt):</span> <div><strong className="font-jp text-sm text-amber-900">はたち</strong> <span className="font-jetbrains text-amber-700 text-xs font-semibold"> (hatachi)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Đếm Người */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>2. Đếm Người (-人 / にん)</span>
                          <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">nin</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Đếm bình thường */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đếm bình thường (từ 3 người):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 3人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">場所にん $\rightarrow$ さんにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-nin)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 4人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-nin)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-nin)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 6人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ろくにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (roku-nin)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 7人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ななにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (nana-nin)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 8人:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">はちにん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (hachi-nin)</span></div></div>
                            </div>
                          </div>

                          {/* Phải: Đặc biệt */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-amber-800 font-bold text-[11px] border-b border-amber-100 pb-1">• Đặc biệt (Thuần Nhật):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 1 người:</span> <div><strong className="font-jp text-sm text-amber-900">ひとり</strong> <span className="font-jetbrains text-amber-700 text-xs font-semibold"> (hitori)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 2 người:</span> <div><strong className="font-jp text-sm text-amber-900">ふたり</strong> <span className="font-jetbrains text-amber-700 text-xs font-semibold"> (futari)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Đếm Giờ & Phút */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>3. Đếm Giờ & Phút (-時 & -分)</span>
                          <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">ji / fun-pun</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Tiêu chuẩn */}
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Giờ bình thường (-時 / ji):</div>
                              <div className="flex justify-between items-center"><span>• 1時:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">いちじ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ichi-ji)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 2時:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にじ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-ji)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3時:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">さんじ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-ji)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5時:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごじ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-ji)</span></div></div>
                            </div>
                            <div className="space-y-1 pt-1 border-t border-dashed">
                              <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Phút bình thường (-fun):</div>
                              <div className="flex justify-between items-center"><span>• 2分:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にふん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-fun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5分:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごふん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-fun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 7分:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ななふん</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (nana-fun)</span></div></div>
                            </div>
                          </div>

                          {/* Phải: Chú ý & Biến âm */}
                          <div className="space-y-2 sm:border-l sm:pl-3 border-gray-100">
                            <div className="space-y-1">
                              <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Giờ chú ý:</div>
                              <div className="flex justify-between items-center"><span>• 4時:</span> <div><strong className="font-jp text-sm text-rose-900">よじ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (yo-ji)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 7時:</span> <div><strong className="font-jp text-sm text-rose-900">しちじ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (shichi-ji)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 9時:</span> <div><strong className="font-jp text-sm text-rose-900">くじ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (ku-ji)</span></div></div>
                            </div>
                            <div className="space-y-1 pt-1 border-t border-dashed">
                              <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Phút biến âm (-pun):</div>
                              <div className="flex justify-between items-center"><span>• 1分:</span> <div><strong className="font-jp text-sm text-rose-900">いっぷん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (ip-pun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3分:</span> <div><strong className="font-jp text-sm text-rose-900">さんぷん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (sam-pun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 6分:</span> <div><strong className="font-jp text-sm text-rose-900">ろっぷん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (rop-pun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 8分:</span> <div><strong className="font-jp text-sm text-rose-900">はっぷん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (hap-pun)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 10分:</span> <div><strong className="font-jp text-sm text-rose-900">じゅっぷん</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (jup-pun)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vật mỏng & Máy móc */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>4. Vật mỏng (-枚) & Máy móc (-台)</span>
                          <span className="text-xs font-jetbrains font-semibold text-emerald-700">100% Đếm bình thường</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái: Vật mỏng */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đếm vật mỏng (-枚 / mai):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 1枚:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">いちまい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ichi-mai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 2枚:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にまい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-mai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3枚:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">さんまい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-mai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 4枚:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんまい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-mai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5枚:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごまい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-mai)</span></div></div>
                            </div>
                          </div>
                          {/* Phải: Máy móc */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đếm xe cộ/máy móc (-台 / dai):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 1台:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">いちだい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ichi-dai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 2台:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にだい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-dai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3台:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">さんだい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-dai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 4台:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんだい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-dai)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5台:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごだい</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-dai)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Đếm Đồ vật nhỏ */}
                      <div className="p-4 bg-white border border-[var(--card-border)] rounded-2xl space-y-2 shadow-2xs">
                        <div className="font-bold text-sm text-[var(--indigo-deep)] border-b pb-1.5 flex justify-between items-center">
                          <span>5. Đếm Đồ vật nhỏ (-個 / こ)</span>
                          <span className="text-xs font-jetbrains font-semibold text-[var(--indigo)]">ko</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--ink-soft)] pt-1">
                          {/* Trái */}
                          <div className="space-y-1.5">
                            <div className="text-emerald-700 font-bold text-[11px] border-b border-emerald-100 pb-1">• Đếm bình thường (-ko):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 2個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">にこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (ni-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 3個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">さんこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (san-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 4個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">よんこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (yon-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 5個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ごこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (go-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 7個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">ななこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (nana-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 9個:</span> <div><strong className="font-jp text-sm text-[var(--ink)]">きゅうこ</strong> <span className="font-jetbrains text-[var(--indigo)] text-xs font-semibold"> (kyuu-ko)</span></div></div>
                            </div>
                          </div>
                          {/* Phải */}
                          <div className="space-y-1.5 sm:border-l sm:pl-3 border-gray-100">
                            <div className="text-rose-700 font-bold text-[11px] border-b border-rose-100 pb-1">• Âm ngắt chú ý (-kko):</div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center"><span>• 1個:</span> <div><strong className="font-jp text-sm text-rose-900">いっこ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (ik-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 6個:</span> <div><strong className="font-jp text-sm text-rose-900">ろっこ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (rok-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 8個:</span> <div><strong className="font-jp text-sm text-rose-900">はっこ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (hak-ko)</span></div></div>
                              <div className="flex justify-between items-center"><span>• 10個:</span> <div><strong className="font-jp text-sm text-rose-900">じゅっこ</strong> <span className="font-jetbrains text-rose-700 text-xs font-semibold"> (juk-ko)</span></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Report Word Modal */}
      <ReportWordModal
        isOpen={reportModalOpen}
        onClose={() => { setReportModalOpen(false); setReportingWord(null); }}
        word={reportingWord}
        onSubmitReport={handleSubmitReport}
      />

      {/* Report List Modal */}
      <ReportListModal
        isOpen={reportListModalOpen}
        onClose={() => setReportListModalOpen(false)}
        reports={reports}
        words={words}
        onUpdateWord={handleUpdateWordFromReport}
        onResolveReport={handleResolveReport}
        onDeleteWord={handleDeleteWord}
      />
    </div>
  );
}
