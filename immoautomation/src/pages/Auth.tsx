import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Lock, User, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Anmeldung fehlgeschlagen",
            description: error.message === "Invalid login credentials" 
              ? "Ungültige E-Mail oder Passwort"
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Anmeldung erfolgreich",
            description: "Willkommen zurück!",
          });
        }
      } else {
        const { error } = await signUp(email, password, {
          display_name: displayName,
          company_name: companyName
        });
        if (error) {
          if (error.message === "User already registered") {
            toast({
              title: "Registrierung fehlgeschlagen",
              description: "Ein Benutzer mit dieser E-Mail existiert bereits",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Registrierung fehlgeschlagen",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Registrierung erfolgreich",
            description: "Bitte bestätigen Sie Ihre E-Mail-Adresse",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="p-3 bg-primary rounded-xl">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">immoautomation</span>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Melden Sie sich in Ihrem Konto an' 
                : 'Erstellen Sie Ihr kostenloses Konto'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Ihr vollständiger Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Unternehmen</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Ihr Immobilienunternehmen"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                variant="primary"
              >
                {loading ? 'Wird verarbeitet...' : (isLogin ? 'Anmelden' : 'Registrieren')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {isLogin 
                  ? 'Noch kein Konto? Jetzt registrieren' 
                  : 'Bereits ein Konto? Hier anmelden'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}