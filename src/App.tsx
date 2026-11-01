// [LAYOUT ARCHETYPE]: Swiss Mobile App Shell & Modular Viewport Host
// [RADIUS & BORDERS]: rounded (4px) containers, rounded-sm (2px) controls/inputs, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange)

import React, { useState, useEffect } from 'react';
import { Bell, Search, Trophy, User, Check } from 'lucide-react';
import type { MainTab, FeedSubTab, FeedPost, PersonProfile, CitizenRankItem, RecapItem, ClassifiedItem } from './types/community';
import { useFeed } from './features/feed/hooks/useFeed';
import { useServices } from './features/services/hooks/useServices';
import { usePeople } from './features/people/hooks/usePeople';
import { useParticipa } from './features/participa/hooks/useParticipa';
import { useNewspaper } from './features/newspaper/hooks/useNewspaper';
import { FeedStream } from './features/feed/components/FeedStream';
import { NewspaperSheet } from './features/newspaper/components/NewspaperSheet';
import { ResolveSection } from './features/services/components/ResolveSection';
import { ClassifiedsView } from './features/classifieds/ClassifiedsView';
import { ProfileView } from './components/ProfileView';
import { ParticipaView } from './components/ParticipaView';
import { GenteDaquiView } from './components/GenteDaquiView';
import { BottomNavigation } from './components/BottomNavigation';
import { SobradinhoLogo } from './components/SobradinhoLogo';
import { NewPostModal } from './components/NewPostModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { SearchModal } from './components/SearchModal';
import { CitizenCardModal } from './components/CitizenCardModal';
import { PersonDetailModal } from './components/PersonDetailModal';
import { useHaptics } from './hooks/useHaptics';
import { captureReferral } from './lib/growth';
import { EventBanner } from './components/EventBanner';
import { readSettings } from './lib/settings';
import { INITIAL_RANKING, INITIAL_RECAPS, INITIAL_CLASSIFIEDS } from './data/seed-data';

