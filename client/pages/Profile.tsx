import { Layout } from "@/components/ui/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  User,
  Trophy,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Star,
  Edit,
  Save,
  Calendar,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getPlayerProfile,
  savePlayerProfile,
  getGameClips,
  getHeroStats,
  getWinRate,
  getCurrentSR,
  getRecentSRChanges,
  initializeDefaultData,
  type PlayerProfile,
} from "@/lib/storage";

const ranks = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Top 500",
];

const roles = ["Tank", "Damage", "Support"];

const heroes = {
  Tank: [
    "Reinhardt",
    "Dva",
    "Winston",
    "Roadhog",
    "Zarya",
    "Orisa",
    "Sigma",
    "Wrecking Ball",
  ],
  Damage: [
    "Tracer",
    "Soldier",
    "McCree",
    "Widowmaker",
    "Genji",
    "Pharah",
    "Reaper",
    "Sombra",
  ],
  Support: [
    "Ana",
    "Mercy",
    "Lucio",
    "Zenyatta",
    "Moira",
    "Baptiste",
    "Brigitte",
  ],
};

function getHeroIcon(hero: string) {
  const iconMap: Record<string, any> = {
    Tracer: Zap,
    Reinhardt: Shield,
    Ana: Heart,
    Default: Star,
  };
  return iconMap[hero] || iconMap.Default;
}

function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    Bronze: "text-rank-bronze",
    Silver: "text-rank-silver",
    Gold: "text-rank-gold",
    Platinum: "text-rank-platinum",
    Diamond: "text-rank-diamond",
    Master: "text-rank-master",
    Grandmaster: "text-rank-grandmaster",
    "Top 500": "text-rank-grandmaster",
  };
  return colors[rank] || "text-muted-foreground";
}

