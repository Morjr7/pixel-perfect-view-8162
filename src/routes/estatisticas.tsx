import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { notaTriEstimada } from "@/lib/enem-data";
import { useEstatisticas, useProgresso } from "@/lib/progresso";

export const Route = createFileRoute("/estatisticas")({
  head: () => ({
    meta: [
      { title: "Estatísticas de estudo — Acelera ENEM" },
      {
        name: "description",
        content: "Acompanhe acertos, erros, aproveitamento por área e evolução semanal dos estudos.",
      },
      { property: "og:title", content: "Estatísticas de estudo — Acelera ENEM" },
      { property: "og:description", content: "Gráficos de desempenho por área e evolução ao longo dos dias." },
    ],
  }),
  component: Estatisticas,
});

const CORES = ["var(--chart-2)", "var(--chart-5)", "var(--chart-3)", "var(--chart-4)"];

function Estatisticas() {
  const { estado } = useProgresso();
  const stats = useEstatisticas();

  const dados = stats.porArea.map((p) => ({ nome: p.area.nome, aproveitamento: p.aproveitamento }));

  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const chave = d.toISOString().slice(0, 10);
    return {
      dia: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      questoes: estado.respostas.filter((r) => r.data.slice(0, 10) === chave).length,
    };
  });

  return (
    <AppShell>
      <PageHeader titulo="Estatísticas" subtitulo="Entenda onde você está evoluindo e onde precisa insistir." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { l: "Questões resolvidas", v: stats.total },
          { l: "Acertos", v: stats.acertos },
          { l: "Erros", v: stats.erros },
          { l: "Tempo de estudo", v: `${Math.floor(stats.tempoEstudo / 60)}h${stats.tempoEstudo % 60}` },
        ].map((c) => (
          <div key={c.l} className="panel p-5">
            <div className="text-3xl font-bold">{c.v}</div>
            <div className="text-sm text-muted-foreground">{c.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold">Aproveitamento por área</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nome" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="aproveitamento" radius={[8, 8, 0, 0]}>
                  {dados.map((_, i) => (
                    <Cell key={i} fill={CORES[i % CORES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-bold">Questões nos últimos 7 dias</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dias}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="questoes"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-bold">Detalhe por área</h2>
          <ul className="mt-4 space-y-4">
            {stats.porArea.map((p) => (
              <li key={p.area.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">
                    {p.area.emoji} {p.area.nome}
                  </span>
                  <span className="text-muted-foreground">
                    {p.acertos}/{p.total} · {p.aproveitamento}%
                  </span>
                </div>
                <Progress value={p.aproveitamento} className="mt-2 h-2" />
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-strong p-5">
          <h2 className="text-lg font-bold">Estimativa de nota no ENEM</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Cálculo simplificado para fins do trabalho escolar.
          </p>
          <div className="mt-6 text-center">
            <div className="font-display text-6xl font-bold text-secondary">
              {notaTriEstimada(stats.acertos, stats.total)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              com {stats.aproveitamento}% de aproveitamento em {stats.total} questões
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
