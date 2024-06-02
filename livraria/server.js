const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let livros;

const lerArquivo = () => {
  try {
    const dados = fs.readFileSync('livros.json', 'utf-8');
    livros = JSON.parse(dados).books; 
    if (!Array.isArray(livros)) {
      throw new Error('Formato de dados inválido: livros não é um array');
    }
  } catch (err) {
    console.error('Erro ao ler o arquivo JSON:', err);
    livros = []; 
  }
};

const salvarArquivo = () => {
  try {
    const dados = JSON.stringify({ books: livros }, null, 2); 
    fs.writeFileSync('livros.json', dados, 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar o arquivo JSON:', err);
  }
};

lerArquivo();

app.get('/livros', (req, res) => {
  res.json(livros);
});

app.post('/comprar', (req, res) => {
  const { titulo } = req.body;
  const livro = livros.find(l => l.titulo === titulo);
  
  if (livro) {
    res.status(200).send(`Livro "${titulo}" comprado com sucesso!`);
  } else {
    res.status(404).send('Livro não encontrado!');
  }
});

app.post('/cadastro', (req, res) => {
  const novoLivro = req.body;
  
  livros.push(novoLivro);
  salvarArquivo();
  
  res.status(201).send('Livro cadastrado com sucesso!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});