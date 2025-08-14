import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Loader2,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import type { Conversation, Message } from "@shared/schema";

export default function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentConversationId]);

  // Focus input after sending message
  useEffect(() => {
    if (!newMessage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newMessage]);

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
  });

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await chatApi.createConversation(title);
      return res;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Nova conversa criada",
        description: "Você pode começar a conversar agora!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar conversa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (params: { conversationId: string; content: string }) => {
      const res = await chatApi.sendMessage(params.conversationId, params.content);
      return res;
    },
    onSuccess: (data, variables) => {
      // Invalidate both conversations list and specific conversation messages
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations", variables.conversationId, "messages"] 
      });
      // Clear the input
      setNewMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    if (!currentConversationId) {
      // Create conversation with the message content as title and send the message
      const messageContent = newMessage.trim();
      const title = messageContent.length > 50 ? messageContent.substring(0, 50) + "..." : messageContent;
      
      // Clear the input immediately to prevent multiple submissions
      setNewMessage("");
      
      createConversationMutation.mutate(title, {
        onSuccess: (conversation) => {
          // Set the current conversation ID immediately
          setCurrentConversationId(conversation.id);
          
          // Force refresh conversations list
          queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
          
          // Send the message after conversation is created
          sendMessageMutation.mutate({
            conversationId: conversation.id,
            content: messageContent,
          });
        },
        onError: () => {
          // Restore the message if conversation creation fails
          setNewMessage(messageContent);
        }
      });
      return;
    }

    sendMessageMutation.mutate({
      conversationId: currentConversationId,
      content: newMessage.trim(),
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'relative w-80'} 
        transition-transform duration-300 ease-in-out
        glass-sidebar
      `}>
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={() => {
            setCurrentConversationId(null);
            setNewMessage("");
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="glass-card rounded-none border-x-0 border-t-0 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden hover-lift"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background animate-pulse">
                    <Sparkles className="h-2 w-2 text-primary-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <h1 className="text-lg font-bold gradient-text">
                    {currentConversation?.title || "Catalyst IA Assistant"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation 
                      ? `${messages.length} mensagens` 
                      : "Assistente Catalyst IA para qualquer apresentação"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentConversationId(null);
                  setNewMessage("");
                }}
                className="hover-lift hidden sm:flex"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nova Conversa
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Messages Area */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="responsive-padding py-6 space-y-6">
            {!currentConversationId ? (
              // Welcome Screen
              <div className="max-w-2xl mx-auto text-center space-y-8 mt-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <Avatar className="h-20 w-20 mx-auto border-4 border-primary/20 relative">
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      <Bot className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold gradient-text">
                    Bem-vindo ao Catalyst IA
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Seu assistente Catalyst IA para qualquer apresentação. Especialista em texto e criação de conteúdo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
                  <div className="card-modern space-y-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">Conversas Inteligentes</h3>
                    <p className="text-sm text-muted-foreground">
                      Faça perguntas complexas e obtenha respostas detalhadas
                    </p>
                  </div>

                  <div className="card-modern space-y-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">Geração de Imagens</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie imagens incríveis apenas descrevendo o que deseja
                    </p>
                  </div>

                  <div className="card-modern space-y-3 sm:col-span-2 lg:col-span-1">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold">IA Avançada</h3>
                    <p className="text-sm text-muted-foreground">
                      Catalyst IA com as mais recentes tecnologias para apresentações
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-8">
                  Digite sua primeira mensagem abaixo para começar uma nova conversa
                </div>
              </div>
            ) : messagesLoading ? (
              // Loading Messages
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-fade-in">
                    <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-24" />
                      <div className="skeleton h-16 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Messages List
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-4 animate-fade-in ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-primary text-white text-sm">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`
                      flex flex-col gap-2 max-w-[85%]
                      ${message.role === 'user' ? 'items-end' : 'items-start'}
                    `}>
                      <div className={`
                        rounded-2xl px-4 py-3 shadow-sm hover-lift
                        ${message.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-md' 
                          : 'bg-muted text-foreground rounded-tl-md border'
                        }
                      `}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                        
                        {message.imageUrl && (
                          <div className="mt-3 rounded-lg overflow-hidden border">
                            <img 
                              src={message.imageUrl} 
                              alt="Generated by AI"
                              className="w-full h-auto max-w-sm hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground px-1">
                        {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Loading message */}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-4 animate-fade-in">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-md px-4 py-3 border animate-pulse">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processando sua mensagem</span>
                        <span className="loading-dots text-sm"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t bg-background/80 backdrop-blur-sm p-4 sm:p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    currentConversationId 
                      ? "Digite sua mensagem..." 
                      : "Digite para criar uma nova conversa..."
                  }
                  disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
                  className="input-modern pr-12 min-h-[48px] resize-none"
                  maxLength={1000}
                />
                
                <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                  {newMessage.length}/1000
                </div>
              </div>

              <Button
                type="submit"
                disabled={!newMessage.trim() || sendMessageMutation.isPending || createConversationMutation.isPending}
                className="btn-primary-modern h-12 px-6"
              >
                {sendMessageMutation.isPending || createConversationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-2">
                  {currentConversationId ? "Enviar" : "Começar"}
                </span>
              </Button>
            </div>

            <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>✨ Catalyst IA especialista em apresentações</span>
                {currentConversation && (
                  <span>💬 {messages.length} mensagens nesta conversa</span>
                )}
              </div>
              
              <div className="hidden sm:block">
                Pressione Enter para enviar
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}