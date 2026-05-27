import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { useCategories } from '../lib/useCategories';
import { useIdeas, useIdea, createIdea, updateIdea, deleteIdea } from '../lib/useIdeas';
import { useTasks, addTask, toggleTask } from '../lib/useTasks';
import { AppShell } from '../components/layout/AppShell';
import { SplashScreen } from '../components/auth/SplashScreen';
import { LoginScreen } from '../components/auth/LoginScreen';
import { DashboardScreen } from '../components/dashboard/DashboardScreen';
import { IdeasListScreen } from '../components/ideas/IdeasListScreen';
import { AddIdeaScreen } from '../components/ideas/AddIdeaScreen';
import { IdeaDetailScreen } from '../components/ideas/IdeaDetailScreen';
import { VoiceIdeaScreen, ScanIdeaScreen } from '../components/ideas/SourceCaptureScreen';
import { ChatScreen } from '../components/chat/ChatScreen';
import { ProfileScreen } from '../components/profile/ProfileScreen';
import type { IdeaStatus, SourceType } from '../types';

type IdeaInput = {
  title: string;
  description: string;
  category_id: string;
  status: IdeaStatus;
  source_type: SourceType;
};

export function App() {
  const { user, profile, loading: authLoading, signIn, signUp, signOut, retry: retryAuth, error: authError, notice: authNotice, clearError } = useAuth();
  const [path, setPath] = useState(window.location.pathname);
  const [isBooting, setIsBooting] = useState(() => {
    return window.sessionStorage.getItem('ideaku-preloader-seen') !== 'true';
  });

  const userId = user?.id;
  const { categories } = useCategories(userId);
  const { ideas, refetch: refetchIdeas } = useIdeas(userId);
  const ideaId = path.startsWith('/ideas/') && path !== '/ideas/new' && path !== '/ideas/new/voice' && path !== '/ideas/new/scan'
    ? path.split('/')[2]
    : undefined;
  const { idea: selectedIdea, loading: ideaLoading, refetch: refetchIdea } = useIdea(ideaId);
  const { tasks, refetch: refetchTasks } = useTasks(ideaId);
  const ideaFromList = ideaId ? ideas.find((item) => item.id === ideaId) : undefined;
  const detailIdea = selectedIdea ?? ideaFromList;
  const isPrivatePath = [
    '/dashboard',
    '/ideas',
    '/ideas/new',
    '/ideas/new/voice',
    '/ideas/new/scan',
    '/chat',
    '/profile',
  ].includes(path) || (path.startsWith('/ideas/') && path !== '/ideas/new' && path !== '/ideas/new/voice' && path !== '/ideas/new/scan');

  const renderLogin = () => (
    <LoginScreen
      onLogin={handleLogin}
      onRegister={handleRegister}
      error={authError}
      notice={authNotice}
      onRetry={retryAuth}
      onClearError={clearError}
    />
  );

  const navigate = (nextPath: string) => {
    if (nextPath !== window.location.pathname) {
      window.history.pushState({}, '', nextPath);
    }
    setPath(nextPath);
  };

  useEffect(() => {
    if (!isBooting) return;
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('ideaku-preloader-seen', 'true');
      setIsBooting(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isBooting]);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);

    const handleInternalLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!anchor) return;

      const link = anchor as HTMLAnchorElement;
      if (link.target || link.hasAttribute('download')) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      navigate(url.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleInternalLink);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleInternalLink);
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (!error) navigate('/dashboard');
  };

  const handleRegister = async (email: string, password: string, fullName: string) => {
    const { error } = await signUp(email, password, fullName);
    if (!error) navigate('/dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateIdea = async (input: IdeaInput) => {
    if (!userId) return;
    try {
      const idea = await createIdea({ ...input, user_id: userId });
      if (!idea) return;
      await refetchIdeas();
      navigate(`/ideas/${idea.id}`);
    } catch (err) {
      console.error('Create idea failed:', err);
    }
  };

  const handleUpdateIdea = async (id: string, input: IdeaInput) => {
    try {
      await updateIdea(id, input);
      await refetchIdea();
      await refetchIdeas();
    } catch (err) {
      console.error('Update idea failed:', err);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    await deleteIdea(id);
    await refetchIdeas();
    navigate('/ideas');
  };

  const handleAddTask = async (taskIdeaId: string, title: string) => {
    if (!userId) return;
    try {
      await addTask(userId, taskIdeaId, title, tasks.length + 1);
      await refetchTasks();
    } catch (err) {
      console.error('Add task failed:', err);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    await toggleTask(taskId, task.is_done);
    await refetchTasks();
  };

  if (isBooting) return <SplashScreen />;

  if (authLoading) {
    return <AppLoading message="Memeriksa sesi akun..." />;
  }

  // Auth guard
  if (!user && isPrivatePath) {
    return renderLogin();
  }

  if (path === '/') {
    return user ? (
      <DashboardScreen profile={profile} ideas={ideas} categories={categories} />
    ) : (
      renderLogin()
    );
  }
  if (path === '/login') return renderLogin();
  if (path === '/dashboard') return <DashboardScreen profile={profile} ideas={ideas} categories={categories} />;
  if (path === '/ideas') return <IdeasListScreen ideas={ideas} categories={categories} />;
  if (path === '/ideas/new') return (
    <AddIdeaScreen
      categories={categories}
      onCreateIdea={handleCreateIdea}
    />
  );
  if (path === '/ideas/new/voice') return <VoiceIdeaScreen categories={categories} onCreateIdea={handleCreateIdea} />;
  if (path === '/ideas/new/scan') return <ScanIdeaScreen categories={categories} onCreateIdea={handleCreateIdea} />;
  if (path.startsWith('/ideas/')) {
    return (
      <IdeaDetailScreen
        idea={detailIdea}
        isResolving={!detailIdea && ideaLoading}
        categories={categories}
        tasks={tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onUpdateIdea={handleUpdateIdea}
        onDeleteIdea={handleDeleteIdea}
      />
    );
  }
  if (path === '/chat') return <ChatScreen userId={userId} />;
  if (path === '/profile') return <ProfileScreen profile={profile} onLogout={handleLogout} />;

  return user ? <DashboardScreen profile={profile} ideas={ideas} categories={categories} /> : renderLogin();
}

function AppLoading({ message, activeNav }: { message: string; activeNav?: string }) {
  return (
    <AppShell activeNav={activeNav} hideNav={!activeNav}>
      <div
        style={{
          backgroundColor: '#F8F7FA',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '390px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
        }}
      >
        <div className="loading-dots" style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '20px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C5CFC' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C5CFC' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C5CFC' }} />
        </div>
        <p style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#8E8A9A', marginTop: '16px' }}>
          {message}
        </p>
      </div>
    </AppShell>
  );
}
