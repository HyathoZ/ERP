import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, informe seu e-mail");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSent(true);
      toast.success("E-mail de recuperação enviado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast.error(error.message || "Erro ao solicitar recuperação de senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            {sent ? "Verifique seu e-mail para redefinir sua senha" : "Informe seu e-mail para recuperar sua senha"}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar E-mail de Recuperação"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Lembrou sua senha?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Voltar para login
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Um e-mail foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
            </p>
            <p className="text-center text-sm text-gray-600">Verifique também sua caixa de spam.</p>
            <Button className="w-full mt-4" onClick={() => setSent(false)}>
              Tentar Novamente
            </Button>
            <p className="text-sm text-gray-600 text-center">
              <Link to="/login" className="text-primary hover:underline">
                Voltar para login
              </Link>
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
