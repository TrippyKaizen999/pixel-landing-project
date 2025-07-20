import { Layout } from "@/components/ui/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  MessageSquare,
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  Clock,
  Star,
  PlayCircle,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getGameClips,
  getPlayerProfile,
  initializeDefaultData,
  type GameClip,
} from "@/lib/storage";
import { Input } from "@/components/ui/input";

const quickTips = [
  {
    category: "Positioning",
    tip: "Stay behind cover when possible and use natural cover to your advantage",
    difficulty: "Basic",
    color: "text-ow-blue",
  },
  {
    category: "Game Sense",
    tip: "Track enemy ultimates and call them out to your team",
    difficulty: "Intermediate",
    color: "text-ow-orange",
  },
  {
    category: "Mechanics",
    tip: "Practice your crosshair placement - keep it at head level",
    difficulty: "Basic",
    color: "text-ow-purple",
  },
  {
    category: "Team Play",
    tip: "Group up with your team before engaging in fights",
    difficulty: "Basic",
    color: "text-ow-gold",
  },
];

const improvementAreas = [
  {
    area: "Target Priority",
    current: 65,
    target: 85,
    suggestion: "Focus on eliminating supports first in team fights",
  },
  {
    area: "Ultimate Usage",
    current: 72,
    target: 90,
    suggestion: "Coordinate ultimates with your team for maximum impact",
  },
  {
    area: "Map Awareness",
    current: 58,
    target: 80,
    suggestion: "Use high ground and learn common flanking routes",
  },
  {
    area: "Resource Management",
    current: 80,
    target: 90,
    suggestion: "Manage cooldowns more efficiently during engagements",
  },
];

