import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Particles from "@/components/ui/particles";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Bot, 
  MessageSquare, 
  Sparkles, 
  Image as ImageIcon,
  Shield,
  Zap,
  Globe,
  Check,
  LogIn,
  UserPlus,
  Star,
  Rocket,
  Crown,
  Heart,
  Brain,
  Eye
} from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.username.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    if (!registerData.email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }
    if (registerData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(registerData);
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Conversas Inteligentes",
      description: "IA avançada para conversas naturais e contextuais",
      color: "text-blue-500"
    },
    {
      icon: ImageIcon,
      title: "Geração de Imagens",
      description: "Crie imagens impressionantes com apenas uma descrição",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "Respostas Rápidas",
      description: "Processamento ultra-rápido com Catalyst IA",
      color: "text-amber-500"
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Criptografia avançada e proteção total da privacidade",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Acesso Global",
      description: "Disponível 24/7 em qualquer lugar do mundo",
      color: "text-cyan-500"
    },
    {
      icon: Bot,
      title: "Catalyst IA",
      description: "Especialista em apresentações e criação de conteúdo",
      color: "text-rose-500"
    }
  ];

  const benefits = [
    "Interface moderna e intuitiva",
    "Suporte completo em português brasileiro",
    "Geração de imagens de alta qualidade",
    "Histórico de conversas organizado",
    "Suporte a múltiplas sessões simultâneas",
    "Atualizações automáticas da IA"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-fade-in">
      <Particles className="opacity-30" quantity={150} />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-3xl" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '1s'}} />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse-subtle" style={{animationDelay: '2s'}} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Hero Section - Takes more space */}
          <div className="xl:col-span-3 space-y-8 lg:space-y-12">
            {/* Header */}
            <div className="text-center xl:text-left space-y-6">
              <div className="flex items-center justify-center xl:justify-start gap-4 mb-8 animate-slide-in-left">
                <div className="relative animate-floating">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle shadow-lg">
                    <Sparkles className="h-3 w-3 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Catalyst IA</h1>
                  <p className="text-sm text-gray-400">Plataforma de Inteligência Artificial</p>
                </div>
              </div>

              <div className="space-y-6 animate-slide-in-right">
                <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  O Futuro da
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%]">
                    Inteligência Artificial
                  </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto xl:mx-0 leading-relaxed">
                  Experimente a próxima geração de assistentes de IA. Converse naturalmente, 
                  gere imagens impressionantes e explore possibilidades ilimitadas.
                </p>
                
                {/* Botões de ação rápida */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto xl:mx-0">
                  <Button 
                    onClick={() => {
                      document.getElementById('auth-form')?.scrollIntoView({behavior: 'smooth'});
                      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                      if (loginTab) loginTab.click();
                    }}
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Fazer Login
                  </Button>
                  <Button 
                    onClick={() => {
                      document.getElementById('auth-form')?.scrollIntoView({behavior: 'smooth'});
                      const registerTab = document.querySelector('[value="register"]') as HTMLElement;
                      if (registerTab) registerTab.click();
                    }}
                    className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Criar Conta
                  </Button>
                </div>
                
                {/* CTA pills */}
                <div className="flex flex-wrap gap-4 mt-8 justify-center xl:justify-start">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Crown className="inline w-4 h-4 mr-2 text-yellow-400" />
                    Experiência Premium
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Rocket className="inline w-4 h-4 mr-2 text-blue-400" />
                    Ultra Rápido
                  </div>
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                    <Heart className="inline w-4 h-4 mr-2 text-red-400" />
                    Feito com Amor
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Gratuito para começar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Sem cartão necessário</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Acesso instantâneo</span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="card-modern space-y-4 group hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Benefits List */}
            <div className="card-modern p-6 lg:p-8 space-y-6">
              <h3 className="text-2xl font-bold gradient-text text-center xl:text-left">
                Por que escolher Catalyst IA?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '200ms'}}>
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '300ms'}}>
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-sm text-muted-foreground">Conversas Criadas</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '400ms'}}>
                <div className="text-3xl font-bold gradient-text">25K+</div>
                <div className="text-sm text-muted-foreground">Imagens Geradas</div>
              </div>
              <div className="space-y-2 animate-scale-in" style={{animationDelay: '500ms'}}>
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Auth Form - Takes less space */}
          <div className="xl:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-md animate-slide-up">
              <Card id="auth-form" className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-2xl hover-lift rounded-3xl overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 opacity-50 blur-xl" />
                <div className="relative z-10">
                <CardHeader className="space-y-4 pb-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-glow">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</CardTitle>
                    <CardDescription className="text-gray-300">
                      Entre ou crie sua conta para começar sua jornada
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                      <TabsTrigger value="login" className="font-semibold text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all">
                        <LogIn className="w-4 h-4 mr-2" />
                        Entrar
                      </TabsTrigger>
                      <TabsTrigger value="register" className="font-semibold text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Registro
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="login-username" className="text-sm font-semibold text-white">
                            Nome de usuário
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="login-username"
                              type="text"
                              placeholder="Seu nome de usuário"
                              value={loginData.username}
                              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="login-password" className="text-sm font-semibold text-white">
                            Senha
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="Sua senha segura"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Entrando...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-4 w-4" />
                              Entrar na Plataforma
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-6">
                      <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="register-username" className="text-sm font-semibold text-white">
                            Nome de usuário
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-username"
                              type="text"
                              placeholder="Escolha um nome único"
                              value={registerData.username}
                              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-email" className="text-sm font-semibold text-white">
                            Email
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="seu.email@exemplo.com"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-password" className="text-sm font-semibold text-white">
                            Senha
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <Input
                              id="register-password"
                              type="password"
                              placeholder="Mínimo 6 caracteres"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className="pl-12 h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm transition-all"
                              disabled={registerMutation.isPending}
                              required
                              minLength={6}
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Criando conta...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Criar Minha Conta
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="relative">
                    <div className="my-6 border-t border-white/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm px-4 text-xs text-gray-300 font-medium rounded-full border border-white/20">
                        PLATAFORMA SEGURA
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span>Dados protegidos com criptografia SSL</span>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Ao continuar, você concorda com nossos{" "}
                        <button className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
                          Termos de Uso
                        </button>{" "}
                        e{" "}
                        <button className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
                          Política de Privacidade
                        </button>
                      </p>
                    </div>
                  </div>
                </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}