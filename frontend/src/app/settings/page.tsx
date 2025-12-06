'use client'

import { useState, useEffect } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Header } from "@/components/header";

const Settings = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    setProfile({
      name: currentUser.name || "",
      email: currentUser.email || "",
      bio: currentUser.bio || "",
      avatar: currentUser.avatar || "",
    });
  }, [router]);

  const handleSaveProfile = () => {
    // Here you would call the API to update profile
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erro ao atualizar senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    // Here you would call the API to update password
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi alterada com sucesso.",
    });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    router.push('/auth/login');
  };

  const getUserInitials = () => {
    if (!profile.name) return 'U';
    return profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-10">
        <div className="container w-full mx-6 py-4">
          <div className="flex items-center gap-4 w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie seu perfil e segurança
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-6 py-8 space-y-8">
        
        {/* Profile Section */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Informações do Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Atualize os detalhes do seu perfil
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || undefined} />
              <AvatarFallback className="text-2xl font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {/* <div className="space-y-2">
              <Button variant="outline" size="sm">
                Alterar Avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou GIF. Tamanho máximo 2MB.
              </p>
            </div> */}
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Alterar Senha</h3>
            <p className="text-sm text-muted-foreground">
              Mantenha sua conta segura
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input 
                id="current-password" 
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdatePassword}>Atualizar Senha</Button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="rounded-lg border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Sair da Conta</h4>
              <p className="text-sm text-muted-foreground">
                Faça logout da sua conta atual neste dispositivo
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