export default function AICoach() {
  const [gameClips, setGameClips] = useState<GameClip[]>([]);
  const [filteredClips, setFilteredClips] = useState<GameClip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHero, setFilterHero] = useState<string>("all");
  const [filterResult, setFilterResult] = useState<string>("all");
  const [aiInput, setAiInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    initializeDefaultData();
    const clips = getGameClips();
    const playerProfile = getPlayerProfile();

    setGameClips(clips);
    setFilteredClips(clips);
    setProfile(playerProfile);
  }, []);

  useEffect(() => {
    let filtered = gameClips;

    if (searchTerm) {
      filtered = filtered.filter(
        (clip) =>
          clip.map.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clip.hero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clip.mode.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterHero !== "all") {
      filtered = filtered.filter((clip) => clip.hero === filterHero);
    }

    if (filterResult !== "all") {
      filtered = filtered.filter((clip) => clip.result === filterResult);
    }

    setFilteredClips(filtered);
  }, [searchTerm, filterHero, filterResult, gameClips]);

  const handleAskAI = async () => {
    if (!aiInput.trim()) return;

    setIsGenerating(true);
    // Simulate AI response
    setTimeout(() => {
      setIsGenerating(false);
      setAiInput("");
    }, 2000);
  };

  const uniqueHeroes = Array.from(new Set(gameClips.map((clip) => clip.hero)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ow-orange">
              AI Coach & Feedback
            </h1>
            <p className="text-muted-foreground">
              Get personalized coaching advice and review your gameplay feedback
            </p>
          </div>
          <Badge variant="outline" className="text-ow-blue border-ow-blue">
            {filteredClips.length} clips analyzed
          </Badge>
        </div>

        <Tabs defaultValue="coach" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="coach">AI Coach</TabsTrigger>
            <TabsTrigger value="feedback">Feedback History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="coach" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Chat Interface */}
              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-ow-orange" />
                    Ask Your AI Coach
                  </CardTitle>
                  <CardDescription>
                    Get personalized advice based on your gameplay data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Ask about your gameplay, strategy, hero selection, or any Overwatch question..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="min-h-24 bg-ow-dark-300 resize-none"
                    />
                    <Button
                      onClick={handleAskAI}
                      disabled={!aiInput.trim() || isGenerating}
                      className="btn-primary w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Ask AI Coach
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Quick Questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "How can I improve my positioning?",
                        "What heroes should I focus on?",
                        "Why am I losing SR?",
                        "Review my recent games",
                      ].map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setAiInput(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-ow-gold" />
                    Quick Tips
                  </CardTitle>
                  <CardDescription>
                    Daily coaching tips to improve your gameplay
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickTips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", tip.color)}
                        >
                          {tip.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-ow-dark-400"
                        >
                          {tip.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm">{tip.tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Improvement Areas */}
            <Card className="card-ow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-ow-blue" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Focus on these areas to rank up faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {improvementAreas.map((area) => (
                    <div key={area.area} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{area.area}</span>
                        <div className="text-sm text-muted-foreground">
                          {area.current}% → {area.target}%
                        </div>
                      </div>
                      <Progress
                        value={area.current}
                        className="h-2 bg-ow-dark-400"
                      />
                      <p className="text-sm text-muted-foreground">
                        {area.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Filters */}
            <Card className="card-ow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by map, hero, or mode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-ow-dark-300"
                      />
                    </div>
                  </div>
                  <Select value={filterHero} onValueChange={setFilterHero}>
                    <SelectTrigger className="w-40 bg-ow-dark-300">
                      <SelectValue placeholder="Hero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Heroes</SelectItem>
                      {uniqueHeroes.map((hero) => (
                        <SelectItem key={hero} value={hero}>
                          {hero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterResult} onValueChange={setFilterResult}>
                    <SelectTrigger className="w-40 bg-ow-dark-300">
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="victory">Victory</SelectItem>
                      <SelectItem value="defeat">Defeat</SelectItem>
                      <SelectItem value="draw">Draw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredClips.length > 0 ? (
                filteredClips.map((clip) => (
                  <Card key={clip.id} className="card-ow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-ow-orange/20 to-ow-blue/20 rounded-lg flex items-center justify-center">
                            {clip.type === "video" ? (
                              <PlayCircle className="w-5 h-5 text-ow-orange" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-ow-blue" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {clip.map} • {clip.hero}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(clip.uploadedAt)} • {clip.mode}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              clip.result === "victory"
                                ? "default"
                                : "destructive"
                            }
                            className={cn(
                              "text-xs",
                              clip.result === "victory"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30",
                            )}
                          >
                            {clip.result.charAt(0).toUpperCase() +
                              clip.result.slice(1)}
                          </Badge>
                          {clip.sr && (
                            <Badge variant="outline" className="text-ow-gold">
                              {clip.sr} SR
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {clip.feedback && (
                      <CardContent className="pt-0">
                        <div className="p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-ow-orange" />
                            <span className="text-sm font-medium text-ow-orange">
                              AI Coach Feedback
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {clip.feedback}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3"
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3"
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="card-ow">
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No feedback found</p>
                      <p className="text-sm">
                        Try adjusting your filters or upload more clips
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-ow-green" />
                    Strengths
                  </CardTitle>
                  <CardDescription>What you're doing well</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="font-medium text-green-400 mb-1">
                      Consistent Performance
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You maintain stable performance across different maps and
                      game modes.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="font-medium text-green-400 mb-1">
                      Hero Flexibility
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Good adaptation to team composition needs.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-ow-orange" />
                    Focus Areas
                  </CardTitle>
                  <CardDescription>Opportunities for growth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="font-medium text-orange-400 mb-1">
                      Ultimate Timing
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider saving ultimates for coordinated team fights.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="font-medium text-orange-400 mb-1">
                      Map Control
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Focus on controlling key map positions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-ow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-ow-gold" />
                  Personalized Training Plan
                </CardTitle>
                <CardDescription>
                  Recommended practice routine based on your gameplay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Aim Training</span>
                      <Badge variant="outline" className="text-ow-orange">
                        15 min daily
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Practice crosshair placement and tracking in the training
                      range
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">VOD Review</span>
                      <Badge variant="outline" className="text-ow-blue">
                        2x per week
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Review your losses to identify positioning mistakes
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Hero Practice</span>
                      <Badge variant="outline" className="text-ow-purple">
                        Focus: Ana
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Practice sleep dart accuracy and nano boost timing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
