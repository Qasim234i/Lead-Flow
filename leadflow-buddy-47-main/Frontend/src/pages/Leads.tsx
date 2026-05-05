import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, Lead, LEAD_SOURCES, LEAD_STATUSES, formatCurrency, statusColor } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2, Mail, Phone, Building2, X } from "lucide-react";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [assignedTo, setAssignedTo] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (status !== "all") params.status = status;
    if (source !== "all") params.source = source;
    if (assignedTo !== "all") params.assignedTo = assignedTo;
    const { data } = await api.get("/leads", { params });
    setLeads(data.data);
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(fetchLeads, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, source, assignedTo]);

  const owners = useMemo(
    () => Array.from(new Set(leads.map((l) => l.assignedTo))).sort(),
    [leads]
  );

  const hasFilters = status !== "all" || source !== "all" || assignedTo !== "all" || search;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Pipeline</p>
          <h1 className="font-display text-3xl font-bold mt-1">Leads</h1>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New lead
        </Button>
      </header>

      <div className="rounded-2xl bg-card border border-border p-4 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company or email…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {LEAD_SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Owner" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All owners</SelectItem>
              {owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={() => { setSearch(""); setStatus("all"); setSource("all"); setAssignedTo("all"); }}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-display text-xl font-semibold">No leads found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting filters or create your first lead.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Lead</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Value</th>
                <th className="px-6 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => (
                <tr key={l._id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/leads/${l._id}`} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {l.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-accent-emerald transition-colors">{l.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {l.company}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {l.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" /> {l.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{l.source}</td>
                  <td className="px-6 py-4 text-sm">{l.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", statusColor[l.status])}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold tabular-nums">
                    {formatCurrency(l.dealValue)}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(l.updatedAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <LeadFormDialog open={open} onOpenChange={setOpen} onSaved={fetchLeads} />
    </div>
  );
};

export default Leads;
