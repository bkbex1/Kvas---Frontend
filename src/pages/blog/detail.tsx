import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { apiGet, toImageSrc } from '@/lib/api';

interface BlogComment {
  id: number;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
}

export default function BlogDetailPage() {
  const [searchParams] = useSearchParams();
  const id = parseInt(searchParams.get('id') || '1');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const post = useMemo(() => blogPosts.find(p => p.id === id) || blogPosts[0], [blogPosts, id]);

  useEffect(() => {
    apiGet<any>('/api/content/blog')
      .then((data) => {
        setBlogPosts(Array.isArray(data.blogPosts) ? data.blogPosts : []);
        setBlogCategories(Array.isArray(data.blogCategories) ? data.blogCategories : []);
      })
      .catch(() => {
        setBlogPosts([]);
        setBlogCategories([]);
      });
  }, []);

  const [comments, setComments] = useState<BlogComment[]>(post?.comments || []);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!post) {
    return <div className="min-h-screen bg-[#FAFAF7]"><Navbar /></div>;
  }

  const related = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  const handleCommentLike = (cid: number) => {
    setCommentLikes(prev => ({ ...prev, [cid]: !prev[cid] }));
    setComments(prev => prev.map(c => c.id === cid ? ({ ...c, likes: commentLikes[cid] ? c.likes - 1 : c.likes + 1 }) : c));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.text.trim()) return;
    const comment: BlogComment = {
      id: Date.now(),
      author: newComment.name,
      avatar: 'person portrait natural light warm smile',
      date: 'Точно сега',
      text: newComment.text,
      likes: 0,
    };
    setComments(prev => prev.concat([comment]));
    setNewComment({ name: '', text: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const categoryLabel = blogCategories.find(c => c.id === post.category)?.label || '';

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-20 overflow-hidden">
        <div className="relative w-full h-[480px]">
          <img
            src={toImageSrc(post.imgQuery, post.title)}
            alt={post.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F08]/85 via-[#1A0F08]/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <Link to="/blog" className="text-white/70 hover:text-white transition-colors text-sm cursor-pointer flex items-center gap-1">
                  <i className="ri-arrow-left-line"></i>
                  Обратно към блога
                </Link>
                <span className="text-white/40">·</span>
                <span className="px-3 py-1 bg-[#F5C842] text-[#1A0F08] text-xs font-bold rounded-full">
                  {categoryLabel}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-gray-200 mb-10">
          <div className="flex items-center gap-4">
            <img
              src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28post.author%20%20%20%20portrait%20warm%20studio%20natural%20light%29%7D&width=100&height=100&seq=author-${post.id}&orientation=squarish`}
              alt={post.author}
              className="w-12 h-12 rounded-full object-cover object-top"
            />
            <div>
              <p className="font-semibold text-[#1A0F08]">{post.author}</p>
              <p className="text-xs text-gray-500">{post.authorRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <i className="ri-calendar-line"></i>
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="ri-time-line"></i>
              <span>{post.readTime} четене</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${liked ? 'text-red-500' : 'hover:text-red-400'}`}
            >
              <i className={liked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 leading-relaxed mb-10 font-light">{post.excerpt}</p>

        {/* Full Content */}
        {post.fullContent && (
          <div className="space-y-6 mb-12">
            {post.fullContent.map((paragraph, idx) => {
              if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                const colonIdx = paragraph.indexOf(':**');
                const heading = paragraph.slice(2, colonIdx);
                const rest = paragraph.slice(colonIdx + 3);
                return (
                  <div key={idx} className="mb-2">
                    <h2 className="text-xl font-bold text-[#1A0F08] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{heading}</h2>
                    <p className="text-gray-700 leading-relaxed text-[15px]">{rest}</p>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-gray-700 leading-relaxed text-[15px]">{paragraph}</p>
              );
            })}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-gray-200 mb-10">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-[#F5EFE6] text-[#C17A3A] text-xs font-medium rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Box */}
        {post.authorBio && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-12 flex gap-5 items-start">
            <img
              src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28post.author%20%20%20%20professional%20portrait%20warm%20studio%29%7D&width=120&height=120&seq=author-bio-${post.id}&orientation=squarish`}
              alt={post.author}
              className="w-16 h-16 rounded-full object-cover object-top flex-shrink-0"
            />
            <div>
              <p className="font-bold text-[#1A0F08] mb-0.5">{post.author}</p>
              <p className="text-sm text-[#C17A3A] mb-2">{post.authorRole}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{post.authorBio}</p>
            </div>
          </div>
        )}

        {/* ─── COMMENTS ─── */}
        <div id="comments">
          <h2 className="text-2xl font-bold text-[#1A0F08] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Коментари ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm mb-8">Бъдете първи, оставете коментар!</p>
          ) : (
            <div className="space-y-5 mb-10">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28comment.avatar%29%7D&width=80&height=80&seq=comment-${comment.id}&orientation=squarish`}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-[#1A0F08] text-sm">{comment.author}</p>
                        <span className="text-xs text-gray-400">{comment.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.text}</p>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${commentLikes[comment.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                      >
                        <i className={commentLikes[comment.id] ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#1A0F08] mb-4">Оставете коментар</h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Вашето ime</label>
                <input
                  type="text"
                  value={newComment.name}
                  onChange={e => setNewComment(p => ({ ...p, name: e.target.value }))}
                  placeholder="Иван Иванов"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Коментар</label>
                <textarea
                  value={newComment.text}
                  onChange={e => setNewComment(p => ({ ...p, text: e.target.value.slice(0, 500) }))}
                  placeholder="Споделете вашия опит или задайте въпрос..."
                  rows={4}
                  maxLength={500}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A0F08] resize-none"
                  required
                />
                <p className="text-xs text-gray-400 text-right mt-1">{newComment.text.length}/500</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A0F08] text-white rounded-full text-sm font-semibold hover:bg-[#C17A3A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Публикувай коментар
                </button>
                {submitted && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <i className="ri-checkbox-circle-line"></i>
                    Коментарът е добавен!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── RELATED ARTICLES ─── */}
      {related.length > 0 && (
        <div className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <h2 className="text-2xl font-bold text-[#1A0F08] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Свързани статии
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rPost => (
                <Link
                  key={rPost.id}
                  to={`/blog/detail?id=${rPost.id}`}
                  className="group cursor-pointer bg-[#FAFAF7] rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={toImageSrc(rPost.imgQuery, rPost.title)}
                      alt={rPost.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#C17A3A] uppercase tracking-wider">
                      {blogCategories.find(c => c.id === rPost.category)?.label}
                    </span>
                    <h3 className="font-bold text-[#1A0F08] mt-1.5 mb-2 leading-tight line-clamp-2 group-hover:text-[#C17A3A] transition-colors">
                      {rPost.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{rPost.author}</span>
                      <span>·</span>
                      <span>{rPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
