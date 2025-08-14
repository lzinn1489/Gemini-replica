import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  User, 
  Settings, 
  LogOut, 
  Bot, 
  Sparkles,
  Calendar,
  ChevronRight,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Conversation } from "@shared/schema";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const queryClient = useQueryClient();

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await chatApi.deleteConversation(conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversa removida",
        description: "A conversa foi excluída com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover conversa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta conversa?")) {
      deleteConversationMutation.mutate(conversationId);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logoutMutation.mutate();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const date = new Date(conv.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let groupKey = '';
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ontem';
    } else if (date > weekAgo) {
      groupKey = 'Últimos 7 dias';
    } else {
      groupKey = format(date, 'MMMM yyyy', { locale: ptBR });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="h-full flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background animate-pulse">
              <Sparkles className="h-2 w-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold gradient-text truncate">Zero-Two AI</h2>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              {conversations.length} conversas
            </p>
          </div>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full btn-primary-modern h-10 text-sm font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder:text-muted-foreground transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-2 space-y-1">
          {Object.keys(groupedConversations).length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="h-16 w-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Nenhuma conversa ainda</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Clique em "Nova Conversa" para começar a usar o Zero-Two AI
              </p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
              <div key={groupName} className="mb-6">
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {groupName}
                  </span>
                </div>

                <div className="space-y-1">
                  {groupConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                      className={`
                        sidebar-item group cursor-pointer
                        ${currentConversationId === conversation.id ? 'active' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-sidebar-foreground/60 truncate">
                            {format(new Date(conversation.createdAt), "dd/MM/yy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteConversation(e, conversation.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                            disabled={deleteConversationMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {currentConversationId === conversation.id && (
                        <ChevronRight className="h-4 w-4 text-sidebar-primary-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.username || "Usuário"}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              Plano Gratuito
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs justify-start hover:bg-sidebar-accent/50"
          >
            <Settings className="h-3 w-3 mr-2" />
            Configurações
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="h-8 text-xs justify-start hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-3 w-3 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}