import Layout from "~/components/Layout";

export default function Home() {
  return (
    <Layout>
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-6">
        Academia Unifor
      </h1>
      <p class="text-lg leading-relaxed text-justify">
        A Academia Unifor conta com{" "}
        <strong>equipamentos de última geração</strong>, distribuídos em{" "}
        <strong>área espaçosa e climatizada</strong>, com capacidade de
        atendimento de <strong>1.000 usuários por dia</strong>. Entre as
        modalidades ofertadas estão: <strong>circuito funcional</strong>,{" "}
        <strong>lutas</strong>, <strong>pilates</strong>,{" "}
        <strong>avaliação nutricional</strong> e{" "}
        <strong>avaliação física</strong>. Tudo para alunos, funcionários,
        atletas, público externo e conveniados. A Academia Unifor ainda oferece{" "}
        <strong>estacionamento amplo gratuito</strong>,{" "}
        <strong>fichas digitalizadas</strong> e{" "}
        <strong>professores que seguem em constante atualização</strong> de seus
        conhecimentos e técnicas.
      </p>
      <div class="flex justify-center mt-6">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/7kGH1hscXIs"
          title="Academia Unifor"
          style={{ border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </Layout>
  );
}