export default function App() {
  const { triggerHaptic } = useHaptics();

  // Primary Navigation: 4 Core Tabs ('feed', 'servicos', 'classificados', 'perfil') + modal views
  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [feedSubTab, setFeedSubTab] = useState<FeedSubTab>('para_voce');

  // Modals & Drawers
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<'perfil' | 'classificacao' | 'configuracoes' | 'salvos'>('perfil');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCitizenCardOpen, setIsCitizenCardOpen] = useState(false);
  const [activePersonModal, setActivePersonModal] = useState<PersonProfile | null>(null);

  // User State
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('sobradinho_username_v2') || 'Júlio Cesar';
  });
  const [userNeighborhood, setUserNeighborhood] = useState<string>(() => {
    return localStorage.getItem('sobradinho_neighborhood_v2') || 'Vila São Joaquim';
  });

  // Ranking & Recap Persistence State
  const [rankingList, setRankingList] = useState<CitizenRankItem[]>(() => {
    const saved = localStorage.getItem('sobradinho_ranking_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RANKING;
      }
    }
    return INITIAL_RANKING;
  });

  const [recapItems, setRecapItems] = useState<RecapItem[]>(() => {
    const saved = localStorage.getItem('sobradinho_recaps_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RECAPS;
      }
    }
    return INITIAL_RECAPS;
  });

  // Classifieds Persistence State
  const [classifiedItems, setClassifiedItems] = useState<ClassifiedItem[]>(() => {
    const saved = localStorage.getItem('sobradinho_classifieds_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CLASSIFIEDS;
      }
    }
    return INITIAL_CLASSIFIEDS;
  });

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Convite: captura ?c=CODIGO na primeira abertura e aplica preferência de movimento
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = readSettings().reduceMotion ? 'true' : 'false';
    const code = captureReferral();
    if (code) showToast(`Você entrou pelo código ${code}. Bem-vindo!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Feature Hooks
  const feed = useFeed();
  const services = useServices();
  const people = usePeople();
  const participa = useParticipa();
  const newspaper = useNewspaper();

  // Handlers
  const handleSharePost = (post: FeedPost) => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(
      `Sobradinho Online: Relato de ${post.authorName} (${post.neighborhood}): ${post.content}\nhttps://sobradinho.girofy.site/`
    );
    showToast('Link do relato copiado!');
  };

  const handleSharePoll = () => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(
      `Consulta Popular Sobradinho Online: ${participa.poll.question}\nhttps://sobradinho.girofy.site/`
    );
    showToast('Link da pergunta copiado!');
  };

  const handleShareRecap = (item: RecapItem) => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(
      `O que rolou em Sobradinho: ${item.title} (${item.neighborhood})\nhttps://sobradinho.girofy.site/`
    );
    showToast('Link do destaque copiado!');
  };

  const handleShareClassified = (item: ClassifiedItem) => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(
      `Classificados Sobradinho: ${item.title} (${item.price}) no bairro ${item.neighborhood}\nhttps://sobradinho.girofy.site/`
    );
    showToast('Link do anúncio copiado!');
  };

  const handleAddNewClassified = (newAd: Omit<ClassifiedItem, 'id' | 'timeAgo' | 'status'>) => {
    triggerHaptic('medium');
    const item: ClassifiedItem = {
      ...newAd,
      id: `class-${Date.now()}`,
      timeAgo: 'agora mesmo',
      status: 'disponivel',
    };
    const updated = [item, ...classifiedItems];
    setClassifiedItems(updated);
    localStorage.setItem('sobradinho_classifieds_v2', JSON.stringify(updated));

    // Award +50 points in ranking for community contribution
    setRankingList((prev) => {
      const up = prev.map((r) =>
        r.isCurrentUser
          ? { ...r, points: r.points + 50, contributionsCount: r.contributionsCount + 1 }
          : r
      );
      localStorage.setItem('sobradinho_ranking_v2', JSON.stringify(up));
      return up;
    });

    showToast('Anúncio publicado nos Classificados (+50 pts no ranking)!');
  };

  const handleReactRecap = (id: string, reactionType: 'fire' | 'applause' | 'heart') => {
    setRecapItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== id) return item;

        const isSame = item.userReaction === reactionType;
        const newReaction = isSame ? null : reactionType;
        const reactions = { ...item.reactions };

        if (item.userReaction) {
          reactions[item.userReaction] = Math.max(0, reactions[item.userReaction] - 1);
        }
        if (!isSame) {
          reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        }

        return {
          ...item,
          reactions,
          userReaction: newReaction,
        };
      });
      localStorage.setItem('sobradinho_recaps_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateProfile = (name: string, neighborhood: string) => {
    setUserName(name);
    setUserNeighborhood(neighborhood);
    localStorage.setItem('sobradinho_username_v2', name);
    localStorage.setItem('sobradinho_neighborhood_v2', neighborhood);

    // Update user in ranking
    setRankingList((prev) => {
      const updated = prev.map((r) =>
        r.isCurrentUser
          ? { ...r, name, neighborhood, handle: name.toLowerCase().replace(/\s+/g, '') }
          : r
      );
      localStorage.setItem('sobradinho_ranking_v2', JSON.stringify(updated));
      return updated;
    });

    showToast('Perfil atualizado com sucesso!');
  };

  const handleOpenRanking = () => {
    triggerHaptic('selection');
    setActiveTab('perfil');
    setProfileDefaultTab('classificacao');
  };

  const handleOpenProfile = () => {
    triggerHaptic('selection');
    setActiveTab('perfil');
    setProfileDefaultTab('perfil');
  };

  const savedPosts = feed.posts.filter((p) => p.isSaved);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-semibold px-3.5 py-1.5 rounded border border-zinc-700 shadow-md flex items-center gap-1.5 animate-fade-in pointer-events-none">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-zinc-200" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('feed');
              setFeedSubTab('para_voce');
            }}
            className="flex items-center text-left"
          >
            <SobradinhoLogo size="md" showText={true} />
          </button>

          <div className="flex items-center gap-1">
            {/* Direct Ranking Button */}
            <button
              onClick={handleOpenRanking}
              className="h-11 px-2.5 rounded-full flex items-center gap-1 text-zinc-700 active:bg-zinc-100 active:scale-95 transition-all text-xs font-semibold"
              title="Classificação comunitária"
            >
              <Trophy className="w-6 h-6 text-amber-500 stroke-[2]" />
              <span className="hidden xs:inline text-[11px] font-mono font-bold">1º</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => showToast('Nenhum novo aviso de emergência no momento.')}
              className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-800 active:bg-zinc-100 active:scale-95 transition-all relative"
              title="Avisos prioritários"
            >
              <Bell className="w-6 h-6" />
              <span className="w-2.5 h-2.5 bg-red-500 ring-2 ring-white absolute top-2.5 right-2.5 rounded-full" />
            </button>

            {/* Search */}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setIsSearchOpen(true);
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-800 active:bg-zinc-100 active:scale-95 transition-all"
              title="Buscar na cidade"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Profile Avatar / Shortcut */}
            <button
              onClick={handleOpenProfile}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white bg-blue-600 active:scale-95 transition-all ml-1 font-bold text-sm"
              title="Meu perfil e configurações"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Main Feature View Switcher */}
      <main className="flex-1 max-w-md w-full mx-auto px-3 sm:px-4 py-3 pb-24">
        {/* TAB 1: FEED */}
        {(activeTab === 'feed' || activeTab === 'inicio') && (
          <div className="animate-fade-in">
            <FeedStream
              topSlot={<EventBanner userName={userName} onToast={showToast} />}
              posts={feed.displayedPosts}
              poll={participa.poll}
              subTab={feedSubTab}
              onChangeSubTab={(tab) => {
                triggerHaptic('selection');
                setFeedSubTab(tab);
              }}
              activeFilter={feed.activeFilter}
              onSelectFilter={(f) => {
                triggerHaptic('selection');
                feed.setActiveFilter(f);
              }}
              isRefreshing={feed.isRefreshing}
              onLikePost={feed.handleToggleLike}
              onSavePost={(id) => {
                feed.handleToggleSave(id);
                const post = feed.posts.find((p) => p.id === id);
                showToast(post?.isSaved ? 'Removido dos salvos.' : 'Salvo na sua lista!');
              }}
              onCommentPost={(id, text) => feed.handleAddComment(id, text, userName)}
              onVotePoll={participa.handleVote}
              onOpenJornal={() => {
                triggerHaptic('selection');
                setActiveTab('jornal');
              }}
              onSharePost={handleSharePost}
              onSharePoll={handleSharePoll}
              recapItems={recapItems}
              onReactRecap={handleReactRecap}
              onShareRecap={handleShareRecap}
              onOpenComposer={() => setIsComposerOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: SERVIÇOS */}
        {(activeTab === 'servicos' || activeTab === 'resolve') && (
          <div className="animate-fade-in">
            <ResolveSection
              services={services.displayedServices}
              activeCategory={services.activeCategory}
              onSelectCategory={services.handleSelectCategory}
              searchQuery={services.searchQuery}
              onSearchChange={services.setSearchQuery}
              onOpenNewServiceModal={() => {
                triggerHaptic('selection');
                setIsComposerOpen(true);
              }}
              onContactProvider={services.handleContactProvider}
            />
          </div>
        )}

        {/* TAB 3: CLASSIFICADOS & DESAPEGO */}
        {activeTab === 'classificados' && (
          <div className="animate-fade-in">
            <ClassifiedsView
              items={classifiedItems}
              onAddNewItem={handleAddNewClassified}
              userName={userName}
              onShareItem={handleShareClassified}
            />
          </div>
        )}

        {/* TAB 4: PERFIL & CLASSIFICAÇÃO */}
        {activeTab === 'perfil' && (
          <div className="animate-fade-in">
            <ProfileView
              userName={userName}
              userNeighborhood={userNeighborhood}
              onUpdateUser={handleUpdateProfile}
              savedCount={savedPosts.length}
              rankingList={rankingList}
              savedPosts={savedPosts}
              onUnsavePost={(id) => feed.handleToggleSave(id)}
              defaultSubTab={profileDefaultTab}
              onToast={showToast}
            />
          </div>
        )}

        {/* JORNAL DE SOBRADINHO FULL SHEET */}
        {activeTab === 'jornal' && (
          <div className="animate-fade-in">
            <NewspaperSheet
              newspaper={newspaper.newspaper}
              onBack={() => {
                triggerHaptic('selection');
                setActiveTab('feed');
              }}
              onShare={() => {
                newspaper.handleShareNewspaper();
                showToast('Link da edição copiado!');
              }}
            />
          </div>
        )}

        {/* CONSULTA POPULAR & ENQUETES (PARTICIPA) */}
        {activeTab === 'participa' && (
          <div className="animate-fade-in">
            <ParticipaView
              poll={participa.poll}
              onVote={participa.handleVote}
              onSubmitIdea={(ideaText) => {
                feed.handleCreatePost({
                  authorName: userName,
                  authorHandle: userName.toLowerCase().replace(/\s+/g, ''),
                  neighborhood: userNeighborhood,
                  content: `[Sugestão para a cidade]: ${ideaText}`,
                  category: 'geral',
                });
                showToast('Sua sugestão foi enviada para o mural comunitário!');
              }}
            />
          </div>
        )}

        {/* GENTE DAQUI */}
        {activeTab === 'gente' && (
          <div className="animate-fade-in">
            <GenteDaquiView
              people={people.filteredPeople}
              onOpenPerson={(p) => setActivePersonModal(p)}
              onOpenMyCitizenCard={() => {
                triggerHaptic('selection');
                setIsCitizenCardOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Fixed Bottom Mobile Navigation (Feed | Serviços | [+] | Classificados | Perfil) */}
      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'perfil') setProfileDefaultTab('perfil');
        }}
        onOpenComposer={() => setIsComposerOpen(true)}
      />

      {/* Streamlined Instagram-Style New Post Modal */}
      <NewPostModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmit={(newPost) => {
          feed.handleCreatePost(newPost);
          showToast('Publicado com sucesso no feed (+50 pts)!');
          setActiveTab('feed');
          setFeedSubTab('para_voce');

          // Increment ranking points
          setRankingList((prev) => {
            const up = prev.map((r) =>
              r.isCurrentUser
                ? { ...r, points: r.points + 50, contributionsCount: r.contributionsCount + 1 }
                : r
            );
            localStorage.setItem('sobradinho_ranking_v2', JSON.stringify(up));
            return up;
          });
        }}
        defaultAuthorName={userName}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={feed.posts}
        services={services.services}
        people={people.people}
        onSelectPerson={(person) => setActivePersonModal(person)}
      />

      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        userName={userName}
        userNeighborhood={userNeighborhood}
        onUpdateUser={handleUpdateProfile}
        savedCount={savedPosts.length}
        rankingList={rankingList}
        savedPosts={savedPosts}
        onUnsavePost={(id) => feed.handleToggleSave(id)}
        defaultTab={profileDefaultTab}
      />

      <CitizenCardModal
        isOpen={isCitizenCardOpen}
        onClose={() => setIsCitizenCardOpen(false)}
        userName={userName}
        userNeighborhood={userNeighborhood}
      />

      <PersonDetailModal
        person={activePersonModal}
        onClose={() => setActivePersonModal(null)}
      />
    </div>
  );
}
