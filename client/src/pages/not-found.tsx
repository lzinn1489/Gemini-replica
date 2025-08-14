import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Página não encontrada</p>
        <Link href="/">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">
            Voltar ao Chat
          </button>
        </Link>
      </div>
    </div>
  );
}
