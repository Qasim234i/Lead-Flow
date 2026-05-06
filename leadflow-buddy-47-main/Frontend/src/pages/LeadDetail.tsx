import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, Lead, LEAD_STATUSES, Note, formatCurrency, statusColor } from "@/lib/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User as UserIcon,
  Loader2,
  Pencil,
  Trash2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow, format } from "date-fns";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [l, n] = await Promise.all([
      api.get(`/api/leads/${id}`),
      api.get(`/api/notes/${id}`),
    ]);
    setLead(l.data.data);
    setNotes(n.data.data);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const updateStatus = async (status: string) => {
    if (!lead) return;
    const { data } = await api.put(`/api/leads/${lead._id}`, { status });
    setLead(data.data);
    toast.success(`Status updated to ${status}`);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !user) return;
    setPosting(true);
    try {
      await api.post("/api/notes", { leadId: id, content: noteContent.trim(), createdBy: user.name });
      setNoteContent("");
      const n = await api.get(`/api/notes/${id}`);
      setNotes(n.data.data);
    } finally {
      setPosting(false);
    }
  };

  const remove = async () => {
    await api.delete(`/api/leads/${id}`);
    toast.success("Lead deleted");
    navigate("/api/leads");
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!lead) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Link to="/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </Link>

      <div className="rounded-2xl gradient-primary text-primary-foreground p-8 shadow-pop relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-emerald/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl gradient-emerald flex items-center justify-center text-2xl font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{lead.name}</h1>
              <p className="text-primary-foreground/70 flex items-center gap-1.5 mt-1">
                <Building2 className="h-4 w-4" /> {lead.company}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Deal value</p>
            <p className="font-display text-4xl font-bold mt-1">{formatCurrency(lead.dealValue)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={lead.status} onValueChange={updateStatus}>
          <SelectTrigger className={cn("w-[200px] font-medium", statusColor[lead.status])}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" onClick={() => setEditOpen(true)} className="gap-2">
          <Pencil className="h-4 w-4" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All notes for this lead will remain in the database but will be orphaned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <DetailRow icon={Mail} label="Email" value={lead.email} />
          <DetailRow icon={Phone} label="Phone" value={lead.phone} />
          <DetailRow icon={UserIcon} label="Owner" value={lead.assignedTo} />
          <DetailRow icon={Building2} label="Source" value={lead.source} />
          <div className="pt-3 border-t border-border text-xs text-muted-foreground">
            Created {format(new Date(lead.createdAt), "PP")}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold mb-4">Notes</h2>
          <form onSubmit={addNote} className="space-y-3">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add a note about this lead…"
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!noteContent.trim() || posting} className="gap-2">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Add note
              </Button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {notes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No notes yet.</p>
            )}
            {notes.map((n) => (
              <div key={n._id} className="flex gap-3">
                <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {n.createdBy.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{n.createdBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LeadFormDialog open={editOpen} onOpenChange={setEditOpen} lead={lead} onSaved={load} />
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

export default LeadDetail;