export default function Profile() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [heroStats, setHeroStats] = useState<Record<string, any>>({});
  const [winRate, setWinRate] = useState(0);
  const [currentSR, setCurrentSR] = useState(0);
  const [srHistory, setSrHistory] = useState<number[]>([]);
  const [gameClips, setGameClips] = useState<any[]>([]);

  useEffect(() => {
    initializeDefaultData();

    const playerProfile = getPlayerProfile();
    const clips = getGameClips();
    const stats = getHeroStats();
    const rate = getWinRate();
    const sr = getCurrentSR();
    const srChanges = getRecentSRChanges();

    setProfile(playerProfile);
    setGameClips(clips);
    setHeroStats(stats);
    setWinRate(rate);
    setCurrentSR(sr);
    setSrHistory(srChanges);
  }, []);

  const handleSaveProfile = () => {
    if (profile) {
      savePlayerProfile(profile);
      setIsEditing(false);
    }
  };

  const updateProfile = (field: keyof PlayerProfile, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const addPreferredHero = (hero: string) => {
    if (profile && !profile.preferredHeroes.includes(hero)) {
      updateProfile("preferredHeroes", [...profile.preferredHeroes, hero]);
    }
  };

  const removePreferredHero = (hero: string) => {
    if (profile) {
      updateProfile(
        "preferredHeroes",
        profile.preferredHeroes.filter((h) => h !== hero),
      );
    }
  };

  const topHeroes = Object.entries(heroStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)
    .map(([hero, stats]) => ({
      hero,
      games: stats.total,
      winRate:
        stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
      playTime: stats.playTime.toFixed(1),
    }));

  if (!profile) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ow-orange">
              Player Profile & Analytics
            </h1>
            <p className="text-muted-foreground">
              Manage your profile and view detailed performance analytics
            </p>
          </div>
          <Button
            onClick={() =>
              isEditing ? handleSaveProfile() : setIsEditing(true)
            }
            className={isEditing ? "btn-primary" : "btn-secondary"}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="heroes">Hero Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-ow-orange" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Player Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      disabled={!isEditing}
                      className="bg-ow-dark-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="battletag">BattleTag</Label>
                    <Input
                      id="battletag"
                      value={profile.battletag}
                      onChange={(e) =>
                        updateProfile("battletag", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="PlayerName#1234"
                      className="bg-ow-dark-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rank">Current Rank</Label>
                    <Select
                      value={profile.rank}
                      onValueChange={(value) => updateProfile("rank", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-ow-dark-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            <span className={getRankColor(rank)}>{rank}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sr">Current SR</Label>
                      <Input
                        id="sr"
                        type="number"
                        value={profile.sr}
                        onChange={(e) =>
                          updateProfile("sr", parseInt(e.target.value) || 0)
                        }
                        disabled={!isEditing}
                        className="bg-ow-dark-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peakSr">Peak SR</Label>
                      <Input
                        id="peakSr"
                        type="number"
                        value={profile.peakSr}
                        onChange={(e) =>
                          updateProfile("peakSr", parseInt(e.target.value) || 0)
                        }
                        disabled={!isEditing}
                        className="bg-ow-dark-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferred Roles & Heroes */}
              <Card className="card-ow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-ow-gold" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <Badge
                          key={role}
                          variant={
                            profile.preferredRoles.includes(role)
                              ? "default"
                              : "outline"
                          }
                          className={cn(
                            "cursor-pointer transition-colors",
                            profile.preferredRoles.includes(role)
                              ? "bg-ow-orange text-ow-dark-500"
                              : "hover:bg-ow-orange/20",
                          )}
                          onClick={() => {
                            if (!isEditing) return;
                            const roles = profile.preferredRoles.includes(role)
                              ? profile.preferredRoles.filter((r) => r !== role)
                              : [...profile.preferredRoles, role];
                            updateProfile("preferredRoles", roles);
                          }}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Heroes</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profile.preferredHeroes.map((hero) => (
                        <Badge
                          key={hero}
                          variant="default"
                          className="bg-ow-blue text-white cursor-pointer"
                          onClick={() => isEditing && removePreferredHero(hero)}
                        >
                          {hero} {isEditing && "×"}
                        </Badge>
                      ))}
                    </div>

                    {isEditing && (
                      <Select onValueChange={addPreferredHero}>
                        <SelectTrigger className="bg-ow-dark-300">
                          <SelectValue placeholder="Add a hero..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(heroes).map(([role, heroList]) => (
                            <div key={role}>
                              <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                                {role}
                              </div>
                              {heroList.map((hero) => (
                                <SelectItem
                                  key={hero}
                                  value={hero}
                                  disabled={profile.preferredHeroes.includes(
                                    hero,
                                  )}
                                >
                                  {hero}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
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
                    <Trophy className="w-4 h-4 text-ow-diamond" />
                    <span className={getRankColor(profile.rank)}>
                      {profile.rank}
                    </span>
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
                  <div className="text-2xl font-bold text-ow-blue">
                    {winRate}%
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Overall</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-ow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Games Tracked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-ow-purple">
                    {gameClips.length}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Total</span>
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
                    {profile.peakSr.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-ow-gold" />
                    <span className="text-ow-gold">Personal best</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SR Trend */}
            <Card className="card-ow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-ow-blue" />
                  SR Trend
                </CardTitle>
                <CardDescription>
                  Your skill rating changes over recent games
                </CardDescription>
              </CardHeader>
              <CardContent>
                {srHistory.length > 0 ? (
                  <div className="h-64 flex items-end gap-2">
                    {srHistory.map((change, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className={cn(
                            "w-full rounded-t transition-colors",
                            change > 0
                              ? "bg-green-500"
                              : change < 0
                                ? "bg-red-500"
                                : "bg-gray-500",
                          )}
                          style={{
                            height: `${Math.max(Math.abs(change) * 2, 4)}px`,
                            maxHeight: "200px",
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {change > 0 ? "+" : ""}
                          {change}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No SR data available</p>
                    <p className="text-sm">
                      Upload games with SR info to see trends
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heroes" className="space-y-6">
            <Card className="card-ow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-ow-gold" />
                  Hero Performance
                </CardTitle>
                <CardDescription>
                  Detailed statistics for your most played heroes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topHeroes.length > 0 ? (
                  <div className="space-y-4">
                    {topHeroes.map((hero, index) => {
                      const Icon = getHeroIcon(hero.hero);
                      return (
                        <div
                          key={hero.hero}
                          className="flex items-center justify-between p-4 rounded-lg bg-ow-dark-300/30 border border-ow-dark-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-ow-orange">
                              #{index + 1}
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-ow-dark-200 to-ow-dark-300 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-ow-orange" />
                            </div>
                            <div>
                              <div className="font-medium">{hero.hero}</div>
                              <div className="text-sm text-muted-foreground">
                                {hero.games} games • {hero.playTime}h played
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
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
                            <div className="text-sm text-muted-foreground">
                              Win Rate
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
                      Upload games to see your hero performance!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
