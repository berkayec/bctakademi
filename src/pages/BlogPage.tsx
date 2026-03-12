import React from 'react';
import { blogPosts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogPage() {
  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
  const regularPosts = blogPosts.filter(p => p.id !== featuredPost.id);

  return (
    // bg-[#0a0e1a] -> bg-background olarak güncellendi
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Başlık Bölümü */}
        <header className="mb-16 space-y-4 text-center md:text-left">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-4 py-1">
            Sektörden Haberler
          </Badge>
          {/* text-white -> text-foreground */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            BCT Güncel
          </h1>
          {/* text-slate-400 -> text-muted-foreground */}
          <p className="text-muted-foreground text-lg max-w-2xl">
            Tıbbi teknoloji dünyasındaki gelişmeleri, kariyer rehberlerini ve teknik derinlemesine incelemeleri keşfedin.
          </p>
        </header>

        {/* Öne Çıkan Haber */}
        <section className="mb-20">
          <motion.div
            whileHover={{ y: -4 }}
            // bg-slate-900/50 -> bg-card | border-slate-800 -> border-border
            className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300"
          >
            <div className="aspect-[16/10] lg:aspect-auto relative overflow-hidden">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-90 dark:opacity-80" 
              />
              <div className="absolute top-6 left-6">
                <Badge className="bg-teal-500 text-white border-none px-4 py-1">Öne Çıkan</Badge>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                <span>{featuredPost.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>{featuredPost.readTime}</span>
              </div>
              {/* text-white -> text-foreground */}
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{featuredPost.excerpt}</p>
              
              <div className="flex items-center gap-3 py-4 border-y border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{featuredPost.author}</p>
                  <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                </div>
              </div>
              
              {/* Buton tasarımı temaya göre değişen birincil butona (primary) çevrildi */}
              <Button className="w-full md:w-fit bg-primary text-primary-foreground hover:bg-orange-500 hover:text-white rounded-xl px-8 py-6 h-auto text-base font-bold group transition-all">
                Haberi Oku <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Haber Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {regularPosts.map((post) => (
            <motion.article key={post.id} whileHover={{ y: -6 }} className="group flex flex-col h-full">
              {/* border-slate-800 -> border-border */}
              <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 border border-border shadow-xl bg-muted">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80" 
                />
              </div>
              <div className="flex-1 flex flex-col space-y-4 px-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/5 text-teal-500 border-teal-500/20">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </div>
                </div>
                {/* text-white -> text-foreground */}
                <h3 className="text-2xl font-display font-bold text-foreground group-hover:text-teal-500 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                {/* border-slate-800/50 -> border-border */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                   <span className="text-xs font-bold text-foreground uppercase group-hover:text-orange-500 transition-colors">
                     Devamını Oku <ArrowRight className="inline-block w-3 h-3 ml-1" />
                   </span>
                   <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                     <Calendar className="w-3 h-3" /> {post.date}
                   </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
