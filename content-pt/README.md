# Guia para Colaboradores - Conteúdo em Português

Bem-vindo! Este diretório contém todos os conteúdos do mapa em **formato Markdown**, facilitando a edição e adição de novas músicas, idiomas e textos da interface.

## 📁 Estrutura dos Arquivos

- **musicas.md** - Todas as músicas do mapa com informações sobre país, canção e professor
- **idiomas.md** - Lista de idiomas disponíveis no seletor
- **textos-ui.md** - Textos estáticos da interface (botões, labels, etc.)

## 🎯 Como Usar

### Para Editar Conteúdo Existente

1. Abra o arquivo desejado (musicas.md, idiomas.md ou textos-ui.md)
2. Encontre a seção que deseja editar
3. Edite apenas os campos **sem** a marcação `[NÃO EDITAR]`
4. Salve o arquivo

### Para Adicionar Nova Música

1. Abra `musicas.md`
2. Role até o final do arquivo onde está o **TEMPLATE**
3. Copie todo o template (começando em `## 🎵 [NOME DA MÚSICA]`)
4. Cole acima do template
5. Preencha todos os campos:
   - **ID**: Próximo número disponível (ex: se o último é 16, use 17)
   - **Localização**: Coordenadas do país (busque no Google Maps)
   - **País - Nome**: Nome do país em **inglês** (ex: Brazil, France, China)
   - **País - Bandeira**: Copie o emoji da bandeira do país 🇧🇷
   - **País - Descrição**: Descreva a tradição musical do país
   - **Canção - Autor/Compositor**: Nome do compositor ou "Traditional"
   - **Canção - Arquivo de Áudio**: Nome do arquivo MP3 (ex: media/audio/minha-musica.mp3)
   - **Canção - Descrição**: História e significado da música
   - **Professor - Nome**: Nome completo do professor
   - **Professor - Foto**: Nome do arquivo da foto (ex: media/images/teachers/professor-nome.jpg)
   - **Professor - Link**: Instagram, YouTube ou deixar vazio
   - **Professor - Biografia**: Biografia do professor

### Para Adicionar Novo Idioma

1. Abra `idiomas.md`
2. Role até o final onde está o **Template**
3. Copie o template
4. Cole acima do template
5. Preencha:
   - **Código**: Use formato `xx_yy` (ex: de_de para alemão, it_it para italiano)
   - **Nome no Seletor**: Nome no idioma nativo + tradução em português (ex: "Deutsch - Alemão")

⚠️ **Atenção**: Após adicionar um novo idioma, será necessário traduzir todos os conteúdos em `musicas.md` e `textos-ui.md` para o novo idioma.

### Para Adicionar Novo Texto da Interface

1. Abra `textos-ui.md`
2. Role até o final onde está o **Template**
3. Copie o template
4. Cole acima do template
5. Preencha:
   - **Chave**: Nome identificador em snake_case (ex: welcome_message, click_here)
   - **Contexto**: Onde o texto aparece na interface
   - **Texto em Português**: O texto que será exibido

## ⚠️ Regras Importantes

### O que NÃO pode ser editado:

- Campos marcados com `[NÃO EDITAR]`
- Seções marcadas como **ID**
- Códigos de idiomas
- Chaves de textos da interface
- Nomes de arquivos de mídia (áudio/foto) já existentes

### O que PODE ser editado:

- Descrições de países
- Descrições de canções
- Biografias de professores
- Textos em português da interface
- Links de professores
- Nomes no seletor de idiomas

## 📝 Exemplos Práticos

### Exemplo 1: Adicionando uma nova música do Japão

```markdown
## 🎵 Sakura Sakura

**ID:** 17
**Localização:** 35.6762, 139.6503

### 🌍 País
**Nome:** Japan
**Bandeira:** 🇵🇯
**Descrição:**
O Japão tem tradição milenar de música clássica e popular...

### 🎶 Canção
**Autor/Compositor:** Traditional
**Arquivo de Áudio:** media/audio/sakura-sakura.mp3
**Descrição:**
Canção tradicional japonesa sobre as flores de cerejeira...

### 👤 Professor(a)
**Nome:** Yuki Tanaka
**Foto:** media/images/teachers/yuki-tanaka.jpg
**Link (opcional):** https://instagram.com/yukitanaka
**Biografia:**
Professora de música tradicional japonesa...
```

### Exemplo 2: Editando biografia de professor

**Antes:**
```markdown
**Biografia:**
Músico e ator chinês radicado no Brasil há 25 anos.
```

**Depois:**
```markdown
**Biografia:**
Músico e ator chinês radicado no Brasil há 25 anos, desafia a Magnífica a mergulhar na sonoridade diversa da China. Toca o Sheng, instrumento milenar de sopro. Participou de mais de 50 apresentações com a Orchestra.
```

## 🔄 Processo de Atualização

Após editar os arquivos Markdown:

1. **Salve** o arquivo
2. **Informe** a equipe técnica sobre as alterações
3. A equipe técnica irá:
   - Validar as alterações
   - Converter o Markdown de volta para CSV
   - Atualizar o mapa online

## 💡 Dicas

- Use um editor de Markdown (como VS Code, Typora, ou Notion) para visualizar melhor
- Mantenha as descrições concisas mas informativas
- Sempre revise ortografia e gramática antes de salvar
- Para coordenadas, use Google Maps: clique direito no local → copie as coordenadas
- Para bandeiras, pesquise "emoji bandeira [país]" no Google

## 🆘 Precisa de Ajuda?

- **Dúvidas sobre formato**: Consulte os exemplos existentes nos arquivos
- **Problemas técnicos**: Entre em contato com a equipe técnica
- **Sugestões**: Abra uma issue no repositório ou envie mensagem para a equipe

---

**Data de criação**: Novembro 2024
**Versão**: 1.0
