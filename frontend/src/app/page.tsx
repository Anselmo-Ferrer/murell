import { ArrowRight, CheckCircle, LayoutDashboard, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from '@/assets/images/CardsPage.png'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold italic text-foreground">Murell</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/auth">
            <Button>Começar grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Organize seu trabalho de forma{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              simples e visual
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Murell ajuda equipes a moverem projetos para frente. Colabore, gerencie 
            e alcance novos patamares de produtividade.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/auth">
              <Button size="lg" className="gap-2">
                Começar agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/boards">
              <Button size="lg" variant="outline">
                Ver demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
            <Image 
              src={heroImage}
              alt="Murell Dashboard" 
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Tudo que você precisa para produzir mais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recursos poderosos que se adaptam à forma como sua equipe trabalha
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4 p-8 rounded-xl border bg-card hover:shadow-lg transition-all animate-fade-in">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Boards Visuais</h3>
            <p className="text-muted-foreground">
              Organize tarefas em quadros visuais intuitivos. Arraste e solte para priorizar.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-xl border bg-card hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Colaboração em Tempo Real</h3>
            <p className="text-muted-foreground">
              Trabalhe junto com sua equipe, comente e receba atualizações instantâneas.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-xl border bg-card hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Automatização Inteligente</h3>
            <p className="text-muted-foreground">
              Automatize tarefas repetitivas e foque no que realmente importa.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 bg-muted/30 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold">
            Confiado por milhares de equipes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10k+</div>
              <div className="text-muted-foreground">Equipes ativas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">1M+</div>
              <div className="text-muted-foreground">Tarefas completadas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">99%</div>
              <div className="text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-to-r from-primary/10 to-purple-600/10 border">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto para começar?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de equipes que já transformaram sua produtividade
          </p>
          <Link href="/auth">
            <Button size="lg" className="gap-2">
              Criar conta grátis <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold italic text-foreground">Murell</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Murell. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;