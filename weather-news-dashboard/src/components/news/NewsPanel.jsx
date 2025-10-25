import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Globe, TrendingUp } from "lucide-react";
import { RiExternalLinkFill } from "@remixicon/react";

const NewsPanel = ({ newsData, city, timeout }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  if ((!newsData || newsData.length === 0) && !timeout) {
    return (
      <Card className="backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            News for {city}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 bg-accent-foreground/50" />
                <Skeleton className="h-3 bg-accent-foreground/50 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timeout && (!newsData || newsData.length === 0)) {
    return (
      <Card className="backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            News for {city}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No News Data Available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-transparent border-0 shadow-none p-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center text-lg md:text-xl">
              <TrendingUp className="w-5 h-5 mr-2" />
              Latest News
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400"
            >
              {newsData.length} articles
            </Badge>
          </CardTitle>
          <CardDescription className="sr-only" />
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="">
            <div className="space-y-4">
              <AnimatePresence>
                {newsData.map((article, index) => (
                  <motion.div
                    key={article.url || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <Card className="bg-muted/30 backdrop-blur-2xl hover:bg-muted/40 shadow-none border-transparent hover:border-border/40">
                      <CardTitle className="sr-only" />
                      <CardDescription className="sr-only" />

                      <CardContent>
                        {/* Article Image */}
                        {article.urlToImage && (
                          <div className="mb-3 overflow-hidden rounded-lg">
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="w-full h-96 object-fill group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-purple-500 transition-colors">
                            {article.title}
                          </h3>

                          {article.description && (
                            <p className="text-muted-foreground/70 text-xs line-clamp-3 text-justify">
                              {article.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs pt-2">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              <span>{article.source?.name || "Unknown"}</span>
                            </div>

                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(article.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {index < newsData.length - 1 && (
                      <Separator className="my-4 bg-muted-foreground/70" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Article Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pr-8">Article Details</DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {/* Article Image */}
                {selectedArticle.urlToImage && (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={selectedArticle.urlToImage}
                      alt={selectedArticle.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Article Title */}
                <h2 className="md:text-lg font-bold text-justify">
                  {selectedArticle.title}
                </h2>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-muted-foreground/60">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>{selectedArticle.source?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeAgo(selectedArticle.publishedAt)}</span>
                  </div>
                </div>

                <Separator className="bg-primary/30" />

                {/* Article Description */}
                {selectedArticle.description && (
                  <p className="leading-relaxed text-justify text-muted-foreground/80">
                    {selectedArticle.description}
                  </p>
                )}

                {/* Article Content */}
                {selectedArticle.content && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary/80">Summary</h3>
                    <p className="leading-relaxed text-justify text-muted-foreground/80">
                      {selectedArticle.content}
                    </p>
                  </div>
                )}

                {/* Read More Button */}
                <div className="pt-4">
                  <Button
                    onClick={() => window.open(selectedArticle.url, "_blank")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <RiExternalLinkFill />
                    Read Full Article
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsPanel;
