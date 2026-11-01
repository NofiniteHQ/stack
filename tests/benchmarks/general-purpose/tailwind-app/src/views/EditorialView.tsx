import React, { useState } from 'react';
import {
  EDITORIAL_LEAD_STORY,
  EDITORIAL_AUTHOR,
  EDITORIAL_ARTICLES,
  Article,
} from '../../../shared/domain-data';
import {
  Heart,
  Bookmark,
  Share2,
  Clock,
  UserPlus,
  UserCheck,
  Mail,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function EditorialView() {
  const [leadLikes, setLeadLikes] = useState(EDITORIAL_LEAD_STORY.likesCount);
  const [hasLikedLead, setHasLikedLead] = useState(false);
  const [isBookmarkedLead, setIsBookmarkedLead] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [articles, setArticles] = useState<Article[]>(EDITORIAL_ARTICLES);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>(
    {}
  );

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleLeadLike = () => {
    if (hasLikedLead) {
      setLeadLikes((prev) => prev - 1);
      setHasLikedLead(false);
    } else {
      setLeadLikes((prev) => prev + 1);
      setHasLikedLead(true);
    }
  };

  const toggleArticleLike = (id: string) => {
    const isLiked = !!likedArticles[id];
    setLikedArticles((prev) => ({ ...prev, [id]: !isLiked }));
    setArticles((prev) =>
      prev.map((art) =>
        art.id === id
          ? { ...art, likesCount: art.likesCount + (isLiked ? -1 : 1) }
          : art
      )
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setIsSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Top Editorial Magazine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <h1 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[11px]">
            The Systems Quarterly
          </h1>
          <span>•</span>
          <span>Sunday, November 1, 2026</span>
          <span>•</span>
          <span>Issue #84</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            Trending:
          </span>
          <span className="hover:underline cursor-pointer">#ZeroRuntime</span>
          <span className="hover:underline cursor-pointer">#OKLCH</span>
          <span className="hover:underline cursor-pointer">#Vite7</span>
        </div>
      </div>

      {/* Featured Lead Story + Author Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Lead Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={EDITORIAL_LEAD_STORY.coverImage}
                alt={EDITORIAL_LEAD_STORY.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                {EDITORIAL_LEAD_STORY.category}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{EDITORIAL_LEAD_STORY.readTime}</span>
                <span>•</span>
                <span>{EDITORIAL_LEAD_STORY.publishedAt}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
                {EDITORIAL_LEAD_STORY.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {EDITORIAL_LEAD_STORY.excerpt}
              </p>
            </div>
          </div>

          {/* Lead Card Footer Actions */}
          <div className="px-6 md:px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={EDITORIAL_LEAD_STORY.author.avatar}
                alt={EDITORIAL_LEAD_STORY.author.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {EDITORIAL_LEAD_STORY.author.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {EDITORIAL_LEAD_STORY.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLeadLike}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] ${
                  hasLikedLead
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasLikedLead ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span className="sr-only">Likes: </span>
                <span>{leadLikes.toLocaleString()}</span>
              </button>

              <button
                onClick={() => setIsBookmarkedLead(!isBookmarkedLead)}
                aria-label={
                  isBookmarkedLead
                    ? 'Remove bookmark for lead story'
                    : 'Bookmark lead story'
                }
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                  isBookmarkedLead
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarkedLead ? 'fill-blue-600' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio Card & Weekly Brief */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center">
            <img
              src={EDITORIAL_AUTHOR.avatar}
              alt={EDITORIAL_AUTHOR.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-blue-100 dark:ring-blue-950 shadow-md"
            />
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-3">
              {EDITORIAL_AUTHOR.name}
            </h3>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {EDITORIAL_AUTHOR.handle}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {EDITORIAL_AUTHOR.bio}
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <div className="font-black text-slate-900 dark:text-slate-100">
                  {EDITORIAL_AUTHOR.articlesCount}
                </div>
                <div className="text-[10px] text-slate-400">
                  Articles Published
                </div>
              </div>
              <div>
                <div className="font-black text-slate-900 dark:text-slate-100">
                  {EDITORIAL_AUTHOR.followersCount}
                </div>
                <div className="text-[10px] text-slate-400">Subscribers</div>
              </div>
            </div>

            <button
              onClick={() => setIsFollowingAuthor(!isFollowingAuthor)}
              aria-label={
                isFollowingAuthor ? 'Unfollow author' : 'Follow author'
              }
              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px] ${
                isFollowingAuthor
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              {isFollowingAuthor ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow Author
                </>
              )}
            </button>
          </div>

          {/* Quick Reading Tip Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Staff Pick of the Week</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              "Understanding OKLCH Gamut Clamping on Wide Color Screens"
              selected by Chief Design Technologist.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Article Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Recent In-Depth Research & Columns
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Peer-reviewed perspectives on browser compilation engines, design
            token math, and telemetry scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => {
            const isLiked = !!likedArticles[art.id];
            return (
              <div
                key={art.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{art.readTime}</span>
                      <span>•</span>
                      <span>{art.publishedAt}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={art.author.avatar}
                      alt={art.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {art.author.name}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleArticleLike(art.id)}
                    className={`flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer min-h-[44px] min-w-[44px] ${
                      isLiked
                        ? 'text-rose-600'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-rose-500' : ''
                      }`}
                    />
                    <span className="sr-only">Likes: </span>
                    <span>{art.likesCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter Subscription Card */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-8 text-center max-w-3xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          The Systems Engineering Dispatch
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Join 38,000+ staff engineers receiving our weekly breakdown of browser
          engines, OKLCH token math, and JIT compiler architectures.
        </p>

        {isSubscribed ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Subscribed successfully! Welcome to the systems engineering
              community.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              aria-label="Engineer email address"
              placeholder="Enter your engineer email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-h-[44px]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors cursor-pointer shrink-0 min-h-[44px] flex items-center justify-center"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
