import Layout from "~/components/Layout";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

export default function About() {
  return (
    <Layout>
      <Heading level={1}>Bem-vindo a Perfil!</Heading>
      <Heading level={2}>Seção Secundária</Heading>
      <Heading level={3}>Subseção</Heading>
      <Heading level={4}>Título Menor</Heading>
      <Heading level={5}>Título Pequeno</Heading>
      <Heading level={6}>Título Muito Pequeno</Heading>

      <Paragraph>Nisi minim et anim sint qui et proident cillum.</Paragraph>
    </Layout>
  );
}
