import { Layout } from "@/components/ui/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Upload,
  Play,
  Calendar,
  Target,
  Star,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getGameClips,
  getWinRate,
  getCurrentSR,
  getHeroStats,
  getPlayerProfile,
  initializeDefaultData,
  type GameClip,
  type PlayerProfile,
} from "@/lib/storage";
import { Link } from "react-router-dom";

const skillTrends = [
  { skill: "Aim Accuracy", current: 78, trend: +5, color: "text-ow-blue" },
  { skill: "Game Sense", current: 65, trend: +12, color: "text-ow-purple" },
  { skill: "Positioning", current: 82, trend: +3, color: "text-ow-gold" },
  { skill: "Team Play", current: 71, trend: -2, color: "text-ow-orange" },
];

function getHeroIcon(hero: string) {
  const iconMap: Record<string, any> = {
    Tracer: Zap,
    Reinhardt: Shield,
    Ana: Heart,
    Soldier: Target,
    Widowmaker: Target,
    McCree: Target,
    Genji: Zap,
    Default: Star,
  };
  return iconMap[hero] || iconMap.Default;
}

function getHeroRole(hero: string): string {
  const roleMap: Record<string, string> = {
    Tracer: "Damage",
    Soldier: "Damage",
    Widowmaker: "Damage",
    McCree: "Damage",
    Genji: "Damage",
    Reinhardt: "Tank",
    Ana: "Support",
    Mercy: "Support",
    Lucio: "Support",
  };
  return roleMap[hero] || "Unknown";
}

export default function Dashboard() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [recentGames, setRecentGames] = useState<GameClip[]>([]);
  const [currentSR, setCurrentSR] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [heroStats, setHeroStats] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initialize default data if needed
    initializeDefaultData();

    // Load data from localStorage
    const playerProfile = getPlayerProfile();
    const clips = getGameClips().slice(0, 3); // Last 3 games
    const sr = getCurrentSR();
    const rate = getWinRate();
    const stats = getHeroStats();

    setProfile(playerProfile);
    setRecentGames(clips);
    setCurrentSR(sr);
    setWinRate(rate);
    setHeroStats(stats);
  }, []);

  const heroInsights = Object.entries(heroStats)
    .slice(0, 3)
    .map(([hero, stats]) => {
      const Icon = getHeroIcon(hero);
      const winRate =
        stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

      return {
        hero,
        role: getHeroRole(hero),
        playTime: `${stats.playTime.toFixed(1)}h`,
        winRate,
        avgElims: "--", // Would need more data tracking
        icon: Icon,
        color: "text-ow-orange",
      };
    });

  const peakSR = profile?.peakSr || currentSR;
  const totalGames = Object.values(heroStats).reduce(
    (sum, stats) => sum + stats.total,
    0,
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ow-orange">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{profile?.name ? `, ${profile.name}` : ""}! Here's
              your Overwatch performance overview.
            </p>
          </div>
          <Link to="/upload">
            <Button className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Clip
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-ow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current SR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ow-gold">
                {currentSR.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {recentGames[0]?.srChange ? (
                  <>
                    {recentGames[0].srChange > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={
                        recentGames[0].srChange > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {recentGames[0].srChange > 0 ? "+" : ""}
                      {recentGames[0].srChange} recent
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No recent data</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-ow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ow-blue">{winRate}%</div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Overall</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-ow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Games Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ow-purple">
                {totalGames}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Total uploaded</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-ow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Peak SR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-ow-diamond">
                {peakSR.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="w-4 h-4 text-ow-diamond" />
                <span className="text-ow-diamond">
                  {profile?.rank || "Unranked"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Games */}
          <Card className="card-ow lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-ow-orange" />
                Recent Games
              </CardTitle>
              <CardDescription>
                Your latest competitive matches and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentGames.length > 0 ? (
                recentGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-ow-dark-300/50 border border-ow-dark-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Badge
                          variant={
                            game.result === "victory"
                              ? "default"
                              : "destructive"
                          }
                          className={cn(
                            "text-xs",
                            game.result === "victory"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30",
                          )}
                        >
                          {game.result.charAt(0).toUpperCase() +
                            game.result.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">
                          {game.mode}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{game.map}</div>
                        <div className="text-sm text-muted-foreground">
                          {game.hero} • {game.duration || "Unknown duration"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-ow-gold">
                        {game.sr || "--"} SR
                      </div>
                      {game.srChange && (
                        <div
                          className={cn(
                            "text-sm flex items-center gap-1",
                            game.srChange > 0
                              ? "text-green-400"
                              : "text-red-400",
                          )}
                        >
                          {game.srChange > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {game.srChange > 0 ? "+" : ""}
                          {game.srChange}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No games uploaded yet</p>
                  <p className="text-sm">
                    Upload your first clip to see it here!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skill Trends */}
          <Card className="card-ow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-ow-blue" />
                Skill Trends
              </CardTitle>
              <CardDescription>
                Areas of improvement and decline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillTrends.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm", skill.color)}>
                        {skill.current}%
                      </span>
                      <span
                        className={cn(
                          "text-xs flex items-center gap-1",
                          skill.trend > 0 ? "text-green-400" : "text-red-400",
                        )}
                      >
                        {skill.trend > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {skill.trend > 0 ? "+" : ""}
                        {skill.trend}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={skill.current}
                    className="h-2 bg-ow-dark-400"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Hero Insights */}
        <Card className="card-ow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-ow-gold" />
              Hero Insights
            </CardTitle>
            <CardDescription>
              Your most played heroes and performance statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heroInsights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroInsights.map((hero) => {
                  const Icon = hero.icon;
                  return (
                    <div
                      key={hero.hero}
                      className="p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200 hover:bg-ow-dark-200/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            "bg-gradient-to-br from-ow-dark-200 to-ow-dark-300",
                          )}
                        >
                          <Icon className={cn("w-5 h-5", hero.color)} />
                        </div>
                        <div>
                          <div className="font-medium">{hero.hero}</div>
                          <div className="text-xs text-muted-foreground">
                            {hero.role}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Play Time
                          </span>
                          <span>{hero.playTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Win Rate
                          </span>
                          <span
                            className={cn(
                              hero.winRate >= 60
                                ? "text-green-400"
                                : hero.winRate >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400",
                            )}
                          >
                            {hero.winRate}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Avg Elims
                          </span>
                          <span>{hero.avgElims}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hero data available</p>
                <p className="text-sm">
                  Upload games to see your hero statistics!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
