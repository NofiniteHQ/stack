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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-subtle text-xs">
        <div className="flex items-center gap-3 text-muted">
          <h1 className="font-bold text-primary uppercase tracking-widest text-[11px]">
            The Systems Quarterly
          </h1>
          <span>•</span>
          <span>Sunday, November 1, 2026</span>
          <span>•</span>
          <span>Issue #84</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <span className="text-[11px] font-semibold text-primary">
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
        <div className="lg:col-span-2 card border border-subtle bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden bg-subtle">
              <img
                src={EDITORIAL_LEAD_STORY.coverImage}
                alt={EDITORIAL_LEAD_STORY.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 badge badge-primary text-xs font-black uppercase tracking-wider shadow-md">
                {EDITORIAL_LEAD_STORY.category}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{EDITORIAL_LEAD_STORY.readTime}</span>
                <span>•</span>
                <span>{EDITORIAL_LEAD_STORY.publishedAt}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary leading-snug">
                {EDITORIAL_LEAD_STORY.title}
              </h2>

              <p className="text-sm text-muted leading-relaxed">
                {EDITORIAL_LEAD_STORY.excerpt}
              </p>
            </div>
          </div>

          {/* Lead Card Footer Actions */}
          <div className="px-6 md:px-8 py-4 border-t border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={EDITORIAL_LEAD_STORY.author.avatar}
                alt={EDITORIAL_LEAD_STORY.author.name}
                className="w-9 h-9 rounded-full object-cover border border-subtle"
              />
              <div>
                <div className="font-bold text-xs text-primary">
                  {EDITORIAL_LEAD_STORY.author.name}
                </div>
                <div className="text-[10px] text-muted">
                  {EDITORIAL_LEAD_STORY.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLeadLike}
                className={`btn btn-ghost py-1 px-3 text-xs font-semibold cursor-pointer min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center ${
                  hasLikedLead ? 'text-danger' : 'text-muted'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasLikedLead ? 'fill-danger text-danger' : ''
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
                className={`btn btn-ghost p-2 text-xs cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                  isBookmarkedLead ? 'text-primary' : 'text-muted'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarkedLead ? 'fill-primary' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio Card & Weekly Brief */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="card p-6 border border-subtle bg-surface shadow-sm text-center">
            <img
              src={EDITORIAL_AUTHOR.avatar}
              alt={EDITORIAL_AUTHOR.name}
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-primary/20 shadow-md"
            />
            <h3 className="font-bold text-base text-primary mt-3">
              {EDITORIAL_AUTHOR.name}
            </h3>
            <div className="text-xs text-primary font-medium">
              {EDITORIAL_AUTHOR.handle}
            </div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              {EDITORIAL_AUTHOR.bio}
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-subtle text-xs">
              <div>
                <div className="font-black text-primary">
                  {EDITORIAL_AUTHOR.articlesCount}
                </div>
                <div className="text-[10px] text-muted">Articles Published</div>
              </div>
              <div>
                <div className="font-black text-primary">
                  {EDITORIAL_AUTHOR.followersCount}
                </div>
                <div className="text-[10px] text-muted">Subscribers</div>
              </div>
            </div>

            <button
              onClick={() => setIsFollowingAuthor(!isFollowingAuthor)}
              aria-label={
                isFollowingAuthor ? 'Unfollow author' : 'Follow author'
              }
              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px] lg:min-h-[36px] ${
                isFollowingAuthor ? 'btn btn-outline' : 'btn btn-primary'
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
          <div className="card p-5 border border-subtle bg-subtle/50 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Sparkles className="w-4 h-4 text-warning" />
              <span>Staff Pick of the Week</span>
            </div>
            <p className="text-muted leading-relaxed">
              "Understanding OKLCH Gamut Clamping on Wide Color Screens"
              selected by Chief Design Technologist.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Article Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
            Recent In-Depth Research & Columns
          </h2>
          <p className="text-xs text-muted mt-1">
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
                className="group card border border-subtle bg-surface shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-subtle">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 badge badge-secondary text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <span>{art.readTime}</span>
                      <span>•</span>
                      <span>{art.publishedAt}</span>
                    </div>

                    <h3 className="font-bold text-sm text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {art.title}
                    </h3>

                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={art.author.avatar}
                      alt={art.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-primary">
                      {art.author.name}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleArticleLike(art.id)}
                    className={`flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer min-h-[44px] min-w-[44px] ${
                      isLiked ? 'text-danger' : 'text-muted hover:text-primary'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-danger text-danger' : ''
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
      <div className="card rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center max-w-3xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-primary">
          The Systems Engineering Dispatch
        </h2>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
          Join 38,000+ staff engineers receiving our weekly breakdown of browser
          engines, OKLCH token math, and JIT compiler architectures.
        </p>

        {isSubscribed ? (
          <div className="mt-6 p-4 rounded-xl badge badge-success text-xs font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
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
              className="input w-full px-4 py-2.5 text-xs rounded-xl shadow-sm min-h-[44px]"
            />
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-semibold shrink-0 cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
