import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags?: string[];
}

export const NotesWidget = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", tags: "" });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, store in localStorage since we don't have a notes table
      const stored = localStorage.getItem(`notes_${user.id}`);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const saveNote = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in title and content");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const note: Note = {
        id: editingId || crypto.randomUUID(),
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        created_at: new Date().toISOString(),
      };

      let updatedNotes;
      if (editingId) {
        updatedNotes = notes.map(n => n.id === editingId ? note : n);
        toast.success("Note updated");
      } else {
        updatedNotes = [note, ...notes];
        toast.success("Note added");
      }

      setNotes(updatedNotes);
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
      
      setFormData({ title: "", content: "", tags: "" });
      setIsAdding(false);
      setEditingId(null);
    } catch (error: any) {
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updatedNotes = notes.filter(n => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${user.id}`, JSON.stringify(updatedNotes));
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const editNote = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(", ") || ""
    });
    setEditingId(note.id);
    setIsAdding(true);
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle>Financial Notes</CardTitle>
          </div>
          <Button 
            size="sm" 
            onClick={() => {
              setIsAdding(!isAdding);
              setEditingId(null);
              setFormData({ title: "", content: "", tags: "" });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </div>
        <CardDescription>Keep track of important financial reminders</CardDescription>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3 animate-fade-in">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Tax Documents"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note here..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., tax, important, deadline"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveNote} size="sm">
                {editingId ? "Update" : "Save"} Note
              </Button>
              <Button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ title: "", content: "", tags: "" });
                }} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet. Add your first financial note!
            </p>
          ) : (
            notes.map((note) => (
              <div 
                key={note.id} 
                className="p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-all animate-fade-in"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{note.title}</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => editNote(note)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2 whitespace-pre-wrap">{note.content}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
