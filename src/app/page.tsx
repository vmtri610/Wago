'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { kanaToRomaji } from '@/lib/kana';
import { speakJapanese } from '@/lib/audio';
import { 
  BookOpen, Plus, List, Brain, Search, Trash2, Edit2, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, FolderPlus, Check, X, RotateCcw,
  Trophy, ArrowRight, Volume2, VolumeX, Menu, PanelLeftClose, PanelLeftOpen,
  Headphones, CheckSquare, Layers, Clock, Flame, Share2, Flag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import UserMenu from '@/components/auth/UserMenu';
import AuthLanding from '@/components/auth/AuthLanding';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import ShareFolderModal from '@/components/folder/ShareFolderModal';
import ReportWordModal from '@/components/report/ReportWordModal';
import ReportListModal from '@/components/report/ReportListModal';

import FolderFilterBar from '@/components/folder/FolderFilterBar';
import SrsReviewCard from '@/components/srs/SrsReviewCard';
import QuizPracticeCard from '@/components/quiz/QuizPracticeCard';
import WordListSection from '@/components/words/WordListSection';
import LessonsTab from '@/components/lessons/LessonsTab';
import { N5_LESSONS } from '@/data/lessonsData';

export interface Folder {
  id: string;
  name: string;
  user_id?: string;
  shared_with?: string[];
}

export interface Word {
  id: string;
  folder_id?: string | null;
  lesson_id?: number | null;
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

  // Core App State
  const [activeTab, setActiveTab] = useState<'lessons' | 'srs' | 'quiz' | 'list' | 'add'>('lessons');
  const [words, setWords] = useState<Word[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [dbLessons, setDbLessons] = useState<any[]>([]);
  const [lessonStatuses, setLessonStatuses] = useState<Record<number, 'not_started' | 'in_progress' | 'completed'>>({
    1: 'in_progress'
  });
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<{ mode: 'supabase' | 'local'; message: string }>({
    mode: 'local',
    message: 'Đang kết nối...'
  });

  // Form State
  const [inJp, setInJp] = useState('');
  const [inRomaji, setInRomaji] = useState('');
  const [inVi, setInVi] = useState('');
  const [inFolderId, setInFolderId] = useState('');
  const [isAutoLookingUp, setIsAutoLookingUp] = useState(false);

  // Folder Management State
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  // -------------------------------------------------------------
  // SRS TAB STATE (Default Mode: vi2jp)
  // -------------------------------------------------------------
  const [srsQuizMode, setSrsQuizMode] = useState<'vi2jp' | 'mcq' | 'audio'>('vi2jp');
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
  // STANDALONE QUIZ / FLASHCARD TAB STATE (Default Mode: flashcard)
  // -------------------------------------------------------------
  const [quizMode, setQuizMode] = useState<'flashcard' | 'vi2jp' | 'mcq' | 'audio'>('flashcard');
  const [quizFolderIds, setQuizFolderIds] = useState<string[]>(['all']);
  const [quizDeck, setQuizDeck] = useState<Word[]>([]);
  const [quizTotalCount, setQuizTotalCount] = useState<number>(0);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [currentQuizCard, setCurrentQuizCard] = useState<Word | null>(null);
  const [quizCompletedDeck, setQuizCompletedDeck] = useState<boolean>(false);
  const [quizInput, setQuizInput] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'ok' | 'no'; msg: string; oldLevel?: number; newLevel?: number } | null>(null);
  const [quizMcqOptions, setQuizMcqOptions] = useState<Word[]>([]);
  const [selectedMcqWordId, setSelectedMcqWordId] = useState<string | null>(null);

  // Check if SRS word is due
  const isWordSrsDue = (w: Word) => {
    if (!w.next_review_at) return true;
    return new Date(w.next_review_at) <= new Date();
  };

  // SRS Level Chip Renderer
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

  // Data Fetching
  const fetchData = async () => {
    try {
      const { data: fData, error: fError } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
      const { data: wData, error: wError } = await supabase.from('words').select('*').order('created_at', { ascending: false });

      if (fError || wError) throw new Error('Lỗi truy vấn DB');

      setFolders(fData || []);

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
        } catch (pErr) {}
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

      // Fetch lessons and user lesson progress
      try {
        const { data: dbLessonsData } = await supabase.from('lessons').select('id, title, short_title').order('id', { ascending: true });
        if (dbLessonsData && dbLessonsData.length > 0) {
          setDbLessons(dbLessonsData);
        }

        if (user?.id) {
          const { data: ulpData } = await supabase.from('user_lesson_progress').select('lesson_id, status').eq('user_id', user.id);
          if (ulpData && ulpData.length > 0) {
            const pMap: Record<number, 'not_started' | 'in_progress' | 'completed'> = { 1: 'in_progress' };
            ulpData.forEach((row: any) => {
              pMap[row.lesson_id] = row.status;
            });
            setLessonStatuses(pMap);
          }
        }
      } catch (lErr) {}

      try {
        const { data: rData } = await supabase.from('word_reports').select('*').eq('status', 'pending');
        if (rData) setReports(rData as WordReport[]);
      } catch (rErr) {}
    } catch (err: any) {
      console.error('Lỗi Supabase DB:', err?.message);
      setSyncStatus({ mode: 'local', message: 'Dữ liệu Local' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Jisho Lookup
  const handleJpChange = async (val: string) => {
    setInJp(val);
    if (!val.trim()) return;

    const rom = kanaToRomaji(val);
    if (!rom.unknown && rom.romaji) {
      setInRomaji(rom.romaji);
    }

    try {
      setIsAutoLookingUp(true);
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.romaji && (!inRomaji || rom.unknown)) {
          setInRomaji(data.result.romaji);
        }
        if (data.result.vi && !inVi) {
          setInVi(data.result.vi);
        }
      }
    } catch (err) {
    } finally {
      setIsAutoLookingUp(false);
    }
  };

  const handleSaveWord = async () => {
    if (!inJp.trim() || !inVi.trim()) return;

    const userFolders = folders.filter(f => !f.id.startsWith('lesson-'));
    const folder_id = inFolderId && !inFolderId.startsWith('lesson-')
      ? inFolderId
      : (userFolders.length > 0 ? userFolders[0].id : null);

    const newWord: Word = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      jp: inJp.trim(),
      romaji: inRomaji.trim() || inJp.trim(),
      vi: inVi.trim(),
      folder_id,
      lesson_id: null, // Personal words are strictly not lesson words
      srs_level: 0,
      next_review_at: new Date().toISOString(),
      user_id: user?.id
    };

    setWords([newWord, ...words]);
    setInJp('');
    setInRomaji('');
    setInVi('');

    try {
      await supabase.from('words').insert([{
        id: newWord.id,
        jp: newWord.jp,
        romaji: newWord.romaji,
        vi: newWord.vi,
        folder_id: newWord.folder_id,
        user_id: user?.id
      }]);
    } catch (e) {}
  };

  const handleDeleteWord = async (wordId: string) => {
    setWords(words.filter(w => w.id !== wordId));
    try {
      await supabase.from('words').delete().eq('id', wordId);
    } catch (e) {}
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;
    const name = newFolderName.trim();
    const newFolder: Folder = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name,
      user_id: user?.id
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');

    try {
      await supabase.from('folders').insert([{ id: newFolder.id, name, user_id: user?.id }]);
    } catch (e) {}
  };

  const handleDeleteFolder = async (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
    setWords(words.map(w => w.folder_id === folderId ? { ...w, folder_id: null } : w));
    if (activeFolder === folderId) setActiveFolder('all');

    try {
      await supabase.from('folders').delete().eq('id', folderId);
    } catch (e) {}
  };

  const handleRenameFolderCommit = async (folderId: string) => {
    if (!renameInputValue.trim()) return;
    const newName = renameInputValue.trim();
    setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f));
    setRenamingFolderId(null);

    try {
      await supabase.from('folders').update({ name: newName }).eq('id', folderId);
    } catch (e) {}
  };

  // Report Handlers
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

    setReports([newReport, ...reports]);
    try {
      await supabase.from('word_reports').insert({
        word_id: word.id,
        word_jp: word.jp,
        word_romaji: word.romaji,
        word_vi: word.vi,
        reason,
        status: 'pending',
      });
    } catch (err) {}
  };

  const handleResolveReport = async (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
    try {
      await supabase.from('word_reports').update({ status: 'resolved' }).eq('id', reportId);
    } catch (err) {}
  };

  const handleUpdateWordFromReport = async (updatedWord: Word) => {
    setWords(words.map(w => w.id === updatedWord.id ? updatedWord : w));
    try {
      await supabase.from('words').update({
        jp: updatedWord.jp,
        romaji: updatedWord.romaji,
        vi: updatedWord.vi,
      }).eq('id', updatedWord.id);
    } catch (err) {}
  };

  // In-progress lesson folders (Bài học nào ở chế độ Đang học thì tự động xuất hiện folder)
  const inProgressLessonFolders: Folder[] = Object.entries(lessonStatuses)
    .filter(([_, status]) => status === 'in_progress')
    .map(([lIdStr]) => {
      const lId = Number(lIdStr);
      const l = dbLessons.find((item: any) => item.id === lId) || N5_LESSONS.find(item => item.id === lId);
      return {
        id: `lesson-${lId}`,
        name: `${l?.short_title || `Bài ${lId}`}`
      };
    });

  const combinedFolders: Folder[] = [...folders, ...inProgressLessonFolders];

  // Chỉ bao gồm các từ trong folder tự tạo HOẶC thuộc bài học đang ở trạng thái 'in_progress'
  const activeWords = words.filter(w => {
    if (w.lesson_id) {
      return lessonStatuses[w.lesson_id] === 'in_progress';
    }
    return true; // Các từ trong thư mục cá nhân
  });

  // -------------------------------------------------------------
  // SRS ENGINE (Vie -> JP)
  // -------------------------------------------------------------
  const dueSrsWords = activeWords.filter(w => {
    const matchesFolder =
      srsFolderIds.includes('all') ||
      (w.folder_id && srsFolderIds.includes(w.folder_id)) ||
      (w.lesson_id && srsFolderIds.includes(`lesson-${w.lesson_id}`));
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

  const generateMcqOptions = (targetCard: Word, pool: Word[]) => {
    const distractors = pool.filter(w => w.id !== targetCard.id);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
    return [targetCard, ...shuffledDistractors].sort(() => Math.random() - 0.5);
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
      setSrsMcqOptions(generateMcqOptions(shuffled[0], words));
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
        setSrsMcqOptions(generateMcqOptions(nextDeck[0], words));
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

    setWords(words.map(w => w.id === updatedWord.id ? updatedWord : w));

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
    } catch (e) {}

    setSrsFeedback({
      type: ok ? 'ok' : 'no',
      msg: ok 
        ? `Chính xác — ${currentSrsCard.jp} (${currentSrsCard.romaji})`
        : `Chưa đúng — ${currentSrsCard.jp} (${currentSrsCard.romaji})`,
      oldLevel,
      newLevel
    });
  };

  const handleCheckSrsGrade = () => {
    if (!currentSrsCard) return;
    const inputClean = srsInput.trim().toLowerCase();
    const isCorrect = inputClean === currentSrsCard.jp.toLowerCase() || inputClean === currentSrsCard.romaji.toLowerCase();
    handleSrsGrade(isCorrect);
  };

  const handleSrsMcqChoiceSelect = (option: Word) => {
    if (!currentSrsCard || srsFeedback) return;
    setSelectedSrsMcqWordId(option.id);
    handleSrsGrade(option.id === currentSrsCard.id);
  };

  // -------------------------------------------------------------
  // STANDALONE QUIZ / FLASHCARD ENGINE
  // -------------------------------------------------------------
  const filteredQuizWords = activeWords.filter(w => {
    return (
      quizFolderIds.includes('all') ||
      (w.folder_id && quizFolderIds.includes(w.folder_id)) ||
      (w.lesson_id && quizFolderIds.includes(`lesson-${w.lesson_id}`))
    );
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

  const initQuizDeck = () => {
    setQuizFeedback(null);
    setQuizInput('');
    setQuizCompletedDeck(false);
    setSelectedMcqWordId(null);

    if (filteredQuizWords.length === 0) {
      setQuizDeck([]);
      setQuizTotalCount(0);
      setQuizCurrentIndex(0);
      setCurrentQuizCard(null);
      setQuizCompletedDeck(true);
      return;
    }

    const shuffled = [...filteredQuizWords].sort(() => Math.random() - 0.5);
    setQuizDeck(shuffled);
    setQuizTotalCount(shuffled.length);
    setQuizCurrentIndex(1);
    setCurrentQuizCard(shuffled[0]);

    if (quizMode === 'mcq' || quizMode === 'audio') {
      setQuizMcqOptions(generateMcqOptions(shuffled[0], activeWords));
    }

    if (quizMode !== 'flashcard' && (autoSpeak || quizMode === 'audio') && shuffled[0]?.jp) {
      speakJapanese(shuffled[0].jp);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz') {
      initQuizDeck();
    }
  }, [activeTab, quizMode, quizFolderIds]);

  const advanceQuizCard = () => {
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
        setQuizMcqOptions(generateMcqOptions(nextDeck[0], activeWords));
      }

      if (quizMode !== 'flashcard' && (autoSpeak || quizMode === 'audio') && nextDeck[0]?.jp) {
        speakJapanese(nextDeck[0].jp);
      }
    }
    setQuizFeedback(null);
    setQuizInput('');
    setSelectedMcqWordId(null);
  };

  const handleQuizGrade = (ok: boolean) => {
    if (!currentQuizCard) return;
    if (ok) speakJapanese(currentQuizCard.jp);

    setQuizFeedback({
      type: ok ? 'ok' : 'no',
      msg: ok 
        ? `Chính xác — ${currentQuizCard.jp} (${currentQuizCard.romaji})`
        : `Chưa đúng — ${currentQuizCard.jp} (${currentQuizCard.romaji})`
    });
  };

  const handleCheckQuizGrade = () => {
    if (!currentQuizCard) return;
    const inputClean = quizInput.trim().toLowerCase();
    const isCorrect = inputClean === currentQuizCard.jp.toLowerCase() || inputClean === currentQuizCard.romaji.toLowerCase();
    handleQuizGrade(isCorrect);
  };

  const handleQuizMcqChoiceSelect = (option: Word) => {
    if (!currentQuizCard || quizFeedback) return;
    setSelectedMcqWordId(option.id);
    handleQuizGrade(option.id === currentQuizCard.id);
  };

  // Maps for counts based on activeWords
  const wordsCountMap: Record<string, number> = {};
  combinedFolders.forEach(f => {
    if (f.id.startsWith('lesson-')) {
      const lId = Number(f.id.replace('lesson-', ''));
      wordsCountMap[f.id] = activeWords.filter(w => w.lesson_id === lId || w.folder_id === f.id).length;
    } else {
      wordsCountMap[f.id] = activeWords.filter(w => w.folder_id === f.id).length;
    }
  });

  // Quick practice from lesson
  const handlePracticeLesson = (lessonId: number) => {
    // Ensure lesson status is in_progress so its folder appears
    setLessonStatuses(prev => ({ ...prev, [lessonId]: 'in_progress' }));
    setQuizFolderIds([`lesson-${lessonId}`]);
    setQuizMode('flashcard');
    setActiveTab('quiz');
  };

  const navItems = [
    { id: 'lessons' as const, label: 'Bài học N5', icon: BookOpen },
    { id: 'srs' as const, label: 'Ôn tập SRS', icon: Flame },
    { id: 'quiz' as const, label: 'Luyện tập', icon: Layers },
    { id: 'list' as const, label: `Sổ từ vựng (${activeWords.length})`, icon: List },
    { id: 'add' as const, label: 'Thêm từ mới', icon: Plus },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-[var(--indigo)] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[var(--ink-soft)]">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthLanding onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2]">
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

        {/* Mobile User Avatar & Dropdown */}
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
              <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 font-medium">Tiếng Nhật giao tiếp</p>
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
      <main className="flex-1 px-4 md:px-8 py-6 max-w-4xl w-full mx-auto space-y-5">
        {/* TAB 0: LESSONS N5 */}
        {activeTab === 'lessons' && (
          <section className="space-y-4">
            <LessonsTab
              userId={user?.id}
              userEmail={user?.email}
              onPracticeLesson={handlePracticeLesson}
              onStatusChange={(lId, st) => {
                setLessonStatuses(prev => ({ ...prev, [lId]: st }));
              }}
              onInitialStatusesLoaded={(stMap) => {
                setLessonStatuses(prev => ({ ...prev, ...stMap }));
              }}
              onWordUpdated={fetchData}
            />
          </section>
        )}

        {/* TAB 1: SRS REVIEW */}
        {activeTab === 'srs' && (
          <section className="space-y-4">
            <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--card-border)] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                    <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
                    Ôn tập SRS
                  </h2>
                </div>

                <div className="px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold text-xs flex items-center gap-1.5 shrink-0">
                  <Clock className="w-4 h-4 text-rose-600" />
                  {dueSrsWords.length} từ đến hạn
                </div>
              </div>

              {/* SRS Level Chips */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[var(--ink-soft)]">Cấp độ ghi nhớ:</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[0, 1, 2, 3, 4, 5].map(lvl => {
                    const count = activeWords.filter(w => (w.srs_level || 0) === lvl).length;
                    return (
                      <div key={lvl} className="bg-white border border-[var(--card-border)] p-2 rounded-xl text-center space-y-1">
                        <div className="flex justify-center">{renderSrsChip(lvl)}</div>
                        <div className="text-sm sm:text-base font-bold text-[var(--indigo-deep)]">{count} <span className="text-[10px] font-normal text-gray-500">từ</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Folder Filter Bar */}
              <FolderFilterBar
                folders={combinedFolders}
                wordsCountMap={wordsCountMap}
                totalWordsCount={activeWords.length}
                activeFolderId={srsFolderIds}
                onSelectFolder={toggleSrsFolder}
                isMultiSelect={true}
              />
            </div>

            {/* SRS Review Card View */}
            {srsCompletedDeck ? (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-8 rounded-xl text-center space-y-4 shadow-xs">
                <div className="inline-flex p-4 bg-emerald-100 text-emerald-700 rounded-full">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[var(--indigo-deep)]">Hoàn thành ôn tập</h3>
                <button
                  onClick={initSrsDeck}
                  className="px-6 py-2.5 bg-[var(--indigo)] text-white text-xs font-bold rounded-lg hover:bg-[var(--indigo-deep)] inline-flex items-center gap-2 shadow"
                >
                  <RotateCcw className="w-4 h-4" /> Làm lại
                </button>
              </div>
            ) : currentSrsCard ? (
              <SrsReviewCard
                currentCard={currentSrsCard}
                currentIndex={srsCurrentIndex}
                totalCount={srsTotalCount}
                srsQuizMode={srsQuizMode}
                onModeChange={setSrsQuizMode}
                srsInput={srsInput}
                onInputChange={setSrsInput}
                srsFeedback={srsFeedback}
                srsMcqOptions={srsMcqOptions}
                selectedMcqWordId={selectedSrsMcqWordId}
                onSelectMcqChoice={handleSrsMcqChoiceSelect}
                onCheckGrade={handleCheckSrsGrade}
                onAdvanceCard={advanceSrsCard}
                onOpenReportModal={(w) => { setReportingWord(w); setReportModalOpen(true); }}
                renderSrsChip={renderSrsChip}
                autoSpeak={autoSpeak}
                onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
              />
            ) : (
              <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-8 rounded-xl text-center text-sm text-[var(--ink-soft)]">
                Chưa có từ vựng nào cần ôn tập hôm nay!
              </div>
            )}
          </section>
        )}

        {/* TAB 2: STANDALONE QUIZ / FLASHCARD */}
        {activeTab === 'quiz' && (
          <section className="space-y-4">
            <div className="bg-[#FFFDF9] border border-[var(--card-border)] p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
                <h2 className="text-xl font-bold text-[var(--indigo-deep)] flex items-center gap-2">
                  <Layers className="w-6 h-6 text-[var(--indigo)]" />
                  Luyện tập
                </h2>
                <span className="text-xs font-semibold text-[var(--ink-soft)] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {filteredQuizWords.length} từ vựng
                </span>
              </div>

              {/* Folder Filter Bar */}
              <FolderFilterBar
                folders={combinedFolders}
                wordsCountMap={wordsCountMap}
                totalWordsCount={activeWords.length}
                activeFolderId={quizFolderIds}
                onSelectFolder={toggleQuizFolder}
                isMultiSelect={true}
              />
            </div>

            <QuizPracticeCard
              quizMode={quizMode}
              onModeChange={setQuizMode}
              currentCard={currentQuizCard}
              currentIndex={quizCurrentIndex}
              totalCount={quizTotalCount}
              completedDeck={quizCompletedDeck}
              quizInput={quizInput}
              onInputChange={setQuizInput}
              quizFeedback={quizFeedback}
              quizMcqOptions={quizMcqOptions}
              selectedMcqWordId={selectedMcqWordId}
              onSelectMcqChoice={handleQuizMcqChoiceSelect}
              onCheckGrade={handleCheckQuizGrade}
              onAdvanceCard={advanceQuizCard}
              onRestartDeck={initQuizDeck}
              onOpenReportModal={(w) => { setReportingWord(w); setReportModalOpen(true); }}
              renderSrsChip={renderSrsChip}
              autoSpeak={autoSpeak}
              onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
            />
          </section>
        )}

        {/* TAB 3: LIST & MANAGEMENT */}
        {activeTab === 'list' && (
          <section className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục mới..."
                className="flex-1 px-3.5 py-2 border border-[var(--card-border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--indigo)] shadow-2xs"
              />
              <button
                onClick={handleAddFolder}
                className="px-4 py-2 bg-[var(--indigo)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--indigo-deep)] transition flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Tạo thư mục
              </button>
            </div>

            {/* Folder Filter Bar */}
            <FolderFilterBar
              folders={combinedFolders}
              wordsCountMap={wordsCountMap}
              totalWordsCount={activeWords.length}
              activeFolderId={activeFolder}
              onSelectFolder={setActiveFolder}
              onShareFolder={setSharingFolder}
              onRenameFolder={(f) => { setRenamingFolderId(f.id); setRenameInputValue(f.name); }}
              onDeleteFolder={handleDeleteFolder}
              renamingFolderId={renamingFolderId}
              renameInputValue={renameInputValue}
              onRenameValueChange={setRenameInputValue}
              onCommitRename={handleRenameFolderCommit}
              onCancelRename={() => setRenamingFolderId(null)}
            />

            {/* Word List Section */}
            <WordListSection
              words={activeWords}
              folders={folders.filter(f => !f.id.startsWith('lesson-'))}
              activeFolderId={activeFolder}
              searchQuery={listSearchQuery}
              onSearchChange={setListSearchQuery}
              onDeleteWord={handleDeleteWord}
              onUpdateWord={handleUpdateWordFromReport}
            />
          </section>
        )}

        {/* TAB 4: ADD NEW WORD */}
        {activeTab === 'add' && (
          <section className="bg-[#FFFDF9] border border-[var(--card-border)] p-6 rounded-xl space-y-4 shadow-xs max-w-lg mx-auto">
            <h2 className="text-lg font-bold text-[var(--indigo-deep)] flex items-center gap-2">
              <Plus className="w-5 h-5" /> Thêm từ mới
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[var(--indigo)] mb-1.5 uppercase tracking-wider">
                Tiếng Nhật
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inJp}
                  onChange={(e) => handleJpChange(e.target.value)}
                  placeholder="Ví dụ: こんにちは"
                  className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-lg font-jp focus:outline-none focus:border-[var(--indigo)] bg-white"
                  autoFocus
                />
                {isAutoLookingUp && (
                  <span className="absolute right-3 top-3 text-xs text-[var(--indigo)] flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Tra từ...
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--indigo)] mb-1.5 uppercase tracking-wider">
                Romaji
              </label>
              <input
                type="text"
                value={inRomaji}
                onChange={(e) => setInRomaji(e.target.value)}
                placeholder="Ví dụ: konnichiwa"
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-base font-jetbrains focus:outline-none focus:border-[var(--indigo)] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--indigo)] mb-1.5 uppercase tracking-wider">
                Tiếng Việt
              </label>
              <input
                type="text"
                value={inVi}
                onChange={(e) => setInVi(e.target.value)}
                placeholder="Ví dụ: Chào buổi trưa"
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-base focus:outline-none focus:border-[var(--indigo)] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--indigo)] mb-1.5 uppercase tracking-wider">
                Thư mục
              </label>
              <select
                value={inFolderId}
                onChange={(e) => setInFolderId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[var(--card-border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--indigo)] font-semibold text-[var(--indigo-deep)]"
              >
                {folders.filter(f => !f.id.startsWith('lesson-')).map(f => (
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
      </main>

      {/* Modals */}
      {sharingFolder && (
        <ShareFolderModal
          isOpen={!!sharingFolder}
          onClose={() => setSharingFolder(null)}
          folder={sharingFolder}
          currentUserId={user?.id || ''}
          onSuccess={() => setSharingFolder(null)}
        />
      )}

      {reportModalOpen && reportingWord && (
        <ReportWordModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          word={reportingWord}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {reportListModalOpen && (
        <ReportListModal
          isOpen={reportListModalOpen}
          onClose={() => setReportListModalOpen(false)}
          reports={reports}
          words={words}
          onUpdateWord={handleUpdateWordFromReport}
          onResolveReport={handleResolveReport}
          onDeleteWord={handleDeleteWord}
        />
      )}
    </div>
  );
}
