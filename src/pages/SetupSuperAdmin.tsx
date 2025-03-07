// import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createSuperAdmin } from "../services/supabase";

export default function SetupSuperAdmin() {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleSetup = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const result = await createSuperAdmin("hyathoz@hotmail.com", "123123");

  //     if (result.success) {
  //       alert("Superadmin criado com sucesso! Agora você pode fazer login.");
  //       navigate("/login");
  //     } else {
  //       const errorMessage =
  //         result.error instanceof Error
  //           ? result.error.message
  //           : "Erro ao criar superadmin. Tente novamente.";
  //       setError(`Falha na criação: ${errorMessage}`);
  //     }
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof Error ? err.message : "Erro desconhecido";
  //     setError(`Erro inesperado: ${errorMessage}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Configuração Inicial
          </h2>
          <p className="text-sm text-muted-foreground">
            Criar conta de Super Administrador
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-card-foreground">
              Email: hyathoz@hotmail.com
              <br />
              Senha: 123123
            </p>
          </div>

          {/* {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )} */}

          <button
            // onClick={handleSetup}
            // disabled={loading}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {/* {loading ? "Criando..." : "Criar Super Administrador"} */}
          </button>

          <p className="text-xs text-muted-foreground">
            Nota: Se você já tem uma conta, vá para a{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              página de login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
