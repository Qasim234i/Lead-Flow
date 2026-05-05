import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, DashboardData, formatCurrency, statusColor } from "@/lib/api";
import {
  Users,
  Sparkles,
  TrendingUp,
  Trophy,
  XCircle,
  ArrowUpRight,
  Loader2,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!data) return null;

  const winRate =
    data.counts.totalLeads > 0
      ? Math.round((data.counts.wonLeads / data.counts.totalLeads) * 100)
      : 0;

  const stats = [
    {
      label: "Total Leads",
      value: data.counts.totalLeads,
      icon: Users,
      tone: "info",
    },
    {
      label: "New Leads",
      value: data.counts.newLeads,
      icon: Sparkles,
      tone: "new",
    },
    {
      label: "Qualified",
      value: data.counts.qualifiedLeads,
      icon: TrendingUp,
      tone: "qualified",
    },
    {
      label: "Won",
      value: data.counts.wonLeads,
      icon: Trophy,
      tone: "won",
    },
    {
      label: "Lost",
      value: data.counts.lostLeads,
      icon: XCircle,
      tone: "lost",
    },
  ];

  const toneClass: Record<string, string> = {
    info: "bg-info/10 text-info",
    new: "bg-status-new/10 text-status-new",
    qualified: "bg-status-qualified/10 text-status-qualified",
    won: "bg-status-won/10 text-status-won",
    lost: "bg-status-lost/10 text-status-lost",
  };

  const pipeline = [
    { label: "New", count: data.counts.newLeads, color: "bg-status-new" },
    { label: "Contacted", count: data.counts.contactedLeads, color: "bg-status-contacted" },
    { label: "Qualified", count: data.counts.qualifiedLeads, color: "bg-status-qualified" },
    { label: "Proposal Sent", count: data.counts.proposalSentLeads, color: "bg-status-proposal" },
    { label: "Won", count: data.counts.wonLeads, color: "bg-status-won" },
    { label: "Lost", count: data.counts.lostLeads, color: "bg-status-lost" },
  ];
  const maxCount = Math.max(...pipeline.map((p) => p.count), 1);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h1 className="font-display text-3xl font-bold mt-1">Dashboard</h1>
        </div>
      </header>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-primary-foreground shadow-pop">
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent-emerald/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <DollarSign className="h-4 w-4" /> Pipeline value
            </div>
            <p className="font-display text-4xl font-bold mt-3">
              {formatCurrency(data.revenue.totalDealValue)}
            </p>
            <p className="text-sm text-primary-foreground/60 mt-2">
              Across {data.counts.totalLeads} leads
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Trophy className="h-4 w-4 text-status-won" /> Won revenue
          </div>
          <p className="font-display text-4xl font-bold mt-3 text-status-won">
            {formatCurrency(data.revenue.wonDealValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Win rate <span className="font-semibold text-foreground">{winRate}%</span>
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <XCircle className="h-4 w-4 text-status-lost" /> Lost revenue
          </div>
          <p className="font-display text-4xl font-bold mt-3 text-status-lost">
            {formatCurrency(data.revenue.lostDealValue)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {data.counts.lostLeads} closed lost
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-card border border-border p-5 shadow-card"
          >
            <div
              className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center",
                toneClass[s.tone]
              )}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <p className="font-display text-3xl font-bold mt-4">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Pipeline</h2>
            <Link
              to="/leads"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-4">
            {pipeline.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{p.label}</span>
                  <span className="text-muted-foreground tabular-nums">{p.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", p.color)}
                    style={{ width: `${(p.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold mb-4">Recent leads</h2>
          <div className="space-y-3">
            {data.recentLeads.length === 0 && (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            )}
            {data.recentLeads.map((l) => (
              <Link
                key={l._id}
                to={`/leads/${l._id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
              >
                <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                  {l.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {l.company} · {formatDistanceToNow(new Date(l.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full border",
                    statusColor[l.status]
                  )}
                >
                  {l.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
