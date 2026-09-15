# 🚀 Guia de Instalação - Tesouros da Minha Alma

## 📋 Opções de Uso

### Opção 1: Com Python (Recomendado)
Se você tem Python instalado:

```bash
# Servidor completo
py server.py          # Windows (recomendado)
python server.py      # Linux/Mac/Windows alternativo

# Servidor simples
py start.py           # Windows (recomendado)
python start.py       # Linux/Mac/Windows alternativo

# No Windows (duplo clique)
start.bat             # Detecção automática do Python
start-simple.bat      # Versão simplificada

# Verificar Python disponível
test-python.bat       # Apenas Windows
```

### Opção 2: Sem Python
1. Abra `index.html` diretamente no seu navegador
2. Nota: Modo local com conteúdo limitado (apenas 2 capítulos)
3. Para conteúdo completo, instale Python

### Opção 3: Com outro servidor web
```bash
# Com Node.js (se você tem instalado)
npx http-server

# Com PHP (se você tem instalado)
php -S localhost:8000

# Com Live Server (extensão do VS Code)
# Clique direito em index.html > Open with Live Server
```

## 🐍 Instalação do Python (Se você não tem)

### Windows
1. Vá para [python.org/downloads](https://www.python.org/downloads/)
2. Baixe Python 3.8 ou superior
3. **IMPORTANTE**: Marque "Add Python to PATH" durante a instalação
4. Reinicie seu terminal/prompt de comando

### macOS
```bash
# Com Homebrew
brew install python3

# Ou baixe de python.org
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

## ✅ Verificar Instalação

```bash
python --version
# Deve mostrar: Python 3.x.x
```

## 🔧 Solução de Problemas

### "Python não encontrado"
- **Windows**: Certifique-se de ter marcado "Add to PATH" durante a instalação
- **Todos**: Reinicie seu terminal após instalar Python
- **Windows**: Tente `python3` ao invés de `python`

### "Porta ocupada"
O servidor automaticamente procura uma porta livre entre 8000-8100.

### "Erro de CORS"
Se você abrir `index.html` diretamente sem servidor, algumas funções podem falhar. Use qualquer servidor web local.

### "Arquivos não carregam"
Certifique-se de estar executando o comando do diretório do projeto onde está o `index.html`.

## 🌐 URLs de Acesso

Uma vez iniciado o servidor:
- **Local**: http://localhost:8000
- **Rede local**: http://SEU_IP:8000 (para acessar de outros dispositivos)

## 📱 Uso em Dispositivos Móveis

1. Certifique-se de que seu computador e celular estão na mesma rede WiFi
2. Encontre o IP do seu computador:
   - **Windows**: `ipconfig`
   - **macOS/Linux**: `ifconfig` ou `ip addr`
3. No celular, vá para: `http://IP_DO_SEU_COMPUTADOR:8000`

## 🔄 Atualizar o Projeto

Se você baixar uma nova versão:
1. Substitua os arquivos
2. Mantenha seu conteúdo em `content/` se você adicionou traduções
3. Reinicie o servidor

## 💡 Dicas

- **Favoritos**: Adicione capítulos específicos aos favoritos: `http://localhost:8000/?chapter=5`
- **Atalhos**: Use Ctrl+← e Ctrl+→ para navegação rápida
- **Responsivo**: Funciona em qualquer tamanho de tela
- **Offline**: Uma vez carregado, funciona sem internet