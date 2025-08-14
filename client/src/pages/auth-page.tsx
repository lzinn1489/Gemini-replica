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
  Check
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
    "Respostas contextuais e precisas",
    "Geração de imagens de alta qualidade",
    "Histórico de conversas organizado",
    "Suporte a múltiplas sessões",
    "Atualizações constantes da IA"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Hero Section - Takes more space */}
          <div className="xl:col-span-3 space-y-8 lg:space-y-12">
            {/* Header */}
            <div className="text-center xl:text-left space-y-6">
              <div className="flex items-center justify-center xl:justify-start gap-4 mb-8">
                <div className="relative">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-2xl flex items-center justify-center shadow-2xl">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center animate-bounce-gentle">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Catalyst IA</h1>
                  <p className="text-sm text-muted-foreground">Assistente IA para apresentações</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  O Futuro da
                  <br />
                  <span className="gradient-text animate-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]">
                    Inteligência Artificial
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto xl:mx-0 leading-relaxed">
                  Experimente a próxima geração de assistentes de IA. Converse naturalmente, 
                  gere imagens impressionantes e explore possibilidades ilimitadas.
                </p>
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
                <div key={index} className="card-modern space-y-4 group hover:scale-105 transition-all duration-300">
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
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-muted-foreground">Usuários Ativos</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-sm text-muted-foreground">Conversas Criadas</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">25K+</div>
                <div className="text-sm text-muted-foreground">Imagens Geradas</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Auth Form - Takes less space */}
          <div className="xl:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Card className="shadow-2xl border-0 glass-card">
                <CardHeader className="space-y-4 pb-6">
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Entre ou crie sua conta para começar sua jornada
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-11">
                      <TabsTrigger value="login" className="font-semibold">Entrar</TabsTrigger>
                      <TabsTrigger value="register" className="font-semibold">Criar Conta</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-6">
                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="login-username" className="text-sm font-semibold">
                            Nome de usuário
                          </Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-username"
                              type="text"
                              placeholder="Seu nome de usuário"
                              value={loginData.username}
                              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                              className="input-modern pl-12 h-12 text-base"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="login-password" className="text-sm font-semibold">
                            Senha
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="Sua senha segura"
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              className="input-modern pl-12 h-12 text-base"
                              disabled={loginMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="btn-primary-modern w-full h-12 text-base font-semibold"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Entrando...
                            </>
                          ) : (
                            <>
                              <User className="mr-2 h-4 w-4" />
                              Entrar na Plataforma
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-6">
                      <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-3">
                          <Label htmlFor="register-username" className="text-sm font-semibold">
                            Nome de usuário
                          </Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-username"
                              type="text"
                              placeholder="Escolha um nome único"
                              value={registerData.username}
                              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                              className="input-modern pl-12 h-12 text-base"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-email" className="text-sm font-semibold">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="seu.email@exemplo.com"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className="input-modern pl-12 h-12 text-base"
                              disabled={registerMutation.isPending}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="register-password" className="text-sm font-semibold">
                            Senha
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="register-password"
                              type="password"
                              placeholder="Mínimo 6 caracteres"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className="input-modern pl-12 h-12 text-base"
                              disabled={registerMutation.isPending}
                              required
                              minLength={6}
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="btn-primary-modern w-full h-12 text-base font-semibold"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Criando conta...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-2 h-4 w-4" />
                              Criar Minha Conta
                            </>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <div className="relative">
                    <Separator className="my-6" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-card px-4 text-xs text-muted-foreground font-medium">
                        PLATAFORMA SEGURA
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Dados protegidos com criptografia SSL</span>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Ao continuar, você concorda com nossos{" "}
                        <button className="text-primary hover:underline font-medium">
                          Termos de Uso
                        </button>{" "}
                        e{" "}
                        <button className="text-primary hover:underline font-medium">
                          Política de Privacidade
                        </button>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}