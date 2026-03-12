import React from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { blogPosts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogPage() {
  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(p => p.id !== featuredPost.id);

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="mb-16 space-y-4 text-center md:text-left">
          <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-200">
            Sektörden Haberler
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white md:text-slate-900">BCT Güncel</h1>
          <p className="text-slate-400 md:text-slate-600 text-lg max-w-2xl">
            Tıbbi teknoloji dünyasındaki gelişmeleri, kariyer rehberlerini ve teknik derinlemesine incelemeleri keşfedin.
          </p>
        </header>

        <section className="mb-20">
          <motion.div
            whileHover={{ y: -4 }}
            className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-[16/10] lg:aspect-auto relative overflow-hidden">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute top-6 left-6">
                <Badge className="bg-teal-500 text-white border-none px-4 py-1">Öne Çıkan</Badge>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-white">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <span>{featuredPost.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{featuredPost.author}</p>
                  <p className="text-xs text-slate-500">{featuredPost.date}</p>
                </div>
              </div>
              <Button className="w-full md:w-fit bg-slate-900 hover:bg-orange-500 text-white rounded-xl px-8 py-6 h-auto text-base group transition-colors">
                Haberi Oku <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {regularPosts.map((post) => (
            <motion.article key={post.id} whileHover={{ y: -6 }} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden p-4">
              <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col space-y-4 px-2 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-slate-50 text-slate-600">{post.category}</Badge>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium"><Clock className="w-3 h-3" /> {post.readTime}</div>
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-tight">{post.title}</h3>
                <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                   <span className="text-xs font-bold text-slate-900 uppercase">Devamını Oku <ArrowRight className="inline-block w-3 h-3 text-orange-500" /></span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </RootLayout>
  );
}
