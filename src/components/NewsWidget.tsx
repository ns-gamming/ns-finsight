import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp, Newspaper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

export const NewsWidget = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    // Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      if (error) throw error;
      setNews(data?.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Use fallback news
      setNews([
        {
          title: 'Global Markets Show Positive Momentum',
          url: '#',
          source: 'Financial Times',
          publishedAt: new Date().toISOString(),
          category: 'Markets'
        },
        {
          title: 'Tech Stocks Rally on AI Optimism',
          url: '#',
          source: 'Bloomberg',
          publishedAt: new Date().toISOString(),
          category: 'Technology'
        },
        {
          title: 'Central Banks Signal Rate Stability',
          url: '#',
          source: 'Reuters',
          publishedAt: new Date().toISOString(),
          category: 'Economy'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary animate-pulse-slow" />
          <CardTitle>Financial News</CardTitle>
        </div>
        <CardDescription>Latest market and finance updates</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-shimmer bg-muted rounded-lg p-4 h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {news.slice(0, 5).map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-border bg-gradient-to-r from-card/80 to-card/50 backdrop-blur-sm hover:from-accent hover:to-accent/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Newspaper className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getTimeAgo(article.publishedAt)}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
